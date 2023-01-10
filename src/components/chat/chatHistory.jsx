import React, { useEffect, useRef } from "react";
// import logo from "../../assets/game/logo-poker.png";
import avtar from "../../assets/profile_user.jpg";

const ChatHistory = ({ openChatHistory, handleOpenChatHistory, setOpenChatHistory }) => {
  const wrapperRef = useRef(null);

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenChatHistory(false)
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  useOutsideAlerter(wrapperRef);

  return (
    <div
      className={`chatHistory-Container ${!openChatHistory ? "" : "expand"}`}
      ref={wrapperRef}
    >
      <div className="chatHistory-header">
        {/* <img className="Chatgame-logo " src={logo} alt="" /> */}
        <div className="Chatgame-title"> Chat History</div>
        <div className="Gameplayer-count">
          <div className="greendot" /> <h4>Players</h4>
          <h3>5</h3>
        </div>
        <div className="hamburger" onClick={handleOpenChatHistory}>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
      <div className="chatHistory-comments">
        <div className="playerComment-box">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>hi this chat history</p>
          </div>
        </div>
        <div className="playerComment-box playerSelfMssg">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg hi
              this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content .... hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content .... content ....
            </p>
          </div>
        </div>
        <div className="playerComment-box ">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content ....
            </p>
          </div>
        </div>
        <div className="playerComment-box ">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content ....
            </p>
          </div>
        </div>
        <div className="playerComment-box ">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content ....
            </p>
          </div>
        </div>
        <div className="playerComment-box ">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content ....
            </p>
          </div>
        </div>
        <div className="playerComment-box ">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content ....
            </p>
          </div>
        </div>
        <div className="playerComment-box ">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content ....
            </p>
          </div>
        </div>
        <div className="playerComment-box ">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content ....
            </p>
          </div>
        </div>
        <div className="playerComment-box ">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content ....
            </p>
          </div>
        </div>
        <div className="playerComment-box ">
          <div className="playerAvtar">
            <img src={avtar} alt="" />
          </div>
          <div className="playerMssgtoDisplay">
            <div className="playerName">Admin</div>
            <p>
              hi this chat history
              dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
              content ....
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
