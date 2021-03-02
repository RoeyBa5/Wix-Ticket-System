import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { sizes } from './config';

export type AppState = {
	tickets?: Ticket[];
	search: string;
	hidden: number;
	fontSize: string;
};

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
	state: AppState = {
		search: '',
		hidden: 0,
		fontSize: 'nr',
	};

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(),
		});
	}

	handleHide = (id: string) => {
		if (this.state.tickets !== undefined) {
			let plus = 0;
			const newTickets = this.state.tickets.map((ticket) => {
				if (ticket.id === id) {
					ticket.hide ? (plus = -1) : (plus = 1);
					ticket.hide = !ticket.hide;
				}
				return ticket;
			});
			this.setState({
				tickets: newTickets,
				hidden: this.state.hidden + plus,
			});
		}
	};

	handleRestore = () => {
		if (this.state.tickets !== undefined) {
			const newTickets = this.state.tickets.map((ticket) => {
				ticket.hide = false;
				return ticket;
			});
			this.setState({
				tickets: newTickets,
				hidden: 0,
			});
		}
	};

	renderHidden = (hidden: number) => {
		return (
			<div className='hidden'>
				({hidden} hidden tickets{' '}
				<div className='restore' onClick={this.handleRestore}>
					- restore
				</div>
				)
			</div>
		);
	};

	renderFontButton = (size: string) => {
		if (size === this.state.fontSize) {
			return <div className='change-size active'>{sizes.get(size)}</div>;
		} else {
			return (
				<div
					className='change-size passive'
					onClick={() => {
						this.handleSizeChange(size);
					}}
				>
					{sizes.get(size)}
				</div>
			);
		}
	};

	renderFontSize = () => {
		return (
			<div className='change-size'>
				Choose Font Size:{` `}
				{this.renderFontButton('sm')}
				{' | '}
				{this.renderFontButton('nr')}
				{' | '}
				{this.renderFontButton('lg')}
			</div>
		);
	};

	handleSizeChange = (size: string) => {
		this.setState({
			fontSize: size,
		});
	};

	renderTickets = (tickets: Ticket[]) => {
		const filteredTickets = tickets.filter(
			(t) =>
				(t.title.toLowerCase() + t.content.toLowerCase()).includes(
					this.state.search.toLowerCase()
				) && !t.hide
		);

		return (
			<ul className='tickets'>
				{filteredTickets.map((ticket) => (
					<li key={ticket.id} className={`ticket + ${this.state.fontSize}`}>
						<div
							className='hide'
							onClick={() => {
								const { tickets } = this.state;
								this.handleHide(ticket.id);
							}}
						>
							Hide
						</div>
						<h5 className='title'>{ticket.title}</h5>
						<div className='meta-data'>{ticket.content}</div>
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
	};

	onSearch = async (val: string, newPage?: number) => {
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val,
			});
		}, 300);
	};

	render() {
		const { tickets, hidden } = this.state;

		return (
			<main>
				<h1>Tickets List</h1>
				<div>{this.renderFontSize()}</div>
				<header>
					<input
						type='search'
						placeholder='Search...'
						onChange={(e) => this.onSearch(e.target.value)}
					/>
				</header>
				{tickets ? (
					<div className='results'>
						Showing {tickets.length} results{' '}
						{hidden > 0 ? this.renderHidden(hidden) : ''}
					</div>
				) : null}
				{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			</main>
		);
	}
}

export default App;
