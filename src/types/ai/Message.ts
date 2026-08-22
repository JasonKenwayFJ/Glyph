export const createMessage = (): MessageEntity => ({
    userName: "",
    userId: "",
    sender: "User",
    isFromUser: false,
    content: "",
    image: null,
    time: "",
    status: "",
    messageText: "",
    languageCode: "",
    targetLanguage: "",
    token: "",
    tone: "Formal",
    history: [],

    botName: "Sofia",
    maxLength: 500,
    filteredWords: [],
    instructions: "",
    styles: []
});

export type MessageEntity = {
    id?: string;

    token: string;

    userName: string;
    botName: string;

    userId: string;
    sender: string;
    isFromUser: boolean;

    content: string;
    image: File | null;
    time: string;

    status: string;
    messageText: string;
    languageCode: string;
    targetLanguage: string;
    tone: string;
    history: AiContent[];

    maxLength: number;
    filteredWords: string[];
    instructions: string;
    styles: string[];
}
export type message = {
    id: string
    userName: string
    isFromUser: boolean
    messageText: string
    time: string
    status: string
}
export interface AiContent {
    Sender: string,
    Message: string,
    date: string,
}