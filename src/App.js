import React, { Component } from 'react';
import ReactGA from 'react-ga';
import './App.scss';
import Sidebar from './components/Sidebar'
import MyMap from './components/MyMap'

// Google analytics info
ReactGA.initialize('UA-129370123-4');
ReactGA.pageview(window.location.pathname + window.location.search);

//Maximum number of venues displayed
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
      googleMapLoaded: true,
      selectedCategory: 'all'
    };
    // Refs are used to store marker node references in an array and to link locations in sidebar with markers
    // more on refs => https://reactjs.org/docs/refs-and-the-dom.html
    this.markerRefs = [];
    for(let i = 0; i < VENUE_COUNT; i++){
      this.markerRefs.push(React.createRef());
    }
    // setting context for 'this' inside methods to App class
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.onListClick = this.onListClick.bind(this);
    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.onMapError = this.onMapError.bind(this);
  }

  //Fetch trending venues list through Foursquare API
  componentDidMount(){
    //Foursquare API credentials
    const CLIENT_ID = `${process.env.REACT_APP_FS_CLIENT_ID}`;
    const CLIENT_SECRET = `${process.env.REACT_APP_FS_CLIENT_SECRET}`;

    fetch(`https://api.foursquare.com/v2/venues/explore?near=Tampa&section=trending&limit=${VENUE_COUNT}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323`)
    .then((response) => response.json())
    .then((response) => {
        let fslocations = response.response.groups[0].items;
        let venues = [];
        let cats = [];
        // console.log(fslocations);
        fslocations.forEach(fsloc => {
          let loc = {};
          loc['title'] = fsloc.venue.name;
          loc['category'] = fsloc.venue.categories[0].name;
          loc['location'] = {lat: fsloc.venue.location.lat, lng: fsloc.venue.location.lng} ;
          loc['vid'] = fsloc.venue.id;
          loc['icon'] = `${fsloc.venue.categories[0].icon.prefix}32${fsloc.venue.categories[0].icon.suffix}`;
          loc['address'] = `${fsloc.venue.location.address}, ${fsloc.venue.location.formattedAddress[1]}`;
          venues.push(loc);
          !cats.includes(loc['category']) && cats.push(loc['category']);
        })
        this.setState({categories: cats, locations: venues});
    })
    .catch((e) => console.log(e))
  }

  //Google map is not loaded successfully
  onMapError(){
    this.setState({ googleMapLoaded: false })
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
      activeMarker: null,
      selectedPlace: {}
    })
  }

  //retrieve the appropriate marker and props based on index of location clicked in sidebar
  //indexes in filtered list of location correspond to indexs in markerRefs array
  onListClick(index){
    this.state.googleMapLoaded && this.openInfoWindow(this.markerRefs[index].current.props, this.markerRefs[index].current.marker);
  }


  // When a venue category is selected from drop-down, close any open infowindow and update state
  onSelectCategory(category){
    this.state.showingInfoWindow && this.closeInfoWindow();
    this.setState({ selectedCategory: category});
  }



  render() {
    let category = this.state.selectedCategory;
    let visibleLocations = (category !== 'all') ? this.state.locations.filter(location => location.category === category) : this.state.locations;

    return (
      <div className="app">
        <header>
          <h1 className="app-title"><span>Trending</span> in Tampa Bay</h1>
        </header>

        <main>
          <Sidebar
            categories={this.state.categories}
            visibleLocations={visibleLocations}
            selectCategory={this.onSelectCategory}
            listClick={this.onListClick}
            selectedPlace={this.state.selectedPlace}
          />
          <MyMap
            visibleLocations={visibleLocations}
            markerClick={this.openInfoWindow}
            refs={this.markerRefs}
            activeMarker={this.state.activeMarker}
            showingInfoWindow={this.state.showingInfoWindow}
            closeInfoWindow={this.closeInfoWindow}
            selectedPlace={this.state.selectedPlace}
            allLocations={this.state.locations}
            mapLoaded={this.state.googleMapLoaded}
            mapError={this.onMapError}/>

        </main>
      </div>
    )
  }
}

export default App
