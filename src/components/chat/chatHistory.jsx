import React, { useEffect, useRef, useState } from "react";

// import logo from "../../assets/game/logo-poker.png";
import { socket } from '../../config/socketConnection';
import avtar from "../../assets/profile_user.jpg";


const ChatHistory = ({ openChatHistory, handleOpenChatHistory, setOpenChatHistory, userId, chatMessages, scrollToBottom, scrollDownRef }) => {
  // const [message, setMessages] = useState([]);
  const [typingOnChat, setTypingOnChat] = useState(false);
  const wrapperRef = useRef(null);
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenChatHistory(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  useEffect(() => {
    socket.on('typingOnChat', (data) => {
      const { crrTypingUserId, typing } = data;
      console.log("on typing ");
      if (userId !== crrTypingUserId) {
        setTypingOnChat(typing);
      }
    });
  })



  useEffect(() => {
    if (openChatHistory) {
      scrollToBottom();
    }
  })



  useOutsideAlerter(wrapperRef);

  return (
    <div
      className={`chatHistory-Container ${ !openChatHistory ? "" : "expand" }`}
      ref={wrapperRef}
    >
      <div className="chatHistory-header">
        {/* <img className="Chatgame-logo " src={logo} alt="" /> */}
        <div className="Chatgame-title"> Chat History</div>
        {typingOnChat ? "Typing..." : null}
        {/* <div className="Gameplayer-count">
          <div className="greendot" /> <h4>Players</h4>
          <h3>5</h3>
        </div> */}
        <div className="hamburger" onClick={handleOpenChatHistory}>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
      <div className="chatHistory-comments">
        {chatMessages?.map((msg) => {
          return (
            <>
              <div className={`playerComment-box ${ userId === msg.userId ? "playerSelfMssg" : "" }`}>
                <div className="playerAvtar">
                  <img src={msg.profile ? msg.profile : avtar} alt="" />
                </div>
                <div className="playerMssgtoDisplay">
                  <div className="playerName">{msg.firstName}</div>
                  <p>{msg.message}</p>
                </div>
              </div>
            </>
          )
        })
        }
        <div style={{ float: "left", clear: "both" }}
          ref={scrollDownRef}>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
