import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFoursquare} from '@fortawesome/free-brands-svg-icons';
import {faCopyright} from '@fortawesome/free-solid-svg-icons';

class Footer extends Component {
  render () {
    return (
      <footer>
        <p>
          POWERED BY
          {' '}
          <a href="https://developer.foursquare.com/">
            <FontAwesomeIcon icon={faFoursquare} className="fs-logo" />
          </a>
        </p>
        <p>
          <FontAwesomeIcon icon={faCopyright} />
          {' '}
          2018 SARA SALEEM. ALL RIGHTS RESERVED
        </p>
      </footer>
    );
  }
}

export default Footer;
