import React, { Component } from 'react';
import { sizes } from '../config';

interface props {
	fontSize: string;
	handleSizeChange: Function;
}

export default class FontSize extends Component<props> {
	render() {
		const renderFontButton = (size: string) => {
			if (size === this.props.fontSize) {
				return <div className='change-size active'>{sizes.get(size)}</div>;
			} else {
				return (
					<div
						className='change-size passive'
						onClick={() => {
							this.props.handleSizeChange(size);
						}}
					>
						{sizes.get(size)}
					</div>
				);
			}
		};

		return (
			<div className='change-size'>
				Choose Font Size:{` `}
				{renderFontButton('sm')}
				{' | '}
				{renderFontButton('nr')}
				{' | '}
				{renderFontButton('lg')}
			</div>
		);
	}
}
