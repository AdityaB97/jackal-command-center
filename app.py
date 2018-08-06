import os
import json
from flask import Flask, render_template, request

port = os.environ.get('PORT', '5000')

template_dir = os.path.abspath('./src')
app = Flask(__name__, template_folder=template_dir)


class GPS:
    def __init__(self):
        self.current_position = {
            'lat': 37.874747,
            'lng': -122.258753,
        }

    def update_position(self, new_position):
        self.current_position = new_position

gps = GPS()


@app.route('/', methods=['GET'])
def hello_world():
    return render_template('index.html', current_position=gps.current_position)


@app.route('/update_position', methods=['POST'])
def update_position():
    gps.update_position(json.loads(request.data))
    return 'Received!'


@app.route('/get_position', methods=['GET'])
def get_position():
    return json.dumps(gps.current_position)


if __name__ == '__main__':
    app.run(debug=True, port=port)