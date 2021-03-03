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
};

export type ApiClient = {
	getTickets: (page: number, search: string) => Promise<Ticket[]>;
};

export const createApiClient = (): ApiClient => {
	return {
		getTickets: (page: number, search: string) => {
			return axios
				.get(APIRootPath, { params: { page: page, search: search } })
				.then((res) => res.data);
		},
	};
};
