import React, { Component } from 'react'
import AppHead from '../AppHead/AppHead';

export default class Project extends Component {
	render() {
		return (
			<div>
				<AppHead activeTab="project" />
				<h1>Project</h1>
			</div>
		);
	}
}