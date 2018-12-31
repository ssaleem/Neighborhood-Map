import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'

library.add(faLightbulb)

const FS_API_ERR_FALLBACK = 'Sorry something went wrong with Foursquare API...';

class MyMap extends Component {

  constructor(props){
    super(props);
    this.state = {
      foursquareData: {}
    }
    // media query in JS for map styling
    this.x = window.matchMedia("(min-width: 768px)");
    // setting context for 'this' to class
    this.handleState = this.handleState.bind(this);
    this.getinfoWindowData = this.getinfoWindowData.bind(this);
    this.gm_authFailure = this.gm_authFailure.bind(this);
  }

  handleState(title, photo, tip) {
    this.setState(prevState => {
      prevState.foursquareData[title] = {bestPhoto: photo, tip: tip};
      return { state: prevState}
    })
  }

  gm_authFailure(){
    this.props.mapError();
  }

  getinfoWindowData(title, item){
    if(this.state.foursquareData[title]) {
      return this.state.foursquareData[title][item];
    }
    return false;
  }

  mapBounds(){
    let bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < this.props.allLocations.length; i++) {
      bounds.extend(this.props.allLocations[i].location);
    }
    return bounds;
  }

  componentDidUpdate(prevProps){
    //Foursquare data fetch
    if(this.props.allLocations.length !== prevProps.allLocations.length){
      const CLIENT_ID = `${process.env.REACT_APP_FS_CLIENT_ID}`;
      const CLIENT_SECRET = `${process.env.REACT_APP_FS_CLIENT_SECRET}`;
      let seq = Promise.resolve();
      this.props.allLocations.forEach((location) => {
        seq = seq.then(() => {
          fetch(`https://api.foursquare.com/v2/venues/${location.vid}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323`)
          .then(function(response) {
              return response.json()
          })
          .then((response) => {
              if(response.meta.code === 429) {
                return Promise.reject('Foursquare Free Account Quota exceeded');
              }
              else {
                // console.log(response);
                this.handleState(location.title, `${response.response.venue.bestPhoto.prefix}300${response.response.venue.bestPhoto.suffix}`, response.response.venue.tips.groups[0].items[0].text);
              }
          })
          .catch((e) => {
              console.log(e);
              this.handleState(location.title, false, 'Sorry something went wrong with Foursquare API...');
          });
        });
      });
    }
  }

  componentDidMount(){
    // Google Maps API error handling registration
    window.gm_authFailure = this.gm_authFailure;
  }

  render() {
    const {mapClicked, visibleLocations, markerClick, refs, activeMarker, showingInfoWindow, closeInfoWindow, selectedPlace, mapLoaded} = this.props;
    const bounds = this.mapBounds();
    const center = bounds.getCenter();
    const styleMap = {
      position: 'absolute',
      width: '100%',
      height: 'inherit'
    }
    return (
      <div className="mapDiv">{
        !mapLoaded ? <p className="gmap-fail">Ideally, you should see a map here!!! <br/>No map??? :( Sorry something went wrong with Google Maps API</p> :
        <Map
          google={this.props.google}
          zoom={11}
          initialCenter={center}
          bounds={bounds}
          onClick={mapClicked}
          style={styleMap}
          mapTypeControl={false}
          streetViewControl={false}
          zoomControl={this.x.matches ? true: false}>
          {/*animation={(showingInfoWindow && selectedPlace.title === location.title)? this.props.google.maps.Animation.BOUNCE : null}*/}
          {visibleLocations.map((location, index) => (
            <Marker
                title={location.title}
                position={location.location}
                key={index}
                icon={(showingInfoWindow && selectedPlace.title === location.title)? './img/starb.png' : './img/starg.png'}
                onClick={markerClick}
                ref={refs[index]}
                className={"marker"}
                />
            )
          )}
          <InfoWindow
            marker={activeMarker}
            visible={showingInfoWindow}
            onClose={closeInfoWindow}>
              <div className="infowindow">
                <h3>{selectedPlace.title}</h3>
                <div className="attraction-info">
                  {/* if Foursquare fetch is not complete or fetch failed, load fallback image 'ohno.jpg' */}
                  <img src={this.getinfoWindowData(selectedPlace.title, 'bestPhoto') || './img/ohno.jpg'} alt={`${selectedPlace.title}`} className="attraction-img"/>
                  <p className="attraction-tip"><FontAwesomeIcon icon={["far","lightbulb"]} className="bulb-logo"/>  {this.getinfoWindowData(selectedPlace.title, 'tip') || FS_API_ERR_FALLBACK}</p>
                </div>
              </div>
          </InfoWindow>

        </Map>}
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: `${process.env.REACT_APP_GM_API_KEY}`
})(MyMap)
