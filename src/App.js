import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import './App.css';
import Sidebar from './components/Sidebar'
import MyMap from './components/MyMap'

library.add(faBars, faGithub)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {lat: 28.007216, lng: -82.41949},
      zoom: 11,
      locations: [
        {title: 'Busch Gardens',       category: 'Amusement Park', location: {lat: 28.037216, lng: -82.41949}, vid: '4b0586c3f964a5202a6d22e3'},
        {title: 'Adventure Island',    category: 'Amusement Park', location: {lat: 28.041735, lng: -82.413059}, vid: '4b0586c3f964a520376d22e3'},
        {title: 'Tampa Museum of Art', category: 'Museum',         location: {lat: 27.949432, lng: -82.462303}, vid: '533d6e8d498e73f51252b9b2'},
        {title: 'The Florida Museum of Photographic Arts', category: 'Museum', location: {lat: 27.947299, lng: -82.460134}, vid: '4b0586c4f964a5206a6d22e3'},
        {title: 'Lettuce Lake Park',   category: 'Nature and Outdoor', location: {lat: 28.073871, lng: -82.375376}, vid: '4b455a19f964a520270b26e3'},
        {title: 'Rowlett Park',        category: 'Nature and Outdoor', location: {lat: 28.026066, lng: -82.431743}, vid: '4cb39435b4b0a35d63c661ce'}
      ],
      categories: [ 'Amusement Park', 'Museum', 'Nature and Outdoor'],
      filteredLocations: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      menuClicked: false
    };
    // Refs to link list items with markers
    this.markerRefs = this.state.locations.map(() => React.createRef());
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onListClick = this.onListClick.bind(this);
    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.onMenuClicked = this.onMenuClicked.bind(this);
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
      this.closeInfoWindow();
    }
    if(this.state.menuClicked){
      this.setState({
        menuClicked: false
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

  onMenuClicked(){
    this.setState({
      menuClicked: (this.state.menuClicked ? false : true)
    })
  }

  render() {
    return (
      <div className="app">
        <header className="head">
          <FontAwesomeIcon icon="bars" className="app-menu" onClick={this.onMenuClicked}/>
          <h1 className="app-title">Things to Do in Tampa Bay</h1>
        </header>

        <Sidebar
          categories={this.state.categories}
          visibleLocations={this.state.filteredLocations.length === 0 ? this.state.locations : this.state.filteredLocations}
          selectCategory={this.onSelectCategory}
          listClick={this.onListClick}
          classname={this.state.menuClicked ? "sidebar-expanded" : "sidebar"}
        />

        <MyMap
          zoom={this.state.zoom}
          center={this.state.center}
          mapClicked={this.onMapClicked}
          visibleLocations={this.state.filteredLocations.length === 0 ? this.state.locations : this.state.filteredLocations}
          markerClick={this.onMarkerClick}
          refs={this.markerRefs}
          activeMarker={this.state.activeMarker}
          showingInfoWindow={this.state.showingInfoWindow}
          closeInfoWindow={this.closeInfoWindow}
          selectedPlace={this.state.selectedPlace}
          allLocations={this.state.locations}
        />

        <footer className="footer">
          <a href="https://github.com/ssaleem"><p><FontAwesomeIcon icon={["fab", "github"]} /> ssaleem</p></a>
        </footer>
      </div>
    )
  }
}

export default App
