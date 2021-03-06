import { Ticket } from '../client/src/api';

const data = require('./data.json');

export const tempData = data as Ticket[];

export const owners = ['Paul', 'John', 'George', 'Ringo'];
