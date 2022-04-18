import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import Message from '../Message';
import './styles.css';

const MessageHolder = () => {

    const userContext = useContext(UserContext);

    function removeMessage(event) {
        userContext.setMessages(userContext.messages.filter((message) => {}))
    }

    return (
        <div className="message-holder-main">
            { userContext.messages.map((message, index) => {

                let messageType = message.type;

                if (messageType == null) messageType = 'warning';

                return (
                    <Message key={index}  type={messageType} value={message.value} onClick={removeMessage} />
                )
            }) }
        </div>
    )
}

export default MessageHolder;