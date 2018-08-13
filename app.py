import os
import json
from flask import Flask, render_template, request
import numpy as np
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
from datetime import datetime
import cv2
import math

template_dir = os.path.abspath('./src')
app = Flask(__name__, template_folder=template_dir)


class JackalData:
    def __init__(self):
        self.current_position = {
            'lat': 37.874747,
            'lng': -122.258753,
        }
        self.last_recorded_position = self.current_position
        self.past_positions = []
        self.wifi_connected = False
        self.collision = {
            'any': True,
            'close': True,
            'flipped': True,
            'stuck': True,
        }
        self.odometry = {
            'linear': 0,
            'angular': 0,
        }
        self.cmd_vel = {
            'linear': 0,
            'angular': 0,   
        }
        self.image_raw = np.zeros((360, 480, 3))
        current_time = str(datetime.now()).replace(' ', '_')
        self.current_image_url = 'static/current_image' + current_time + '.png'
        plt.imsave(self.current_image_url, self.image_raw)

        self.last_transmission_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def update_data(self, data):
        self.current_position = self.process_navsat(data['/navsat/fix'])
        if not (self.current_position['lat'] == 'None' or self.current_position['lng'] == 'None'):
            self.last_recorded_position = self.current_position

            self.past_positions.append(self.last_recorded_position)
            if len(self.past_positions) > 200:
                self.past_positions.pop(0)
        
        self.wifi_connected = data['/wifi_connected']['data']
        
        self.collision = {
            'any': data['/collision/any']['data'],
            'close': data['/collision/close']['data'],
            'flipped': data['/collision/flipped']['data'],
            'stuck': data['/collision/stuck']['data'],
        }
        
        self.odometry = self.process_odometry(data['/odometry/filtered'])
        
        self.cmd_vel = self.process_cmd_vel(data['/cmd_vel'])
        
        old_image_url = self.current_image_url
        
        self.image_raw = cv2.resize(np.array(data['/image_raw'], dtype='uint8'), (480, 360))
        current_time = str(datetime.now()).replace(' ', '_')
        self.current_image_url = 'static/current_image' + current_time + '.png'
        plt.imsave(self.current_image_url, self.image_raw)

        if os.path.isfile(old_image_url):
            os.remove(old_image_url)

        self.last_transmission_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        self.ip_address = data['ip_address']

    def process_navsat(self, navsat):
        return {
            'lat': navsat['latitude'] if not math.isnan(navsat['latitude']) else 'None',
            'lng': navsat['longitude'] if not math.isnan(navsat['longitude']) else 'None',
        }

    def process_odometry(self, odometry):
        return {
            'linear': odometry['twist']['twist']['linear']['x'],
            'angular': odometry['twist']['twist']['angular']['z'],
        }

    def process_cmd_vel(self, cmd_vel):
        return {
            'linear': cmd_vel['linear']['x'],
            'angular': cmd_vel['angular']['z'],
        }

    def to_dict(self, use_json=False):
        dict_to_return = {
            'current_position': self.current_position,
            'past_positions': self.past_positions,
            'wifi_connected': self.wifi_connected,
            'collision': self.collision,
            'odometry': self.odometry,
            'cmd_vel': self.cmd_vel,
            'current_image_url': self.current_image_url,
            'last_transmission_time': self.last_transmission_time,
            'last_recorded_position': self.last_recorded_position,
            'ip_address': self.ip_address,
        }
        if use_json:
            return json.dumps(dict_to_return)
        else:
            return dict_to_return

jackal = JackalData()


@app.route('/', methods=['GET'])
def render():
    return render_template('index.html', initial_data=jackal.to_dict(use_json=False))


@app.route('/update_data', methods=['POST'])
def update_data():
    data = json.loads(request.data)
    jackal.update_data(data)
    return 'Received!'


@app.route('/get_data', methods=['GET'])
def get_data():
    return jackal.to_dict(use_json=True)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

