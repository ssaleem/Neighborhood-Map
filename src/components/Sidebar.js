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
        classname: PropTypes.string.isRequired
    }

	render(){
		const {categories, visibleLocations, selectCategory, listClick, classname, selectedPlace} = this.props
		return(
			<div className={classname}>
	          <select name="categories" className="attractions-select" onChange={event => selectCategory(event.target.value)}>
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
	          <div className="fs-footer">
		          <p >POWERED BY <a href="https://developer.foursquare.com/"><FontAwesomeIcon icon={["fab", "foursquare"]} className="fs-logo"/></a></p>
		          <p><FontAwesomeIcon icon="copyright"/> 2018 SARA SALEEM. ALL RIGHTS RESERVED
		            {/* <a href="https://github.com/ssaleem">  <FontAwesomeIcon icon={["fab", "github"]}/>ssaleem</a>*/}
		          </p>
	          </div>
	        </div>
		)
	}
}

export default Sidebar