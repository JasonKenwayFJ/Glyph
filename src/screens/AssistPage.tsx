import {useState, useRef, useEffect} from "react";
import "../pages/MainStyles/AIChat.css";
import Message from "../components/AIChat/Message/Message.tsx";
import {message} from "../types/ai/Message.ts";



const AIChat = () => {
    const [messages, setMessages] = useState<message[]>([]);
    const [textInput, setTextInput] = useState("");
    const [isSending, setSending] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    function clearChat() {
        setMessages([]);
    }

    useEffect(() => {

        listRef.current?.scrollTo({top: listRef.current.scrollHeight, behavior: "smooth"});
    }, [messages]);

    async function SendMessage(userMsg: message) {
        
    }

    async function sendRequest() {
        if (!textInput.trim() || isSending) return;

        const userMsg : message = {
            id: crypto.randomUUID(),
            userName: "Заглушка",
            isFromUser: true,
            messageText: textInput,
            time: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
            status: "sent"
        }

        setMessages((prev) => [...prev, userMsg]);
        setTextInput("");
        setSending(true);

        try {
            const response = await SendMessage(userMsg)
            setMessages((prev) => [...prev, response]);
        } finally {
            setSending(false);
        }
    }

    async function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await sendRequest();
        }
    }

    return (
        <div className="AIWindow">
            <div className="AIWindowInner">
                <div className="AIChatHeader">
                    <div className="AIChatHeaderContent">
                        <div className="AIAvatar">🤖</div>
                        <span className="AIChatTitle">AI Sofia</span>
                    </div>
                    <button className="AIClearButton" title="Очистить чат" onClick={clearChat}>
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className="AIChatMessages" ref={listRef}>
                    <Message
                        id={crypto.randomUUID()}
                        messageText={"Привет, чем могу помочь?"}
                        userName={"Sofia"}
                        isFromUser={false}
                        time={Date.now().toString()}
                        status={"Прочитано"}
                    />
                    {messages.map((msg) => (

                        <Message
                            key={msg.id}
                            id={msg.id}
                            userName={msg.userName}
                            messageText={msg.messageText}
                            time={msg.time}
                            status={msg.status}
                            isFromUser={msg.isFromUser}/>
                    ))}
                </div>

                {/* Online status */}
                <div className="AIChatStatusBar">
                    <span className="StatusDot"/>
                    <span className="StatusText">Онлайн</span>
                </div>

                {/* Input area */}
                <div className="AIChatInputArea">
                    <div className="AIChatInputWrap">
                        <textarea
                            className="AIChatInput"
                            placeholder="Напишите сообщение..."
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={2}
                        />
                    </div>

                    <div className="AIChatButtons">
                        <button className="AIIconButton" title="Прикрепить файл">
                            📎
                        </button>
                        <button
                            className="AISendButton"
                            title="Отправить сообщение"
                            onClick={sendRequest}
                            disabled={isSending}
                        >
                            <span>{isSending ? "Отправка..." : "Отправить"}</span>
                            <span>📤</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChat;