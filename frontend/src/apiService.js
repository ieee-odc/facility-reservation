import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; 

export const getAllInitiators = () => axios.get(`${API_BASE_URL}/api/reservationInitiators`);
export const getInitiatorById = (id) => axios.get(`${API_BASE_URL}/api/reservationInitiators/${id}`);
export const createInitiator = (data) => axios.post(`${API_BASE_URL}/api/reservationInitiators`, data);
export const updateInitiator = (id, data) => axios.patch(`${API_BASE_URL}/api/reservationInitiators/${id}`, data);
export const deleteInitiator = (id) => axios.delete(`${API_BASE_URL}/api/reservationInitiators/${id}`);

export const getAllFacilities = () => axios.get(`${API_BASE_URL}/api/facilities`);
export const getFacilityId = (id) => axios.get(`${API_BASE_URL}/api/facilities/${id}`);
export const createFacility = (data) => axios.post(`${API_BASE_URL}/api/facilities`, data);
export const updateFacility = (id, updateFields) => axios.patch(`${API_BASE_URL}/api/facilities/${id}`, updateFields);
export const deleteFacility = (id) => axios.delete(`${API_BASE_URL}/api/facilities/${id}`);
