import React, { Component } from 'react';
import { Ticket } from '../api';

interface props {
	page: number;
	handlePageChange: Function;
	tickets: Ticket[];
}

export default class PageCtrl extends Component<props> {
	render() {
		const renderLeftPage = () => {
			if (this.props.page === 1) {
				return (
					<button type='button' className='page-button' disabled>
						{`<`}
					</button>
				);
			} else {
				return (
					<button
						type='button'
						className='page-button'
						onClick={() => {
							this.props.handlePageChange('left');
						}}
					>
						{`<`}
					</button>
				);
			}
		};

		const renderRightPage = () => {
			if (this.props.tickets !== undefined && this.props.tickets.length === 0) {
				return (
					<button type='button' className='page-button' disabled>
						{`>`}
					</button>
				);
			} else {
				return (
					<button
						type='button'
						className='page-button'
						onClick={() => {
							this.props.handlePageChange('right');
						}}
					>
						{`>`}
					</button>
				);
			}
		};

		return (
			<div className='page'>
				{renderLeftPage()}
				{renderRightPage()}
			</div>
		);
	}
}
