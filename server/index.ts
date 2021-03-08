import express from 'express';
import bodyParser = require('body-parser');
import { tempData, owners } from './temp-data';
import { serverAPIPort, APIPath, APIRootPath } from '@fed-exam/config';
import { v4 as uuidv4 } from 'uuid';
import connect from './config/connect';
import Post from './models/Post';
const config = require('config');
const db: string = config.get('mongoURI');

console.log('starting server', { serverAPIPort, APIPath });

const app = express();
connect(db);

export const PAGE_SIZE = 20;

let localData = [...tempData];

app.use(bodyParser.json());

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

app.get('/', (req, res) => res.send('API running'));

app.get(APIPath, async (req, res) => {
	// @ts-ignore
	const page: number = req.query.page || 1;
	let search: string = (req.query.search || '').toString();
	let superSearch = req.query.superSearch;
	let superSearchBool;
	superSearch === 'true' ? (superSearchBool = true) : (superSearchBool = false);
	let paginatedData;
	let after: any = undefined;
	let before: any = undefined;
	let from: any = undefined;

	if (superSearchBool && search.length > 0) {
		let superArr = await Post.find({
			$or: [
				{ title: { $regex: `.*${search}.*`, $options: 'i' } },
				{ content: { $regex: `.*${search}.*`, $options: 'i' } },
			],
		});
		return res.send(superArr.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
	} else {
		if (search.includes('after:')) {
			after = search.match(/(?<=after:)([0-9]|[/])*/);
			if (after !== null) {
				search = search.replace(`after:${after[0]}`, '');
			}
		}

		if (search.includes('before:')) {
			before = search.match(/(?<=before:)([0-9]|[/])*/);
			if (before !== null) {
				search = search.replace(`before:${before[0]}`, '');
			}
		}

		if (search.includes('from:')) {
			from = search.match(/(?<=from:)([a-z]|[A-Z]|[0-9]|[@.])*/);
			if (from !== null) {
				search = search.replace(`from:${from[0]}`, '');
			}
		}

		paginatedData = localData.filter(
			(t) =>
				(t.title.toLowerCase() + t.content.toLowerCase()).includes(
					search.toString().toLowerCase()
				) &&
				(after === undefined ||
					t.creationTime >=
						new Date(
							after[0].split('/')[2],
							after[0].split('/')[1] - 1,
							after[0].split('/')[0]
						).getTime()) &&
				(before === undefined ||
					t.creationTime <=
						new Date(
							before[0].split('/')[2],
							before[0].split('/')[1] - 1,
							before[0].split('/')[0]
						).getTime()) &&
				(from === undefined ||
					t.userEmail.toLowerCase() == from[0].toLowerCase()) &&
				(t.status === undefined || t.status === 'opened') &&
				!t.hide
		);
	}
	paginatedData = paginatedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	res.send(paginatedData);
});

app.get(APIPath + '/owners', (req, res) => {
	// @ts-ignore
	res.send(owners);
});

app.post(APIPath + '/owners', (req, res) => {
	// @ts-ignore
	const id: string = req.headers.id || '';
	const owner: string = req.headers.owner?.toString() || '';
	localData.forEach((ticket) => {
		if (ticket.id === id) {
			ticket.owner = owner;
		}
	});
	res.send('Owner Set');
});

app.post(APIPath + '/clone', (req, res) => {
	// @ts-ignore
	const id: string = req.headers.id || '';
	let tempTicket;
	localData.forEach((ticket, index) => {
		if (ticket.id === id) {
			tempTicket = { ...ticket };
			tempTicket.id = uuidv4();
			localData.splice(index + 1, 0, tempTicket);
		}
	});

	res.send('Item Cloned');
});

app.post(APIPath + '/status', (req, res) => {
	// @ts-ignore
	const id: string = req.headers.id || '';
	const status: string = req.headers.status?.toString() || '';
	localData.forEach((ticket) => {
		if (ticket.id == id) {
			ticket.status = status;
		}
	});
	res.send('Item Status Updated');
});

app.post(APIPath + '/hide', (req, res) => {
	// @ts-ignore
	const id: string = req.headers.id || '';
	localData.forEach((ticket) => {
		if (ticket.id == id) {
			ticket.hide = true;
		}
	});
	res.send('Item is Hidden');
});

app.put(APIPath + '/hide', (req, res) => {
	// @ts-ignore
	localData.forEach((ticket) => {
		ticket.hide = false;
	});
	res.send('Items are Shown');
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort);
