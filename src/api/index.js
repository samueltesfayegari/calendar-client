import axios from 'axios';
import { URL } from '../components/config';

const url = URL;

export const fetchEvents = () => axios.get(`${url}/events`);
export const createEvent = (newEvent) => axios.post(`${url}/events`, newEvent);
export const updateEvent = (id, updatedEvent) => axios.patch(`${url}/events/${id}`, updatedEvent);
export const deleteEvent = (id) => axios.delete(`${url}/events/${id}`);