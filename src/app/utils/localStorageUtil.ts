export function setItem(key: string, value: string): boolean {
    if (window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
    }
    return false;
}

export function getItem(key: string): string {
    if (window.localStorage) {
        const value = window.localStorage.getItem(key);
        return value;
    }
    return '';
}

export function removeItem(key: string): boolean {
    if (window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
    }
    return false;
}
