export function setItemLS(key: string, value: string): boolean {
    if (window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
    }
    return false;
}

export function getItemLS(key: string): string {
    if (window.localStorage) {
        const value = window.localStorage.getItem(key);
        return value;
    }
    return '';
}

export function removeItemLS(key: string): boolean {
    if (window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
    }
    return false;
}

export function setItemSS(key: string, value: string): boolean {
    if (window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
        return true;
    }
    return false;
}

export function getItemSS(key: string): string {
    if (window.sessionStorage) {
        const value = window.sessionStorage.getItem(key);
        return value;
    }
    return '';
}

export function removeItemSS(key: string): boolean {
    if (window.sessionStorage) {
        window.sessionStorage.removeItem(key);
        return true;
    }
    return false;
}
