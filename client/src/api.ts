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
};

export type ApiClient = {
	getTickets: (page: number, search: string) => Promise<Ticket[]>;
	cloneTicket: (id: string) => Promise<string>;
	updateStatus: (id: string, status: string) => Promise<string>;
};

export const createApiClient = (): ApiClient => {
	return {
		getTickets: (page: number, search: string) => {
			return axios
				.get(APIRootPath, { params: { page: page, search: search } })
				.then((res) => res.data);
		},
		cloneTicket: (id: string) => {
			const headers = {
				'Content-Type': 'application/json',
				id: id,
			};
			return axios
				.post(APIRootPath, headers, { headers: headers })
				.then((res) => res.data);
		},
		updateStatus: (id: string, status: string) => {
			const headers = {
				'Content-Type': 'application/json',
				id: id,
				status: status,
			};
			return axios
				.put(APIRootPath, headers, { headers: headers })
				.then((res) => res.data);
		},
	};
};
