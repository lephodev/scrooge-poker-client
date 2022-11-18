import React, { useState } from "react";
import { Form, Button } from "react-bootstrap"
import logo from "../../assets/game/logo.png";
import "./chat.css";
import { socket } from '../../config/socketConnection';

const Chat = ({ open, handleClick, userId, tableId }) => {
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        if (e.target.value.length <= 60)
            setMessage(e.target.value);
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
    }

    return (
        <div className={`chat-wrapper ${open ? `expand` : ``}`}>

            <div className="chat-section">
                {open ? <div className="chat-header">
                    <span className="close-icon" onClick={() => handleClick(!open)} role="presentation"><i className="fa fa-close" /></span>
                </div> : ''}
                <div className="chat-content-box">
                    <div className="chat-content">
                        <div className="chat-logo">
                            <img src={logo} alt="logo" />
                        </div>
                        <span className="msg-limit">Remaining Character - {60 - message.length}</span>
                        <div className="chat-search chat-input">
                            <Form inline onSubmit={handleMessage}>
                                <Form.Control
                                    type="text"
                                    placeholder="Type message"
                                    onChange={handleChange}
                                    value={message}
                                />

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







