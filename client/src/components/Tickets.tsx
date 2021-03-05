import React, { Component } from 'react';
import { Ticket } from '../api';
import ShowMoreText from 'react-show-more-text';
import Select from 'react-dropdown-select';

interface props {
	handleHide: Function;
	handleClone: Function;
	handleStatus: Function;
	tickets: Ticket[];
	fontSize: string;
}

const executeOnClick = (isExpanded) => {
	console.log(isExpanded);
};

export default class Tickets extends Component<props> {
	render() {
		const filteredTickets = this.props.tickets.filter((t) => !t.hide);
		return (
			<ul className='tickets'>
				{filteredTickets.map((ticket) => (
					<li key={ticket.id} className={`ticket + ${this.props.fontSize}`}>
						<div className='box'>
							<div
								className='hide'
								onClick={() => {
									this.props.handleHide(ticket.id);
								}}
							>
								Hide
							</div>
							<div
								className='hide'
								onClick={() => {
									this.props.handleClone(ticket.id);
								}}
							>
								Clone
							</div>
							<div className='select'>
								<Select
									style={{ padding: '0' }}
									placeholder={
										ticket.status === 'opened' || ticket.status === undefined
											? 'Opened'
											: 'Solved'
									}
									options={[
										{ value: 'opened', label: 'Opened' },
										{ value: 'solved', label: 'Solved' },
									]}
									onChange={(value) => {
										this.props.handleStatus(ticket.id, value[0].value);
									}}
								/>
							</div>
						</div>

						<h5 className='title'>{ticket.title}</h5>
						<div className='meta-data'>
							<ShowMoreText
								lines={3}
								more='See more'
								less='See less'
								anchorClass='show'
								className='meta-data'
								onClick={executeOnClick}
								expanded={false}
							>
								{ticket.content}
							</ShowMoreText>
						</div>
						<footer>
							<div className='meta-data'>
								By {ticket.userEmail} |{' '}
								{new Date(ticket.creationTime).toLocaleString()}
							</div>
						</footer>
					</li>
				))}
			</ul>
		);
	}
}
