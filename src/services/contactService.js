import axios from 'axios';

const SERVER_URL = "https://6a60a37db1933e9d25fd88d1.mockapi.io";

// @desc Get All Contacts
// @route GET http://localhost:9000/contacts
export const getAllContacts = () => {
    const url = `${SERVER_URL}/contacts`;
    return axios.get(url);
}

// @desc Get Contact With Contact ID
// @route GET http://localhost:9000/contacts/:contactId
export const getContact = (contactId) => {
    const url = `${SERVER_URL}/contacts/${contactId}`;
    return axios.get(url);
}

export const getAllGroups = () => {
    const url = `${SERVER_URL}/groups`;
    return axios.get(url);
}

export const getGroup = (groupId) => {
    const url = `${SERVER_URL}/groups/${groupId}`;
    return axios.get(url);
}

// @desc Create New Contact
// @route POST http://localhost:9000/contacts
export const createContact = (contact) => {
    const url = `${SERVER_URL}/contacts`;
    return axios.post(url, contact)
}

export const updateContact = (contact, contactId) => {
    const url = `${SERVER_URL}/contacts/${contactId}`;
    return axios.put(url, contact);
}

export const deleteContact = (contactId) => {
    const url = `${SERVER_URL}/contacts/${contactId}`;
    return axios.delete(url);
}