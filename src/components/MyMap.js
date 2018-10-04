import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class MyMap extends Component {

  constructor(props){
    super(props);
    this.state = {
      foursquareData: (new Array(this.props.allLocations.length)),
    }
    this.handleState = this.handleState.bind(this);
    this.getfoursquareData = this.getfoursquareData.bind(this);
  }

  handleState(index, photo, tip) {
    this.setState(prevState => {
      console.log(prevState);
      prevState.foursquareData[index] = {bestPhoto: photo, tip: tip};
      // prevState.foursquareData[index]['bestPhoto'] = photo;
      // prevState.foursquareData[index]['tip'] = tip;
      return { state: prevState}
    })
  }

  getfoursquareData(location,index){
    const CLIENT_ID = 'T1SIPR5QIKMB0QII1WSUCSIG4EF2CTYTVSNZ3SPOUOVK4VMD';
    const CLIENT_SECRET = 'LZ24XCHKRVDAOSS4RSEBF0EVDV1XDHGKO0WHZXHSACLD0WFI';
      fetch(`https://api.foursquare.com/v2/venues/${location.vid}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323`)
      .then(function(response) {
          return response.json()
      })
      .then((response) => {
          console.log(response)
          console.log(this)
          // this.state.foursquareData[index]['bestPhoto'] = `${response.response.venue.bestPhoto.prefix}300${response.response.venue.bestPhoto.suffix}`;
          // this.state.foursquareData[index]['tip'] = response.response.venue.tips.groups[0].items[0].text;
          this.handleState(index, `${response.response.venue.bestPhoto.prefix}300${response.response.venue.bestPhoto.suffix}`, response.response.venue.tips.groups[0].items[0].text)
      })
      .catch((e) => {
          console.log(e);
          console.log(this);
          this.handleState(index, 'n/a', 'n/a');

      });
  }

  mapBounds(){
    var bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < this.props.allLocations.length; i++) {
      bounds.extend(this.props.allLocations[i].location);
    }
    return bounds;
  }

  componentDidMount(){
    // this.props.allLocations.forEach(this.getfoursquareData);
  }

  render() {
    const {zoom, center, mapClicked, visibleLocations, markerClick, refs, activeMarker, showingInfoWindow, closeInfoWindow, selectedPlace} = this.props;
    const styleInfoWindow = {
      width: '250px',
      height: '140px'
    }
    return (
      <div className="mapDiv">
        <Map
          google={this.props.google}
          zoom={zoom}
          initialCenter={center}
          bounds={this.mapBounds()}
          onClick={mapClicked}
          style= {{
            position: 'relative',
            width: '70%',
            height: '90vh'}
          }
          >
          {visibleLocations.map((location, index) => (
            <Marker
                name={'Current location'}
                title={location.title}
                position={location.location}
                key={index}
                onClick={markerClick}
                ref={refs[index]}/>
            )
          )}
          <InfoWindow
            marker={activeMarker}
            visible={showingInfoWindow}
            onClose={closeInfoWindow}
            style={styleInfoWindow}>
              <div className="infowindow">
                <h3>{selectedPlace.title}</h3>
                <div className="attraction-info">
                  <img src={'https://igx.4sqi.net/img/general/300/mJnF-aF4xsrLFDJWoJ5fa3eigTKoqlRlkNgiWXRJQ5c.jpg'} alt={`${selectedPlace.title}`} className="attraction-img"/>
                  <p className="attraction-tip">Sample tip Sample tip Sample tip Sample tip Sample tip</p>
                </div>
              </div>
          </InfoWindow>

        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCAMTYGR5XftpFpKDTIa-v3qMF2DzYlyS0'
})(MyMap)
