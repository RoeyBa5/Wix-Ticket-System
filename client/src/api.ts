import axios from 'axios';
import { APIRootPath } from '@fed-exam/config';

export type Ticket = {
	id: string;
	title: string;
	content: string;
	creationTime: number;
	userEmail: string;
	labels?: string[];
	hide: boolean;
	status: string;
	owner: string;
};

export type ApiClient = {
	getTickets: (page: number, search: string) => Promise<Ticket[]>;
	getOwners: () => Promise<string[]>;
	cloneTicket: (id: string) => Promise<string>;
	updateStatus: (id: string, status: string) => Promise<string>;
	updateOwner: (id: string, owner: string) => Promise<string>;
	hideTicket: (id: string) => Promise<string>;
	showTickets: () => Promise<string>;
};

export const createApiClient = (): ApiClient => {
	return {
		getTickets: (page: number, search: string) => {
			return axios
				.get(APIRootPath, { params: { page: page, search: search } })
				.then((res) => res.data);
		},
		getOwners: () => {
			return axios.get(APIRootPath + '/owners').then((res) => res.data);
		},
		cloneTicket: (id: string) => {
			const headers = {
				'Content-Type': 'application/json',
				id: id,
			};
			return axios
				.post(APIRootPath + '/clone', headers, { headers: headers })
				.then((res) => res.data);
		},
		updateStatus: (id: string, status: string) => {
			const headers = {
				'Content-Type': 'application/json',
				id: id,
				status: status,
			};
			return axios
				.post(APIRootPath + '/status', headers, { headers: headers })
				.then((res) => res.data);
		},
		updateOwner: (id: string, owner: string) => {
			const headers = {
				'Content-Type': 'application/json',
				id: id,
				owner: owner,
			};
			return axios
				.post(APIRootPath + '/owners', headers, { headers: headers })
				.then((res) => res.data);
		},
		hideTicket: (id: string) => {
			const headers = {
				'Content-Type': 'application/json',
				id: id,
			};
			return axios
				.post(APIRootPath + '/hide', headers, { headers: headers })
				.then((res) => res.data);
		},
		showTickets: () => {
			return axios.put(APIRootPath + '/hide').then((res) => res.data);
		},
	};
};
