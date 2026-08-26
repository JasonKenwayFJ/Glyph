import "./Message.css";
import {message} from "../../../types/ai/Message.ts";




const Message = ({time, isFromUser, userName, messageText, status}: message) => {

    const formattedTime = new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className={`MessageBubble ${isFromUser ? "fromUser" : "fromOther"}`}>
            {/* Заголовок с аватаром */}
            <div className="MessageHeader">
                <span className="MessageAvatar" />
                <span className="MessageUserName">{userName}</span>
            </div>

            <div className="MessageDivider" />

            {/* Текст сообщения */}
            <p className="MessageText">{messageText}</p>

            {/* Статус и время */}
            <div className="MessageFooter">
                <div className="MessageStatus">
                    <span>{status}</span>
                    <span className="MessageStatusIcon">✓</span>
                </div>
                <span className="MessageTime">{formattedTime}</span>
            </div>
        </div>
    );
};

export default Message;