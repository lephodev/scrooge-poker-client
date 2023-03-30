import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { socket } from '../../config/socketConnection';
import contants from '../../config/contants';
import { Spinner } from 'react-bootstrap';

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
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    socket.on('invitationSend', (data) => {
      toast.success('Invitation Send Successfully', { id: 'A' });
      setShowInvite(false);
      setButtonClicked(false);
    });
    socket.on('noInvitationSend', () => {
      toast.success('Unable to send Invitation', { id: 'A' });
      setButtonClicked(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFriendList = useCallback(async () => {
    try {
      const res = await axios.get(
        contants.serverUrl + '/getUserForInvite/' + tableId
      );
      // console.log(res.data.data);
      if (res.data.data) {
        setFriendList(res.data.data);
      }
    } catch (err) {
      console.log('Error in fetch friend list =>', err.message);
    }
  }, [tableId]);

  useEffect(() => {
    if (tableId) {
      fetchFriendList();
    }
  }, [fetchFriendList, tableId]);
  // console.log({ friendList });
  const handleInvitationSend = () => {
    if (!invPlayers.length) {
      toast.error('Please select any player');
      return;
    }
    setButtonClicked(true);

    socket.emit('invPlayers', {
      invPlayers: invPlayers,
      tableId,
      gameType: gameCollection,
      userId: userId,
    });

    setTimeout(() => {
      fetchFriendList();
    }, 1000);

    setInvPlayers([]);
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      background: "#000",
      color: "#ddd",
      fontWeight: "400",
      fontSize: "16px",
      padding: "10px 20px",
      lineHeight: "16px",
      cursor: "pointer",
      borderRadius: "4px",
      borderBottom: "1px solid #141414",
      textAlign: "left",
      ":hover": {
        background: "#141414",
        borderRadius: "4px",
      },
    }),
    menu: (provided) => ({
      ...provided,
      background: "#000",
      borderRadius: "30px",
      padding: "10px 20px",
      border: "2px solid transparent",
    }),
    control: () => ({
      background: "#000",
      border: "2px solid #000",
      borderRadius: "30px",
      color: "#fff",
      display: "flex",
      alignItem: "center",
      height: "41",
      margin: "2px 0",
      boxShadow: " 0 2px 10px #000000a5",
      cursor: "pointer",
      ":hover": {
        background: "#000",
        // border: "2px solid #306CFE",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "16px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "19px",
      color: "#858585c7",

    }),
    input: (provided) => ({
      ...provided,
      // height: "38px",
      color: "fff",

    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 20px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: "20px",
      color: '#858585c7',
    }),
    svg: (provided) => ({
      ...provided,
      fill: '#858585c7 !important',
      ":hover": {
        fill: '#858585c7 !important',
      },
    }),
  };

  return (
    <Modal
      show={showInvite}
      onHide={() => {
        setShowInvite(false);
      }}
      centered
      className='friends-popup leave-confirm invite-friend'>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className='block'>
          <p>Select friends to invite</p>
          <div className='sub-btn text-center'>
            <Select
              isMulti
              name='friendList'
              options={friendList.map((el) => {
                return { value: el.id, label: el.username };
              })}
              className='basic-multi-select'
              classNamePrefix='select'
              styles={customStyles}
              onChange={(value) => setInvPlayers(value)}
            />
            <Button
              onClick={() => {
                handleInvitationSend();
              }}
              disabled={buttonClicked}>
              {buttonClicked ? <Spinner animation='border' /> : "Invite Friends"}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default InviteFriend;
