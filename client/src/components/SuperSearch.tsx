import React, { Component } from 'react';
import Select from 'react-dropdown-select';

interface props {
	handleSearch: Function;
}

export default class SuperSearch extends Component<props> {
	render() {
		return (
			<div className='super-search'>
				<Select
					style={{ 'text-align': 'center' }}
					placeholder={'Select Search'}
					options={[
						{ value: false, label: 'Normal Search' },
						{ value: true, label: 'Super Search' },
					]}
					onChange={(value) => {
						this.props.handleSearch(value[0].value);
					}}
				/>
			</div>
		);
	}
}
