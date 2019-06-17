import React, {Component} from 'react';
import ReactGA from 'react-ga';
import * as FSAPI from './utils/foursquareAPI';
import Sidebar from './components/Sidebar';
import MyMap from './components/MyMap';
import './App.scss';

// Google analytics info
ReactGA.initialize ('UA-129370123-4');
ReactGA.pageview (window.location.pathname + window.location.search);

class App extends Component {
  constructor (props) {
    super (props);
    // Refs are used to store marker node references in an array and to link locations in sidebar with markers
    this.markerRefs = [];
    for (let i = 0; i < FSAPI.VENUE_COUNT; i++) {
      this.markerRefs.push (React.createRef ());
    }
  }

  state = {
    locations: [],
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    googleMapLoaded: true,
    selectedCategory: 'all',
  };

  // Fetch trending venues list through Foursquare API
  componentDidMount () {
    FSAPI.getVenueList ()
      .then (locations => this.setState ({locations}))
      .catch (e => console.log (e));
  }

  // Google map is not loaded successfully
  onMapError = () => this.setState ({googleMapLoaded: false});

  openInfoWindow = (props, marker) => {
    this.setState ({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  closeInfoWindow = () => {
    this.setState ({
      showingInfoWindow: false,
      activeMarker: null,
      selectedPlace: {},
    });
  };

  //retrieve the appropriate marker and props based on index of location clicked in sidebar
  //indexes in filtered list of location correspond to indexs in markerRefs array
  onListClick = index => {
    this.state.googleMapLoaded &&
      this.openInfoWindow (
        this.markerRefs[index].current.props,
        this.markerRefs[index].current.marker
      );
  };

  // When a venue category is selected from drop-down, close any open infowindow and update state
  onSelectCategory = category => {
    this.state.showingInfoWindow && this.closeInfoWindow ();
    this.setState ({selectedCategory: category});
  };

  render () {
    let category = this.state.selectedCategory;
    let visibleLocations = category !== 'all'
      ? this.state.locations.filter (location => location.category === category)
      : this.state.locations;

    return (
      <div className="app">
        <header>
          <h1 className="app-title"><span>Trending</span> in Tampa Bay</h1>
        </header>

        <main>
          <Sidebar
            categories={FSAPI.getCategories (this.state.locations)}
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
            mapError={this.onMapError}
          />

        </main>
      </div>
    );
  }
}

export default App;
