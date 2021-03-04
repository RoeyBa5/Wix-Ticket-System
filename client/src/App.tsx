import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { sizes } from './config';
import Tickets from './components/Tickets';
import Hidden from './components/Hidden';
import PageCtrl from './components/PageCtrl';
import FontSize from './components/FontSize';

export type AppState = {
	tickets?: Ticket[];
	search: string;
	hidden: number;
	fontSize: string;
	page: number;
};

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
	state: AppState = {
		search: '',
		hidden: 0,
		fontSize: 'nr',
		page: 1,
	};

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(this.state.page, this.state.search),
		});
	}

	async componentDidUpdate(prevProps: any, prevState: any) {
		if (
			prevState.search !== this.state.search ||
			prevState.page !== this.state.page
		) {
			this.setState({
				tickets: await api.getTickets(this.state.page, this.state.search),
				hidden: 0,
			});
		}
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

	handleSizeChange = (size: string) => {
		this.setState({
			fontSize: size,
		});
	};

	handlePageChange = (dir: String) => {
		if (dir === 'left') {
			this.setState({
				page: this.state.page - 1,
			});
		}
		if (dir === 'right') {
			this.setState({
				page: this.state.page + 1,
			});
		}
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
		const { tickets, hidden, page, fontSize } = this.state;

		return (
			<main>
				<h1>Tickets List</h1>
				<FontSize
					fontSize={fontSize}
					handleSizeChange={this.handleSizeChange}
				/>
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
						{hidden > 0 ? (
							<Hidden hidden={hidden} handleRestore={this.handleRestore} />
						) : (
							''
						)}
					</div>
				) : null}
				{tickets ? (
					<Tickets
						handleHide={this.handleHide}
						tickets={tickets}
						fontSize={fontSize}
					/>
				) : (
					<h2>Loading..</h2>
				)}
				<PageCtrl
					page={page}
					handlePageChange={this.handlePageChange}
					tickets={tickets || []}
				/>
			</main>
		);
	}
}

export default App;
