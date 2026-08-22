type AuthListener = (verified: boolean) => void;

const listeners: AuthListener[] = [];

export function subscribeAuth(listener: AuthListener){
    listeners.push(listener)
    return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1){
            listeners.splice(index, 1)
        }
    };
}
export function notifyAuthChanged(verified: boolean){
    listeners.forEach(listener => listener(verified))
}

export async function isVerified(): Promise<boolean> {
    const token = await getToken();
    return !!token;
}

export async function getToken(): Promise<string | null> {
    return window.authStorage.getToken();
}

export async function setToken(token: string) {
    console.log(`new token: ${token}`)
    await window.authStorage.setToken(token);
}

export async function clearToken(){
    console.log(`token has been deleted:${await window.authStorage.getToken()}` )
    notifyAuthChanged(false);
    await window.authStorage.clearToken()
}