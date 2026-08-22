import type {authForm, registrationForm} from "../../types/Entities.ts";
import {getToken, notifyAuthChanged, setToken} from "./Network/AuthorizationService.ts";
import type {MessageEntity} from "../../types/ai/Message.ts";

const baseUrl = "http://localhost:5167/api";


export async function request<TResponse, TBody = unknown>(
    path: string,
    method: string,
    body?: TBody
): Promise<TResponse> {
    const token = await getToken();

    const response = await fetch(`${baseUrl}/${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const newToken = response.headers.get("AuthToken");
    if (newToken) await setToken(newToken);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
}

export async function registration(data: registrationForm) {
    notifyAuthChanged(true);
    return request<{ message: string }>("User/registration_user", "POST", data);
}

export async function authorize(data: authForm) {
    notifyAuthChanged(true);
    return request<{ token: string }>("user/authorize_user", "POST", data);
}



export async function uploadCardImage(cardId: string, file: File): Promise<{ imagePath: string }> {
    const token = await getToken();
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${baseUrl}/Card/upload_image/${cardId}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });

    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return response.json();
}

export async function SendMessage(message: MessageEntity) {
    return request<MessageEntity>("ai/send_message","POST", message)
}