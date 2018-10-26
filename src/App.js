import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import './App.css';
import Sidebar from './components/Sidebar'
import MyMap from './components/MyMap'

library.add(faBars, faGithub)

const VENUE_COUNT = 10;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      categories: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      menuClicked: false,
      googleMapLoaded: true,
      selectedCategory: 'all'
    };
    // Refs are used to store marker node references in an array and ilink locations in sidebar with markers
    // more on refs => https://reactjs.org/docs/refs-and-the-dom.html
    this.markerRefs = [];
    for(let i = 0; i < VENUE_COUNT; i++){
      this.markerRefs.push(React.createRef());
    }
    // setting context for 'this' to class
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.onListClick = this.onListClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.onMenuClicked = this.onMenuClicked.bind(this);
    this.onMapError = this.onMapError.bind(this);
  }

  componentDidMount(){
    const CLIENT_ID = `${process.env.REACT_APP_FS_CLIENT_ID}`;
    const CLIENT_SECRET = `${process.env.REACT_APP_FS_CLIENT_SECRET}`;

    fetch(`https://api.foursquare.com/v2/venues/explore?near=Tampa&section&limit=${VENUE_COUNT}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323`)
    .then(function(response) {
          return response.json()
      })
    .then((response) => {
        let fslocations = response.response.groups[0].items;
        let locs = [];
        let cats = [];
        // console.log(fslocations);
        fslocations.forEach(fsloc => {
          let loc = {};
          loc['title'] = fsloc.venue.name;
          loc['category'] = fsloc.venue.categories[0].name;
          loc['location'] = {lat: fsloc.venue.location.lat, lng: fsloc.venue.location.lng} ;
          loc['vid'] = fsloc.venue.id;
          loc['icon'] = `${fsloc.venue.categories[0].icon.prefix}32${fsloc.venue.categories[0].icon.suffix}`;
          locs.push(loc);
          !cats.includes(loc['category']) && cats.push(loc['category']);
        })
        this.setState({categories: cats, locations: locs});
    })
    .catch((e) => {
      console.log(e);
    })
  }

  openInfoWindow(props, marker){
    console.log(marker);
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

  //retrieve the appropriate marker and props based on index of location clicked in sidebar
  //indexes in filtered list of location correspond to indexs in markerRefs array
  onListClick(index){
    this.state.googleMapLoaded && this.openInfoWindow(this.markerRefs[index].current.props, this.markerRefs[index].current.marker);
    this.setState({
      menuClicked: false
    })
  }

  onMapClicked(){
    this.state.showingInfoWindow && this.closeInfoWindow();
    if(this.state.menuClicked){
      this.setState({
        menuClicked: false
      })
    }
  }

  onSelectCategory(category){
    this.setState({
      selectedCategory: category
    })
  }

  onMenuClicked(){
    this.setState({
      menuClicked: (this.state.menuClicked ? false : true)
    })
  }

  onMapError(){
    this.setState({
      googleMapLoaded: false
    })
  }

  render() {
    let visibleLocations = this.state.locations;
    let category = this.state.selectedCategory;
    if(category !== 'all'){
      visibleLocations = this.state.locations.filter(location => location.category === category)
    }
    return (
      <div className="app">
        <header className="head">
          {/* menu icon available only on smaller screens for responsive design*/}
          <FontAwesomeIcon icon="bars" className="open-sidebar" tabIndex="0" onClick={this.onMenuClicked}/>
          <h1 className="app-title"><span>Trending</span> in Tampa Bay</h1>
        </header>

        <div className="main">
          <Sidebar
            categories={this.state.categories}
            visibleLocations={visibleLocations}
            selectCategory={this.onSelectCategory}
            listClick={this.onListClick}
            classname={this.state.menuClicked ? "sidebar-expanded" : "sidebar"  /* show/hide sidebar */}
          />

          <MyMap
            mapClicked={this.onMapClicked}
            visibleLocations={visibleLocations}
            markerClick={this.openInfoWindow}
            refs={this.markerRefs}
            activeMarker={this.state.activeMarker}
            showingInfoWindow={this.state.showingInfoWindow}
            closeInfoWindow={this.closeInfoWindow}
            selectedPlace={this.state.selectedPlace}
            allLocations={this.state.locations}
            mapLoaded={this.state.googleMapLoaded}
            mapError={this.onMapError}
          />
        </div>
      </div>
    )
  }
}

export default App
