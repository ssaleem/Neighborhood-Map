import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFoursquare } from '@fortawesome/free-brands-svg-icons'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import List from './List'

library.add(faFoursquare, faCopyright)

class Sidebar extends Component {
	static propTypes = {
		categories: PropTypes.array.isRequired,
        visibleLocations: PropTypes.array.isRequired,
        selectCategory: PropTypes.func.isRequired,
        listClick: PropTypes.func.isRequired,
    }

	render(){
		const {categories, visibleLocations, selectCategory, listClick, selectedPlace} = this.props
		return(
			<div className="sidebar">
	          <select name="categories" className="attractions-select" onChange={event => selectCategory(event.target.value)} aria-label="Select Venue Category">
	            <option value="all">Select Category</option>
	            {categories.map((category, index) => (
	              <option value={category} key={index}>
	                {category}
	              </option>
	            ))}
	          </select>
	          <List
	          	selectedPlace={selectedPlace}
	            attractions={visibleLocations}
	            listClick={(index) => listClick(index)}
	          />
	          <footer>
		          <p >POWERED BY <a href="https://developer.foursquare.com/"><FontAwesomeIcon icon={["fab", "foursquare"]} className="fs-logo"/></a></p>
		          <p><FontAwesomeIcon icon="copyright"/> 2018 SARA SALEEM. ALL RIGHTS RESERVED</p>
	          </footer>
	        </div>
		)
	}
}

export default Sidebar