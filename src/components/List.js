import React, { Component } from 'react';

class List extends Component {

	handleClick(index){
		this.props.listClick(index)
	}

	render() {
		const attractions = this.props.attractions
		return (
			<section className="list-view">

				<ol className="attractions-list">
					{attractions.map((attraction, index) => (
						<li key={index} onClick={(event => this.handleClick(index))}>
							{attraction.title}
						</li>
					))}
				</ol>
			</section>
			)
	}
}

export default List