import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import Select from "react-select";
import { socket } from "../../config/socketConnection";
const InviteFriend = ({
  userId,
  tableId,
  gameCollection,
  setShowInvite,
  showInvite,
  roomData,
}) => {
  const [invPlayers, setInvPlayers] = useState([]);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    socket.on("invitationSend", (data) => {
      toast.success("Invitation Send Successfully", { id: "A" });
    });
    socket.on("noInvitationSend", () => {
      toast.success("Unable to send Invitation", { id: "A" });
    });
  }, []);

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const res = await axios.get(
          "https://base-api-t3e66zpola-uk.a.run.app",
          {
            params: {
              usid: userId,
              service: "getFr-BlockTables",
              params: `usid=${userId},mode=lobby`,
            },
          }
        );
        if (res.data.error === "no error") {
          let list = [];
          res.data.friendList.forEach((friend) => {
            if (
              !roomData.players.find((ele) => ele.userid === friend.uid) &&
              !roomData.invPlayers.find((ele) => ele === friend.uid)
            )
              list.push({
                label: friend.nickname,
                value: friend.uid,
              });
          });
          setFriendList(list);
        }
      } catch (err) {
        console.log("Error in fetch friend list =>", err.message);
      }
    };
    if (userId && roomData) {
      fetchFriendList();
    }
  }, [userId, roomData]);

  const handleInvitationSend = () => {
    socket.emit("invPlayers", {
      invPlayers: invPlayers,
      tableId,
      gameType: gameCollection,
      userId: userId,
    });
  };
 
const customStyles = {
  option: (provided) => ({
    ...provided,
    background: '#333333',
    color: '#fff',
    fontWeight: '400',
    fontSize: '16px',
    padding: '12px',
    lineHeight: '16px',
    cursor: 'pointer',
    ':hover': {
      background: '#2a2a2a',
    },
  }),
  menu: (provided) => ({
    ...provided,
    background: '#333333',
    padding: '0px',
    border: '2px solid transparent',
  }),
  control: () => ({
    background: '#333333',
    border: '2px solid transparent',
    borderRadius: '4px',
    color: '#fff',
    display: 'flex',
    alignItem: 'center',
    height: '38px',
    margin: '10px 0',
    ':hover': {
      background: '#333333',
      // border: "2px solid #306CFE",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '16px',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  placeholder: (provided) => ({
    ...provided,
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '19px',
    color: '#fff',
  }),
  input: (provided) => ({
    ...provided,
    height: "38px",
    color: "fff",
  }),
};

  return (
    <Modal
      show={showInvite}
      onHide={() => {
        setShowInvite(false);
      }}
      centered
      className="friends-popup leave-confirm invite-friend"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="block">
          <p>Select friends to invite</p>
          <div className="sub-btn text-center">
            <Select
              isMulti
              name="friendList"
              options={friendList}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={customStyles}
              onChange={(value) => setInvPlayers(value)}
            />
            <Button
              onClick={() => {
                handleInvitationSend();
              }}
            >
              Invite Friends
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default InviteFriend;
