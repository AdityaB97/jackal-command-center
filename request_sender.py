import requests
import json
import time
import sys
import pickle

if sys.argv[1] == 'local':
    url = 'http://localhost:5000/update_data'
elif sys.argv[1] == 'remote':
    url = 'https://jackal-command-center.herokuapp.com/update_data'

# Load data (deserialize)
with open('test_data.pickle', 'rb') as handle:
    d_bag = pickle.load(handle, encoding='latin1')

# del d_bag['/image_raw']

# with open('coordinates.json', 'r') as f:
#     coordinates = json.load(f)

while True:
    current_time = 0
    
    while current_time <= 52:
        data_to_send = {topic : d_bag[topic][max(0, int((current_time / 52.0) * len(d_bag[topic])) - 1)] for topic in d_bag.keys()}
        data_to_send['/image_raw'] = data_to_send['/image_raw'].tolist()
        r = requests.post(url, data=json.dumps(data_to_send))
        print(r)
        time.sleep(0.1)
        current_time += 0.1

    time.sleep(3)