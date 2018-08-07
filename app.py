import os
import json
from flask import Flask, render_template, request

template_dir = os.path.abspath('./src')
app = Flask(__name__, template_folder=template_dir)


class JackalData:
    def __init__(self):
        self.current_position = {
            'lat': 37.874747,
            'lng': -122.258753,
        }
        self.past_positions = []

    def update_position(self, new_position):
        self.past_positions.append(self.current_position)
        if len(self.past_positions) > 200:
            self.past_positions.pop(0)
        self.current_position = new_position

jackal = JackalData()


@app.route('/', methods=['GET'])
def render():
    return render_template('index.html', current_position=jackal.current_position)


@app.route('/update_position', methods=['POST'])
def update_position():
    jackal.update_position(json.loads(request.data))
    return 'Received!'


@app.route('/get_position', methods=['GET'])
def get_position():
    return json.dumps({
        'current_position': jackal.current_position,
        'past_positions': jackal.past_positions,
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)