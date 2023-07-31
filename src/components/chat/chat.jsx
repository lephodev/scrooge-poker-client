import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap"
// import logo from "../../assets/game/logo-poker.png";
import "./chat.css";
import { socket } from '../../config/socketConnection';
import Picker from 'emoji-picker-react';

const Chat = ({ open, handleClick, userId, tableId,currentPlayer}) => {
    const [message, setMessage] = useState('');
    const [openEmoji, setOpenEMoji] = useState(false);
    const ref = useRef(null);

    const handleChange = (e) => {
        if (e.target.value.length <= 60) {
            setMessage(e.target.value);
            socket.emit('typingOnChat', { userId, tableId, typing: true });
            setOpenEMoji(false);
        }

    }

    const handleOnFocusOut = () => {
        socket.emit('typingOnChat', { userId, tableId, typing: false });
        setOpenEMoji(false);
    }

    const handleMessage = (e) => {
        e.preventDefault();
        if (message.length === 0) {
            return false
        }
        socket.emit('chatMessage', {
            userId,
            message,
            tableId
        });
        setMessage('');
        setOpenEMoji(false);
    }

    const handleOnEmojiClick = (emojiObject, e) => {
        if (message.length <= 59) {
            setMessage(message + emojiObject.emoji);
        }
    }

    const handleChatClose = () => {

        handleClick(!open);
        setOpenEMoji(false);
    }

    return (
        <div className={`chat-wrapper ${open && currentPlayer && currentPlayer.id === userId ? 'currentWithChat':''} ${ open ? `expand` : `` }`}>

            {openEmoji ? <Picker emojiStyle={{ width: "100%" }} onEmojiClick={handleOnEmojiClick} /> : null}
            <div className="chat-section">
                {open ? <div className="chat-header">
                    <span className="close-icon" onClick={handleChatClose} role="presentation"><i className="fa fa-close" /></span>
                </div> : ''}
                <div className="chat-content-box">
                    <div className="chat-content">
                        {/* <div className="chat-logo">
                            <img src={logo} alt="logo" />
                        </div> */}
                        <h6>Chat with your buddies</h6>

                        <span className="msg-limit">Remaining Character - {60 - message.length}</span>
                        <div className="chat-search chat-input">
                            <Form inline onSubmit={handleMessage}>
                                <Form.Control
                                    ref={ref}
                                    type="text"
                                    placeholder="Type your message ..."
                                    onChange={handleChange}
                                    value={message}
                                    onBlur={handleOnFocusOut}
                                />
                                <Button type="button" onClick={() => { setOpenEMoji(!openEmoji) }} ><i class="fa fa-smile-o" aria-hidden="true"></i></Button>
                                <Button type='submit'><i className="fa fa-location-arrow" /></Button>
                            </Form>
                        </div>
                    </div>
                </div>


            </div>

        </div>

    );
};

export default Chat;







