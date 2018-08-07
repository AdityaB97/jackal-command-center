import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps"
import './bootstrap.css';
import './style.css';
import Toggle from 'react-toggle'


const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    mapTypeId={props.mapTypeId}
    defaultZoom={20}
    defaultCenter={{ lat: 37.874747, lng: -122.258753 }}
  >
    {props.isMarkerShown && <Marker position={props.current_position} />}
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
  </GoogleMap>
))


class Webpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_position: this.props.current_position,
      past_positions: [],
      isPastShown: true,
      mapTypeId: 'roadmap',
      time: Date.now(),
    }
  }

  retrieveData() {
    var request = new XMLHttpRequest();
    var host = location.protocol + '//' + window.location.host;
    request.open('GET', host + '/get_position', false);
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
                current_position={this.state.current_position}
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
          </div>
      </div>
    ) 
  }
}

export default Webpage;
