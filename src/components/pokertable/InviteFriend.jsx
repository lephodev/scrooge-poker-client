import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { socket } from '../../config/socketConnection';
import contants from '../../config/contants';

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
    socket.on('invitationSend', (data) => {
      toast.success('Invitation Send Successfully', { id: 'A' });
    });
    socket.on('noInvitationSend', () => {
      toast.success('Unable to send Invitation', { id: 'A' });
    });
  }, []);

  const fetchFriendList = useCallback(async () => {
    try {
      const res = await axios.get(
        contants.serverUrl + '/getUserForInvite/' + tableId
      );
      console.log(res.data.data);
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
  console.log({ friendList });
  const handleInvitationSend = () => {
    if (!invPlayers.length) {
      toast.error('Please select any player');
      return;
    }

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
      borderBottom: '1px solid #2d2d32',
      color: '#ddd',
      backgroundColor: '#191b25',
    }),
    control: () => ({
      border: '1px solid #51525f',
      borderRadius: '.25rem',
      display: 'flex',
      padding: '2px 10px',
      backgroundColor: 'transparent',
      color: '#fff',
    }),

    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: '#b9a11e',
        color: '#fff',
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
          <p>Select friend to invite</p>
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
            <Button onClick={handleInvitationSend}>Invite Friend</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default InviteFriend;
