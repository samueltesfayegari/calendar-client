import * as api from '../api/index.js';
import { FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/actionTypes.js';

export const getEvents = () => async (dispatch) => {
  try {
    const { data } = await api.fetchEvents();
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

export const createEvent = (newEvent) => async (dispatch) => {
  try {
    const { data } = await api.createEvent(newEvent);
    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.error('Error creating event:', error);
  }
};

export const updateEvents = (id, updatedEvent) => async (dispatch) => {
  try {
    const { data } = await api.updateEvent(id, updatedEvent);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.error('Error updating event:', error);
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    await api.deleteEvent(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};
