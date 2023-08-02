const getCookie = (name: string): string => {
    let cookieValue: string | undefined = undefined;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    if (cookieValue === undefined) {
        throw new Error(`Cookie with the name "${name}" not found.`);
    }
    return cookieValue;
}

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
