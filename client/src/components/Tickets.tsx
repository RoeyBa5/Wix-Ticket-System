import React, { Component } from 'react';
import { Ticket } from '../api';
import { AppState } from '../App';
import ShowMoreText from 'react-show-more-text';

interface props {
	handleHide: Function;
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
						<div
							className='hide'
							onClick={() => {
								this.props.handleHide(ticket.id);
							}}
						>
							Hide
						</div>
						<h5 className='title'>{ticket.title}</h5>
						<div className='meta-data'>
							{
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
							}
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
