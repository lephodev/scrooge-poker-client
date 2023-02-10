import React, { useEffect, useRef, useState } from "react";
import { socket } from '../../config/socketConnection';
import avtar from "../../assets/profile_user.jpg";
import WinHistoryPopup from "./winHistorypopup";
import { useMediaQuery } from "react-responsive";

const ChatHistory = ({ openChatHistory, handleOpenChatHistory, setOpenChatHistory, userId, roomData, chatMessages, scrollToBottom, scrollDownRef }) => {
  // const [message, setMessages] = useState([]);
  const [typingOnChat, setTypingOnChat] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [winHistoryData, setWinHistoryData] = useState([])
  const isDesktop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  // const isRoomData = roomData?.showdown?.length;
  const winPlayerData = roomData?.winnerPlayer[roomData?.winnerPlayer?.length - 1];

  const wrapperRef = useRef(null);

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        console.log("isDesktop",!isDesktop)
        if (!isDesktop && ref.current && !ref.current.contains(event.target) ) {
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
    if (winPlayerData) {
      setWinHistoryData((prev) => ([...prev, winPlayerData]));
    }
  }, [winPlayerData])


  useEffect(() => {
    if (openChatHistory) {
      scrollToBottom();
    }
  })

  useOutsideAlerter(wrapperRef);

  const handleWinPopup = () => {
    setModalShow(!modalShow)
  }

  return (
    <div
      className={`chatHistory-Container ${!openChatHistory ? "" : "expand"}`}
      ref={wrapperRef}
    >
      <div className="chatHistory-header">
        <div className="Chatgame-title"> Chat History</div>
        <div className="chatBubble-typing">{typingOnChat ? "Typing..." : null}</div>
        <div className="Gameplayer-count">
          <div className="greendot" /> <h4>Players</h4>
          <h3>{roomData?.players?.length}</h3>
        </div>
        <div className="hamburger" onClick={handleOpenChatHistory}>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
      <div className="chatHistory-comments">
        {chatMessages?.map((msg) => {
          return (
            <>
              <div className={`playerComment-box ${userId === msg.userId ? "playerSelfMssg" : ""}`}>
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
        {winHistoryData?.map((data, i) => (
          <div className="playerComment-box" key={i}  onClick={handleWinPopup}>
            <div className="everyRoundData">--- {data?.name} wins --- </div>
          </div>
        ))}
        <div style={{ float: "left", clear: "both" }}
          ref={scrollDownRef}>
        </div>
      </div>
      <WinHistoryPopup modalShow={modalShow} setModalShow={setModalShow} />
    </div>
  );
};

export default ChatHistory;
