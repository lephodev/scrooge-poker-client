import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form} from 'react-bootstrap';
import {useHistory} from 'react-router-dom'
import './home.css';
import { useEffect } from 'react';
import userUtils from '../../utils/user';
import loaderImg from '../../assets/chat/loader1.webp';
import casino from '../../assets/game/placeholder.png';
import logo from '../../assets/game/logo-poker.png';
import { pokerInstance } from '../../utils/axios.config';

const Home = () => {
  // inital state
  const gameInit = {
    gameName: '',
    public: false,
    minchips: '',
  };

  const history = useHistory();

  // States
  const [loader, setLoader] = useState(true);
  const [userData, setUserData] = useState({});
  const [gameState, setGameState] = useState({ ...gameInit });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});

  // utils function
  const handleShow = () => setShow(!show);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'public') {
      setGameState({ ...gameState, [name]: e.target.checked });
    } else {
      setGameState({ ...gameState, [name]: value.trim() });
    }
  };

  const validateCreateTable = () => {
    let valid = true;
    let err = {};
    const mimimumBet = 0;
    if (gameState.gameName === '') {
      err.gameName = 'Game name is required.';
      valid = false;
    }
    if (!userData?.wallet || gameState.minchips > userData?.wallet) {
      err.minchips = "You don't have enough balance in your wallet.";
      valid = false;
    } else if (gameState.minchips <= mimimumBet) {
      err.minchips =
        'Minimum bet cant be less then or equal to ' + mimimumBet + '.';
      valid = false;
    }
    return { valid, err };
  };

  const createTable = async () => {
    setErrors({});
    const tableValidation = validateCreateTable();
    if (!tableValidation.valid) {
      setErrors({ ...tableValidation.err });
      return;
    }
    try {
      const resp = await pokerInstance().post('/createTable', gameState);
      console.log('Create table response ',resp.data);
      setGameState({ ...gameInit });
      history.push({
        pathname: '/table',
        search: '?gamecollection=poker&tableid=' + resp.data.roomData._id
      })
    } catch (error) {
      console.log(error)
    }


  };

  // UseEffects
  useEffect(() => {
    (async () => {
      const data = await userUtils.getAuthUserData();
      if (!data.success) {
        return (window.location.href = `${window.location.origin}/login`);
      }
      setLoader(false);
      setUserData({ ...data.data.user });
    })();
  }, []);

  return (
    <div className='poker-home'>
      {loader && (
        <div className='poker-loader'>
          <img src={loaderImg} alt='loader-Las vegas' />{' '}
        </div>
      )}
      <CreateTable
        handleChange={handleChange}
        show={show}
        handleShow={handleShow}
        values={gameState}
        createTable={createTable}
        errors={errors}
      />

      <div className='user-header'>
        <div className='container'>
        <div className='user-header-grid'>
          <div className='casino-logo'>
            <img src={logo} alt="" />
          </div>
          <div className='create-game-box'>
            <div className='user-info-box'>
              <h5>{userData?.username}</h5>
              <p><i className='fa fa-wallet' /> <span>{userData?.wallet || 0}</span></p>
            </div>
            <button
              type='button'
              onClick={handleShow}>
              Create Game
            </button>
          </div>
        </div>
        </div>
      </div>

      <div className='home-poker-card'>
        <div className='container'>
            <h3>Open Tables</h3>
            <div className='home-poker-card-grid'>
              <GameTable />
              <GameTable />
              <GameTable />
            </div>
        </div>
      </div>

      <div className='home-poker-card'>
        <div className='container'>
            <h3>Open Tourrnaments</h3>
            <div className='home-poker-card-grid'>
            <GameTable />
            <GameTable />
            <GameTable />
          </div>
        </div>
      </div>

    </div>
  );
};

const CreateTable = ({
  show,
  handleShow,
  handleChange,
  values,
  createTable,
  errors,
}) => {
  return (
    <Modal show={show} onHide={handleShow} centered className='casino-popup'>
      <Modal.Header closeButton>
        <Modal.Title className='text-dark'>Create Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className='form-group' controlId='formPlaintextPassword'>
          <Form.Label>Enter game name</Form.Label>
          <Form.Control
            name='gameName'
            type='text'
            placeholder="Ex : John's game"
            onChange={handleChange}
            value={values.gameName}
          />
          {!!errors?.gameName && (
            <p className='text-danger'>{errors?.gameName}</p>
          )}
        </Form.Group>
        <Form.Group className='form-group' controlId='formPlaintextPassword'>
          <Form.Label>
            Enter minimum bet amount
          </Form.Label>
          <Form.Control
            name='minchips'
            onChange={handleChange}
            value={values.minchips}
            type='number'
            placeholder='Ex : 50'
          />
          {!!errors?.minchips && (
            <p className='text-danger'>{errors?.minchips}</p>
          )}
        </Form.Group>
        <Form.Check
          inline
          label='Public Game'
          name='public'
          type='checkbox'
          id={'public'}
          onChange={handleChange}
          checked={values.public}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleShow}>
          Close
        </Button>
        <Button variant='primary' onClick={createTable}>
          Create Table
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GameTable = () => {
  return (
    <div className='home-poker-content'>
      <div className='home-poker-cover'>
        <img
          alt=""
          src={casino}
        />
        </div>
        <div className='home-poker-info'>
          <h4>Adam's Game</h4>

          <AvatarGroup
            imgArr={[
              'https://www.fillmurray.com/50/50',
              'https://www.fillmurray.com/100/100',
              'https://www.fillmurray.com/200/200',
              'https://www.fillmurray.com/150/150',
              'https://www.fillmurray.com/50/50',
            ]}
          />
          <button type='submit'>
            Join Game
          </button>
        </div>
      </div>
  );
};

const AvatarGroup = ({ imgArr }) => {
  return (
    <div className='poker-avatar-box'>
      <div className='avatars'>
        {Array.isArray(imgArr) &&
          imgArr.map((el) => (
            <span className='avatar'>
              <img src={el} width='30' height='30' alt='' />
            </span>
          ))}
      </div>
      <p>{imgArr?.length || 0} people</p>
    </div>
  );
};

export default Home;
