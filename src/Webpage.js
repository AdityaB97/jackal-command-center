import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps"
import './bootstrap.css';
import './style.css';
import Toggle from 'react-toggle'

function convertGeofenceFormat(coords) {
  return coords.map(coord => ({
    lat: coord[0],
    lng: coord[1],
  }))
}

// var geofenceCoordinates = [
//   [37.915520, -122.334836],
//   [37.915282, -122.333973],
//   [37.914278, -122.334377],
//   [37.914555, -122.335299],
//   [37.915520, -122.334836],
// ]

var geofenceCoordinates = [
  [37.874712, -122.258581],
  [37.874567, -122.258531],
  [37.874616, -122.258306],
  [37.874763, -122.258354],
  [37.874712, -122.258581],
]


var geofence = convertGeofenceFormat(geofenceCoordinates)


const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    mapTypeId={props.mapTypeId}
    defaultZoom={20}
    defaultCenter={{ lat: 37.874609, lng: -122.258330 }}
  >
    {props.isMarkerShown && <Marker position={props.last_recorded_position} />}
    {props.isPastShown && <Polyline 
      path={props.past_positions}
      options={{ 
        strokeColor: '#ff2343',
        strokeOpacity: '1.0',
        strokeWeight: 2,
        icons: [{ 
          icon: "hello",
          offset: '0',
          repeat: '10px'
        }],
      }}
      />
    }
    <Polyline 
      path={geofence}
      options={{ 
        strokeColor: '#32CD32',
        strokeOpacity: '1.0',
        strokeWeight: 2,
        icons: [{ 
          icon: "hello",
          offset: '0',
          repeat: '10px'
        }],
      }}
      />
  </GoogleMap>
))


class Webpage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      current_position: this.props.initial_data.current_position,
      past_positions: this.props.initial_data.past_positions,
      wifi_connected: this.props.initial_data.past_positions,
      collision: this.props.initial_data.collision,
      odometry: this.props.initial_data.odometry,
      cmd_vel: this.props.initial_data.cmd_vel,
      current_image_url: this.props.initial_data.current_image_url,
      last_transmission_time: this.props.initial_data.last_transmission_time,
      last_recorded_position: this.props.initial_data.last_recorded_position,
      ip_address: this.props.initial_data.ip_address,
      isPastShown: true,
      mapTypeId: 'roadmap',
      time: Date.now(),
    }
  }

  retrieveData() {
    var request = new XMLHttpRequest();
    var host = location.protocol + '//' + window.location.host;
    request.open('GET', host + '/get_data', false);
    request.send(null);
    return JSON.parse(request.responseText)
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      var data = this.retrieveData()
      this.setState(data)
    }, 80);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  togglePastHandler(e) {
    this.setState({ isPastShown: !this.state.isPastShown });
  }

  mapTypeIdHandler(id) {
    return () => {
      this.setState({ mapTypeId: id });
    }
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h1 style={{marginTop: '10px'}}>Jackal Command Center</h1>
          <div style={{textAlign: 'left', display: 'inline-block', margin: '50px'}}>
            <div style={{border: '5px solid pink'}}>
              <MapComponent
                isMarkerShown
                last_recorded_position={this.state.last_recorded_position}
                past_positions={this.state.past_positions}
                isPastShown={this.state.isPastShown}
                mapTypeId={this.state.mapTypeId}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAlRoFEv9ui2M-0rUJqCn7Pycd1kNknAzk&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `500px`, width: `1000px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </div>
            <div style={{margin: '30px 0'}}>
              <label style={{margin: '0 100px 0 0'}}>
                <span style={{display: 'inline-block', verticalAlign: 'top', margin: '0 10px 0 0'}}>Toggle path</span>
                <Toggle
                  checked={this.state.isPastShown}
                  onChange={(e) => this.togglePastHandler(e)}
                />
              </label>
              <div style={{margin: '0 150px', display: 'inline-block'}}>
                <div className='btn-group' role='group' aria-label='Basic example'>
                  <button type='button' className={'btn btn-secondary' + (this.state.mapTypeId == 'roadmap' ? ' active' : '')} onClick={() => this.mapTypeIdHandler('roadmap')()}>Roadmap</button>
                  <button type='button' className={'btn btn-secondary' + (this.state.mapTypeId == 'satellite' ? ' active' : '')} onClick={() => this.mapTypeIdHandler('satellite')()}>Satellite</button>
                  <button type='button' className={'btn btn-secondary' + (this.state.mapTypeId == 'hybrid' ? ' active' : '')} onClick={() => this.mapTypeIdHandler('hybrid')()}>Hybrid</button>
                </div>
              </div>
            </div>
            <div style={{margin: '100px 0'}}>
              <img src={this.state.current_image_url} alt={'Current Image'} style={{verticalAlign: 'top', margin: '0 100px 0 0', border: '5px solid pink'}}/>
              <div style={{display: 'inline-block'}}>
                <p>Last transmission time: <font color='blue'>{this.state.last_transmission_time}</font></p>
                <p>IP address: <font color='blue'>{this.state.ip_address}</font></p>
                <ul style={{display: 'inline-block'}}>
                  <li>/wifi_connected: {this.state.wifi_connected ? <font color='#32CD32'>True</font> : <font color='red'>False</font>} </li>
                  <li>/navsat/fix
                    <ul>
                      <li>latitude: <font color='blue'>{this.state.current_position.lat}</font></li>
                      <li>longitude: <font color='blue'>{this.state.current_position.lng}</font></li>
                    </ul>
                  </li>
                  <li>/collision
                    <ul>
                      <li>/collision/any: {this.state.collision.any ? <font color='#32CD32'>True</font> : <font color='red'>False</font>}</li>
                      <li>/collision/close: {this.state.collision.close ? <font color='#32CD32'>True</font> : <font color='red'>False</font>}</li>
                      <li>/collision/flipped: {this.state.collision.flipped ? <font color='#32CD32'>True</font> : <font color='red'>False</font>}</li>
                      <li>/collision/stuck: {this.state.collision.stuck ? <font color='#32CD32'>True</font> : <font color='red'>False</font>}</li>
                    </ul>
                  </li>
                  <li>/odometry
                    <ul>
                      <li>linear: <font color='blue'>{this.state.odometry.linear}</font></li>
                      <li>angular: <font color='blue'>{this.state.odometry.angular}</font></li>
                    </ul>
                  </li>
                  <li>/cmd_vel
                    <ul>
                      <li>linear: <font color='blue'>{this.state.cmd_vel.linear}</font></li>
                      <li>angular: <font color='blue'>{this.state.cmd_vel.angular}</font></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
      </div>
    ) 
  }
}

export default Webpage;
