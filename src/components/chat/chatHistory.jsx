/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { socket } from '../../config/socketConnection';
import avtar from "../../assets/profile_user.jpg";
import WinHistoryPopup from "./winHistorypopup";
import { useMediaQuery } from "react-responsive";

const ChatHistory = ({ openChatHistory, handleOpenChatHistory, setOpenChatHistory, userId, roomData, chatMessages, leaveTable }) => {
  // const [message, setMessages] = useState([]);
  const [typingOnChat, setTypingOnChat] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [winHistoryData, setWinHistoryData] = useState([]);
  const [typingPlayrName, setTypingPlayerName] = useState("");
  const [winPopupData, setWinPopupData] = useState();
  const isDesktop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  // const isRoomData = roomData?.showdown?.length;

  const wrapperRef = useRef(null);
  const scrollDownRef = useRef(null)


  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!isDesktop && ref.current && !ref.current.contains(event.target)) {
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
      const { crrTypingUserId, typing, userName } = data;
      if (userId !== crrTypingUserId) {
        setTypingOnChat(typing);
        setTypingPlayerName(userName)
      }
    });
    socket.on('winner', (data) => {
      const room = data.updatedRoom;
      let filterData = room.handWinner.filter(arr => (arr.length));
      setWinHistoryData(filterData)
    });
    socket.on('updateGame', (data) => {
      const room = data.game;
      let filterData = room.handWinner.filter(arr => (arr.length));
      setWinHistoryData(filterData)
    })
  }, [])



  // useEffect(() => {
  //   if (openChatHistory) {
  //     scrollToBottom();
  //   }
  // }, [openChatHistory])

  useOutsideAlerter(wrapperRef);

  const handleWinPopup = (data) => {
    setModalShow(!modalShow)
    setWinPopupData(data)
  }

  const scrollToBottom = () => {
    scrollDownRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages?.length, openChatHistory])


  console.log("Chat messages ===>", chatMessages);

  return (
    <div
      className={`chatHistory-Container ${ !openChatHistory ? "" : "expand" }`}
      ref={wrapperRef}
    >
      <div className="chatHistory-header">
        <div className="Chatgame-title"> Chat History</div>
        <div className="chatBubble-typing">{typingOnChat ? `${ typingPlayrName } Typing...` : null}</div>
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
              <div className={`playerComment-box ${ userId === msg.userId ? "playerSelfMssg" : "" }`} ref={scrollDownRef}>
                <div className="playerAvtar">
                  <img src={msg.profile ? msg.profile : avtar} alt="" />
                </div>
                <div className="playerMssgtoDisplay">
                  <div className="playerName">{msg?.username?.toLowerCase()}</div>
                  <p>{msg.message}</p>
                </div>
              </div>
            </>
          )
        })
        }
        {/* {console.log("winHistoryData",winHistoryData)} */}
        {winHistoryData?.map((data, i) => (
          <div className="playerComment-box" key={i} onClick={() => handleWinPopup(data)}>
            <div className="everyRoundData">
              {data.map(win => (
                `--- ${ win?.name } wins ---`
              ))}
            </div>
          </div>
        ))}
        <div style={{ float: "left", clear: "both" }}
          ref={scrollDownRef}>
        </div>
      </div>
      <WinHistoryPopup modalShow={modalShow} setModalShow={setModalShow} winPopupData={winPopupData} leaveTable={leaveTable} />
    </div>
  );
};

export default ChatHistory;
