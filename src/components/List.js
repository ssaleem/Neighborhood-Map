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
						{attraction.title}
					</li>
				))}
			</ol>
			)
	}
}

export default List