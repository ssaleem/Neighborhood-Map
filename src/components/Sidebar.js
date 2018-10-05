import React, { Component } from 'react';
import List from './List'

class Sidebar extends Component {
	render(){
		const {categories, visibleLocations, selectCategory, listClick, classname} = this.props
		return(
			<div className={classname}>
	          <select name="attractions" className="attractions-select" onChange={event => selectCategory(event.target.value)}>
	            <option value="all">Select Category</option>
	            {categories.map((category, index) => (
	              <option value={category} key={index}>
	                {category}
	              </option>
	            ))}
	          </select>
	          <List
	            attractions={visibleLocations}
	            listClick={(index) => listClick(index)}
	          />
	        </div>
		)
	}
}

export default Sidebar