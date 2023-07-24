import { getCookie } from './utils.js';

const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie('csrftoken'),
};

export async function createUser(userData) {
    const response = await fetch("/api/users/?format=json", {
        method: "POST",
        mode: "cors",
        headers: headers,
        credentials: 'same-origin',
        body: JSON.stringify(userData)
    });
    return response;
}

export async function loginUser(credentials) {
    const response = await fetch("/api/token/?format=json", {
        method: "POST",
        mode: "cors",
        headers: headers,
        credentials: 'same-origin',
        body: JSON.stringify(credentials)
    });
    return response;
}
