import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLightbulb} from '@fortawesome/free-regular-svg-icons';

class InfoWindowDetail extends Component {
  render () {
    const {title, photo, tip} = this.props;
    return (
      <div className="infowindow">
        <h3>{title}</h3>
        <div className="attraction-info">
          <img src={photo} alt={`${title}`} className="attraction-img" />
          <p className="attraction-tip">
            <FontAwesomeIcon icon={faLightbulb} className="bulb-logo" />
            {' '}{' '}{tip}
          </p>
        </div>
      </div>
    );
  }
}

export default InfoWindowDetail;
