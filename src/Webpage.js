import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import './bootstrap.css';

const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    mapTypeId='roadmap'
    defaultZoom={20}
    defaultCenter={{ lat: 37.874747, lng: -122.258753 }}
  >
    {props.isMarkerShown && <Marker position={props.current_position} />}
  </GoogleMap>
))


class Webpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_position: this.props.current_position,
      time: Date.now(),
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      var request = new XMLHttpRequest();
      var host = location.protocol + '//' + window.location.host;
      request.open('GET', host + '/get_position', false);
      request.send(null);
      this.setState({current_position: JSON.parse(request.responseText)})
    }, 80);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div align='center'>
        <h1 style={{marginTop: '10px'}}>Jackal Command Center</h1>
        <div style={{display: 'inline-block', margin: '50px', border: '5px solid pink'}}>
          <MapComponent
            isMarkerShown
            current_position={this.state.current_position}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAlRoFEv9ui2M-0rUJqCn7Pycd1kNknAzk&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `500px`, width: `1000px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    ) 
  }
}

export default Webpage;
