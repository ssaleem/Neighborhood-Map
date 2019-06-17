import React, {Component} from 'react';
import PropTypes from 'prop-types';
import List from './List';
import Footer from './Footer';

class Sidebar extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    visibleLocations: PropTypes.array.isRequired,
    selectCategory: PropTypes.func.isRequired,
    listClick: PropTypes.func.isRequired,
    selectedPlace: PropTypes.object,
  };

  render () {
    const {
      categories,
      visibleLocations,
      selectCategory,
      listClick,
      selectedPlace,
    } = this.props;
    return (
      <div className="sidebar">
        <select
          name="categories"
          className="attractions-select"
          onChange={event => selectCategory (event.target.value)}
          aria-label="Select Venue Category"
        >
          <option value="all">Select Category</option>
          {categories.map ((category, index) => (
            <option value={category} key={index}>
              {category}
            </option>
          ))}
        </select>
        <List
          selectedPlace={selectedPlace}
          attractions={visibleLocations}
          listClick={listClick}
        />
        <Footer />
      </div>
    );
  }
}

export default Sidebar;
