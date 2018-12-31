import React, { Component } from 'react';

class List extends Component {

	handleClick(index){
		this.props.listClick(index)
	}

	render() {
		const attractions = this.props.attractions
		const selectedPlace = this.props.selectedPlace
		return (
			<ol className="attractions-list">
				{attractions.map((attraction, index) => (
					<li key={index} tabIndex="0" onClick={(event => this.handleClick(index))}>
						<div><img src={attraction.icon} alt={`${attraction.category} icon`} className="cat-logo"/><span>{attraction.title}</span></div>
						<div className={`${selectedPlace.title === attraction.title ? "address-show" : "address-hide"}`}>{attraction.address}</div>
					</li>
				))}
			</ol>
			)
	}
}

export default List