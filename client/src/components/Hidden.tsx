import React, { Component } from 'react';

interface props {
	hidden: number;
	handleRestore: Function;
}

export default class Hidden extends Component<props> {
	render() {
		return (
			<div className='hidden'>
				({this.props.hidden} hidden tickets{' '}
				<div
					className='restore'
					onClick={() => {
						this.props.handleRestore();
					}}
				>
					- restore
				</div>
				)
			</div>
		);
	}
}
