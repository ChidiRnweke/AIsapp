import { getCookie } from './utils.js';

const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie('csrftoken'),
};

interface registerCredentials {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

interface loginCredentials {
    username: string;
    password: string;
}

export async function createUser(userData: registerCredentials): Promise<Response> {
    const response = await fetch("/api/users/?format=json", {
        method: "POST",
        mode: "cors",
        headers: headers,
        credentials: 'same-origin',
        body: JSON.stringify(userData)
    });
    return response;
}

export async function loginUser(credentials: loginCredentials): Promise<Response> {
    const response = await fetch("/api/token/?format=json", {
        method: "POST",
        mode: "cors",
        headers: headers,
        credentials: 'same-origin',
        body: JSON.stringify(credentials)
    });
    return response;
}
