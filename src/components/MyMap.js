import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import ohno from '../img/ohno.jpg';

class MyMap extends Component {

  constructor(props){
    super(props);
    this.state = {
      foursquareData: (new Array(this.props.allLocations.length))
    }
    // media query in JS for map styling
    this.x = window.matchMedia("(min-width: 650px)");
    this.handleState = this.handleState.bind(this);
    // setting context for 'this' to class
    this.getTip = this.getTip.bind(this);
    this.getPhoto = this.getPhoto.bind(this);
    this.gm_authFailure = this.gm_authFailure.bind(this);
  }

  handleState(index, title, photo, tip) {
    this.setState(prevState => {
      prevState.foursquareData[index] = {title: title, bestPhoto: photo, tip: tip};
      return { state: prevState}
    })
  }

  gm_authFailure(){
    this.props.mapError();
  }

  getTip(title){
    for(const entry of this.state.foursquareData){
      if(entry && entry.title === title){
        return entry.tip;
      }
      else {
        return 'Sorry something went wrong with Foursquare API...';
      }
    }
  }

  getPhoto(title){
    for(const entry of this.state.foursquareData){
      if(entry){
        if(entry.title === title){
          return entry.bestPhoto;
        }
      }
      else {
        return false;
      }
    }
  }

  mapBounds(){
    let bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < this.props.allLocations.length; i++) {
      bounds.extend(this.props.allLocations[i].location);
    }
    return bounds;
  }

  componentDidMount(){
    // Google Maps API error handling registration
    window.gm_authFailure = this.gm_authFailure;
    // Foursquare data fetch
    const CLIENT_ID = 'T1SIPR5QIKMB0QII1WSUCSIG4EF2CTYTVSNZ3SPOUOVK4VMD';
    const CLIENT_SECRET = 'LZ24XCHKRVDAOSS4RSEBF0EVDV1XDHGKO0WHZXHSACLD0WFI';
    let seq = Promise.resolve();
    this.props.allLocations.forEach((location,index) => {
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
              this.handleState(index, location.title, `${response.response.venue.bestPhoto.prefix}300${response.response.venue.bestPhoto.suffix}`, response.response.venue.tips.groups[0].items[0].text);
            }
        })
        .catch((e) => {
            console.log(e);
            this.handleState(index, location.title, false, 'Sorry something went wrong with Foursquare API...');
        });
      });
    });

  }

  render() {
    const {zoom, center, mapClicked, visibleLocations, markerClick, refs, activeMarker, showingInfoWindow, closeInfoWindow, selectedPlace, mapLoaded} = this.props;
    const bounds = this.mapBounds();
    // const center = bounds.getCenter();
    const wMap = this.x.matches ? '70%' : '98%';
    const styleMap = {
      position: 'relative',
      width: wMap,
      height: '87vh'
    }
    return (
      <div className="mapDiv">{
        !mapLoaded ? "Sorry something went wrong with Google Maps API" :
        <Map
          google={this.props.google}
          zoom={zoom}
          initialCenter={center}
          bounds={bounds}
          onClick={mapClicked}
          style={styleMap}
          mapTypeControl={false}>

          {visibleLocations.map((location, index) => (
            <Marker
                title={location.title}
                position={location.location}
                key={index}
                icon={(showingInfoWindow && selectedPlace.title === location.title)? 'http://maps.google.com/mapfiles/ms/icons/blue.png' : undefined}
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
                  <img src={this.getPhoto(selectedPlace.title) || ohno} alt={`${selectedPlace.title}`} className="attraction-img"/>
                  <p className="attraction-tip">{this.getTip(selectedPlace.title)}</p>
                </div>
              </div>
          </InfoWindow>

        </Map>}
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCAMTYGR5XftpFpKDTIa-v3qMF2DzYlyS0'
})(MyMap)
