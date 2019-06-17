import React, {Component} from 'react';

class MapFallback extends Component {
  render () {
    return (
      <p className="gmap-fail">
        Ideally, you should see a map here!
        {' '}
        <br />
        No map??? :( Sorry something went wrong with Google Maps API.
      </p>
    );
  }
}

export default MapFallback;
