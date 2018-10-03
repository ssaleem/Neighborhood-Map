import React, { Component } from 'react';
import './App.css';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import List from './components/List'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {lat: 28.012967, lng: -82.46937},
      zoom: 12,
      locations: [
        {title: 'Busch Gardens',       category: 'Amusement Park', location: {lat: 28.037216, lng: -82.41949}},
        {title: 'Adventure Island',    category: 'Amusement Park', location: {lat: 28.041735, lng: -82.413059}},
        {title: 'Tampa Museum of Art', category: 'Museum',         location: {lat: 27.949432, lng: -82.462303}},
        {title: 'The Florida Museum of Photographic Arts', category: 'Museum', location: {lat: 27.947299, lng: -82.460134}},
        {title: 'Lettuce Lake Park',   category: 'Nature and Outdoor', location: {lat: 28.073871, lng: -82.375376}},
        {title: 'Rowlett Park',        category: 'Nature and Outdoor', location: {lat: 28.026066, lng: -82.431743}}
      ],
      categories: [ 'Amusement Park', 'Museum', 'Nature and Outdoor'],
      filteredLocations: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      markers: []
    };
    this.markerRefs = this.state.locations.map(() => React.createRef());
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  openInfoWindow(props, marker){
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }

  closeInfoWindow(){
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    })
  }

  onMarkerClick(props, marker){
    this.openInfoWindow(props, marker)
  }

  onListClick(index){
    console.log(this.markerRefs)
    this.openInfoWindow(this.markerRefs[index].current.props, this.markerRefs[index].current.marker)
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  onSelectCategory(category){
    console.log(category)
    if(category === 'all'){
      this.setState({
        filteredLocations: []
      })
    }
    else {
      this.setState({
        filteredLocations: (this.state.locations.filter(location => location.category === category))
      })
    }
    console.log(this.state.filteredLocations)
  }

  mapBounds(){
    var bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < this.state.locations.length; i++) {
      bounds.extend(this.state.locations[i].location);
    }
    return bounds;
  }

  render() {
    return (
      <div className="app">
        <h1 className="app-title">Things to Do in Tampa</h1>
        <div className="menu">
          <select name="attractions" className="attractions-select" onChange={event => this.onSelectCategory(event.target.value)}>
            <option value="all">Select Category</option>
            {this.state.categories.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>
          <List
            attractions={this.state.filteredLocations.length === 0 ? this.state.locations : this.state.filteredLocations}
            listClick={(index) => this.onListClick(index)}
          />
        </div>

        <div className="mapDiv">
          <Map
            google={this.props.google}
            zoom={11}
            initialCenter={this.state.center}
            bounds={this.mapBounds()}
            onClick={this.onMapClicked}
            style= {{
              position: 'relative',
              width: '70%',
              height: '92vh'}
            }
            >
            {(this.state.filteredLocations.length === 0 ? this.state.locations : this.state.filteredLocations).map((location, index) => (
              <Marker
                  name={'Current location'}
                  title={location.title}
                  position={location.location}
                  key={index}
                  onClick={this.onMarkerClick}
                  ref={this.markerRefs[index]}/>
              )
            )}
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
              onClose={this.closeInfoWindow}>
                <div>
                  <h1>{this.state.selectedPlace.title}</h1>
                </div>
            </InfoWindow>

          </Map>
        </div>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCAMTYGR5XftpFpKDTIa-v3qMF2DzYlyS0'
})(App)
