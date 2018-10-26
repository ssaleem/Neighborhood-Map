import React, { Component } from 'react';

class List extends Component {

	handleClick(index){
		this.props.listClick(index)
	}

	render() {
		const attractions = this.props.attractions
		return (
			<ol className="attractions-list">
				{attractions.map((attraction, index) => (
					<li key={index} tabIndex="0" onClick={(event => this.handleClick(index))}>
						<div><img src={attraction.icon} alt={attraction.category.logo} className="cat-logo"/><span>{attraction.title}</span></div>
					</li>
				))}
			</ol>
			)
	}
}

export default List