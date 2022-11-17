import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, Row, Col } from 'react-bootstrap';
import {useHistory} from 'react-router-dom'
import './home.css';
import { useEffect } from 'react';
import userUtils from '../../utils/user';
import loaderImg from '../../assets/chat/loader1.webp';
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
      <div className='btn-container container mb-4'>
        <div>
          <p>Welcome {userData?.username}</p>
          <p>Wallet: {userData?.wallet || 0}</p>
        </div>
        <div>
          <button
            type='button'
            className='btn btn-primary'
            onClick={handleShow}>
            Create Game
          </button>
        </div>
      </div>

      <div className='open-table'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12 mb-4'>
              <h3>Open Tables</h3>
            </div>
            <GameTable />
            <GameTable />
            <GameTable />
          </div>
        </div>
      </div>

      <div className='open-tournament'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12 mb-4'>
              <h3>Open Tournament</h3>
            </div>
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
    <Modal show={show} onHide={handleShow}>
      <Modal.Header closeButton>
        <Modal.Title className='text-dark'>Create Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className='mb-3' controlId='formPlaintextPassword'>
          <Form.Label className='text-dark'>Enter game name</Form.Label>
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
        <Form.Group className='mb-3' controlId='formPlaintextPassword'>
          <Form.Label className='text-dark'>
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
          className='text-dark'
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
    <div className='col-md-4 mb-4'>
      <div className='card'>
        <img
          className='card-img-top'
          src='https://images.unsplash.com/10/wii.jpg?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
          alt=''
        />
        <div className='card-body'>
          <h5 className='card-title text-dark'>Adam's Game</h5>

          <AvatarGroup
            imgArr={[
              'https://www.fillmurray.com/50/50',
              'https://www.fillmurray.com/100/100',
              'https://www.fillmurray.com/200/200',
              'https://www.fillmurray.com/150/150',
              'https://www.fillmurray.com/50/50',
            ]}
          />
          <a href='/' className='btn btn-primary'>
            Join Game
          </a>
        </div>
      </div>
    </div>
  );
};

const AvatarGroup = ({ imgArr }) => {
  return (
    <>
      <div className='avatars'>
        {Array.isArray(imgArr) &&
          imgArr.map((el) => (
            <span className='avatar'>
              <img src={el} width='30' height='30' alt='' />
            </span>
          ))}
      </div>
      <p className='text-dark'>{imgArr?.length || 0} people</p>
    </>
  );
};

export default Home;
