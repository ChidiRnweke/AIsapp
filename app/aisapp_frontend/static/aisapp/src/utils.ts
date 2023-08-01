export const getCookie = (name: string): string => {
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