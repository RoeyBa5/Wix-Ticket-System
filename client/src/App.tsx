import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
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
	cloned: number;
	owners: string[];
};

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
	state: AppState = {
		search: '',
		hidden: 0,
		fontSize: 'nr',
		page: 1,
		cloned: 0,
		owners: [],
	};

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(this.state.page, this.state.search),
			owners: await api.getOwners(),
		});
	}

	async componentDidUpdate(prevProps: any, prevState: any) {
		if (
			prevState.search !== this.state.search ||
			prevState.page !== this.state.page ||
			prevState.cloned !== this.state.cloned ||
			prevState.hidden !== this.state.hidden
		) {
			this.setState({
				tickets: await api.getTickets(this.state.page, this.state.search),
			});
		}
	}

	handleHide = async (id: string) => {
		await api.hideTicket(id);
		this.setState({
			hidden: this.state.hidden + 1,
		});
	};

	handleRestore = async () => {
		await api.showTickets();
		this.setState({
			hidden: 0,
		});
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

	handleClone = async (id: string) => {
		console.log(this.state.tickets);
		console.log(await api.cloneTicket(id));
		this.setState({
			cloned: this.state.cloned + 1,
		});
	};

	handleStatus = async (id: string, status: string) => {
		await api.updateStatus(id, status);
		this.setState({
			cloned: this.state.cloned + 1,
		});
	};

	handleOwner = async (id: string, owner: string) => {
		await api.updateOwner(id, owner);
		this.setState({
			cloned: this.state.cloned + 1,
		});
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
		const { tickets, hidden, page, fontSize, owners } = this.state;

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
						handleClone={this.handleClone}
						handleStatus={this.handleStatus}
						handleOwner={this.handleOwner}
						tickets={tickets}
						fontSize={fontSize}
						owners={owners}
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
