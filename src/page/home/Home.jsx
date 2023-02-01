import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./home.css";
import { useEffect } from "react";
import userUtils from "../../utils/user";
import loaderImg from "../../assets/chat/loader1.webp";
import casino from "../../assets/game/placeholder.png";
import logo from "../../assets/game/logo.png";
import { pokerInstance } from "../../utils/axios.config";
import CONSTANTS from "../../config/contants";
import Homesvg from "../../assets/home.svg";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { useMemo } from "react";
import numFormatter from "../../utils/utils";
import token from "../../assets/coin.png";
import tickets from "../../assets/tickets.png";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";

const Home = () => {
  // inital state
  const gameInit = {
    gameName: "",
    public: false,
    minchips: "",
    maxchips: "",
    autohand: true,
    sitInAmount: "",
    invitedUsers: [],
  };

  // States
  const [searchText, setSearchText] = useState("");
  const [loader, setLoader] = useState(true);
  const [userData, setUserData] = useState({});
  const [gameState, setGameState] = useState({ ...gameInit });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [pokerRooms, setPokerRooms] = useState([]);
  const history = useHistory();
  const [allUsers, setAllUsers] = useState([]);

  // utils function
  const handleShow = () => setShow(!show);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "public" || name === "autohand") {
      setGameState({ ...gameState, [name]: e.target.checked });
    } else if (name === "gameName") {
      if (value.length <= 20) {
        setGameState({ ...gameState, [name]: value });
        setErrors({
          ...errors,
          gameName: "",
        });
      } else {
        setErrors({
          ...errors,
          gameName: "Maximum 20 character is allowed for game name.",
        });
      }
    } else {
      setGameState({ ...gameState, [name]: value });
    }
  };
  const handleChnageInviteUsers = (selectedOptions) => {
    setGameState({ ...gameState, invitedUsers: [...selectedOptions] });
  };

  const validateCreateTable = () => {
    let valid = true;
    let err = {};
    const mimimumBet = 0;
    if (gameState.gameName === "") {
      err.gameName = "Game name is required.";
      valid = false;
    }
    if (!userData?.wallet || gameState.minchips > userData?.wallet) {
      err.minchips = "You don't have enough balance in your wallet.";
      valid = false;
    } else if (gameState.minchips <= mimimumBet) {
      err.minchips =
        `Minimum bet can't be less then or equal to ` + mimimumBet + ".";
      valid = false;
    }

    if (!gameState.sitInAmount) {
      err.sitInAmount = `Sit in amount is required.`;
      valid = false;
    }

    if (parseFloat(gameState.sitInAmount) < 100) {
      err.sitInAmount = `Minimum sit in amount is 100.`;
      valid = false;
    }

    if (parseFloat(gameState.sitInAmount) > userData?.wallet) {
      err.sitInAmount = `You don't have enough balance.`;
      valid = false;
    }

    //  else if (!gameState.maxchips) {
    //   err.maxchips = 'Please enter amount for big blind.';
    //   valid = false;
    // }
    else if (parseFloat(gameState.maxchips) < parseFloat(gameState.minchips)) {
      err.maxchips = "Big blind amount cant be less then small blind";
      valid = false;
    } else if (!gameState.public && !gameState.invitedUsers.length) {
      err.invitedPlayer = "Please invite some player if table is private.";
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
      const resp = await pokerInstance().post("/createTable", {
        ...gameState,
        sitInAmount: parseInt(gameState.sitInAmount),
      });
      setGameState({ ...gameInit });
      history.push({
        pathname: "/table",
        search: "?gamecollection=poker&tableid=" + resp.data.roomData._id,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message, { id: "create-table-error" });
      }
    }
  };

  useEffect(() => {
    (async () => {
      const response = await pokerInstance().get("/getAllUsers");
      setAllUsers(response.data.allUsers);
    })();
  }, []);

  // UseEffects
  useEffect(() => {
    (async () => {
      const data = await userUtils.getAuthUserData();
      if (!data.success) {
        return (window.location.href = `${CONSTANTS.landingClient}`);
      }
      setLoader(false);
      setUserData({ ...data.data.user });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await pokerInstance().get("/rooms");
        setPokerRooms(response.data.rooms);
      } catch (error) {}
    })();
  }, []);

  const options = useMemo(
    () =>
      allUsers.map((el) => {
        return { value: el.id, label: el.username };
      }),
    [allUsers]
  );

  const renderWallet = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This is your token balance, and can be used for betting.
    </Tooltip>
  );
  const renderTicket = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This is your ticket balance and can be redeemed for prizes.
    </Tooltip>
  );

  const filterRoom = pokerRooms.filter((el) =>
    el.gameName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="poker-home">
      {loader && (
        <div className="poker-loader">
          <img src={loaderImg} alt="loader-Las vegas" />
        </div>
      )}
      <CreateTable
        handleChange={handleChange}
        show={show}
        handleShow={handleShow}
        values={gameState}
        createTable={createTable}
        errors={errors}
        options={options}
        handleChnageInviteUsers={handleChnageInviteUsers}
      />
      <div className="user-header">
        <div className="container">
          <div className="user-header-grid">
            <div className="casino-logo">
              <a href="https://scrooge.casino/">
                <img src={logo} alt="" />
              </a>
            </div>
            <div className="create-game-box">
              <div className="create-game-box-avtar">
                <img src={userData?.profile || "https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
                } alt="" />
                <h5>{userData?.username}</h5>
              </div>
              <div className="walletTicket-box">
                <div className="pokerWallet-box">
                  <img src={token} alt="" className="pokerWallet" />
                  <span>{numFormatter(userData?.wallet || 0)}</span>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderWallet}
                  >
                    <Button variant="success">
                      <FaQuestionCircle />
                    </Button>
                  </OverlayTrigger>
                </div>
                <div className="pokerWallet-box">
                  <img src={tickets} alt="" className="pokerWallet" />
                  <span>{numFormatter(userData?.ticket || 0)}</span>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTicket}
                  >
                    <Button variant="success">
                      <FaQuestionCircle />
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>
              <button
                type="button"
                className="create-game-boxBtn"
                onClick={handleShow}
              >
                Create Game
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="home-poker-card">
        <div className="container">
          <div className="poker-table-header">
            <div className="backtoHome">
              <a href="https://scrooge.casino/">
                <img src={Homesvg} alt="home" />
                Home
              </a>
            </div>

            <div className="poker-tableSearch-box">
              <div className="poker-tableSearch">
                <input
                  id="mySearchInput"
                  className="form-control"
                  value={searchText}
                  placeholder="Search tables . . . ."
                  onChange={(e) => setSearchText(e.target.value)}
                  autoComplete="off"
                />
                {/* <button>
                  <FaSearch />
                </button> */}
              </div>
            </div>
          </div>

          {filterRoom.length > 0 ? (
            <>
              <h3>Poker Open Tables</h3>
              <div className="home-poker-card-grid">
                {filterRoom.map((el) => (
                  <GameTable data={el} />
                ))}
              </div>
            </>
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
              <div className="no-room-available">
                <h4>No Room Available</h4>
                <button type="button" onClick={handleShow}>
                  Create Game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="home-poker-card">
        <div className="container">
          {/* <h3>Open Tournaments</h3> */}
          <div className="home-poker-card-grid">
            {/* <GameTable />
            <GameTable />
            <GameTable /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const customStyles = {
  option: (provided) => ({
    ...provided,
    background: "#333333",
    color: "#fff",
    fontWeight: "400",
    fontSize: "16px",
    padding: "12px",
    lineHeight: "16px",
    cursor: "pointer",
    ":hover": {
      background: "#2a2a2a",
    },
  }),
  menu: (provided) => ({
    ...provided,
    background: "#333333",
    padding: "0px",
    border: "2px solid transparent",
  }),
  control: () => ({
    background: "#333333",
    border: "2px solid transparent",
    borderRadius: "4px",
    color: "#fff",
    display: "flex",
    alignItem: "center",
    height: "inherit",
    margin: "10px 0",
    ":hover": {
      background: "#333333",
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
    color: "#fff",
  }),
  input: (provided) => ({
    ...provided,
    // height: "38px",
    color: "fff",
  }),
};

const CreateTable = ({
  show,
  handleShow,
  handleChange,
  values,
  createTable,
  errors,
  options,
  handleChnageInviteUsers,
}) => {
  return (
    <Modal show={show} onHide={handleShow} centered className="casino-popup">
      <Modal.Header closeButton>
        <Modal.Title className="text-dark">Create Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="form-group" controlId="formPlaintextPassword">
          <Form.Label>Enter Table name</Form.Label>
          <Form.Control
            name="gameName"
            type="text"
            placeholder="Ex : John's game"
            onChange={handleChange}
            value={values.gameName}
          />
          {!!errors?.gameName && (
            <p className="text-danger">{errors?.gameName}</p>
          )}
        </Form.Group>
        <Form.Group
          className="form-group blindpopupField"
          controlId="formPlaintextPassword"
        >
          <div>
            <Form.Label>Sit in amount</Form.Label>
            <Form.Control
              name="sitInAmount"
              onChange={handleChange}
              value={values.sitInAmount}
              type="number"
              placeholder="Ex : 100"
            />
            {!!errors?.sitInAmount && (
              <p className="text-danger">{errors?.sitInAmount}</p>
            )}
          </div>

          <div>
            <Form.Label>Small Blind</Form.Label>
            <Form.Control
              name="minchips"
              onChange={handleChange}
              value={values.minchips}
              type="number"
              placeholder="Ex : 50"
            />
            {!!errors?.minchips && (
              <p className="text-danger">{errors?.minchips}</p>
            )}
          </div>

          <div>
            <Form.Label>Big Blind</Form.Label>
            <Form.Control
              name="maxchips"
              onChange={handleChange}
              value={values.minchips * 2}
              type="number"
              placeholder="Ex : 1000"
              disabled
            />
            {/* {!!errors?.maxchips && (
              <p className='text-danger'>{errors?.maxchips}</p>
            )} */}
          </div>
        </Form.Group>
        <div className="searchSelectDropdown">
          <Form.Label>Invite Users</Form.Label>
          <Select
            isMulti
            onChange={handleChnageInviteUsers}
            options={options}
            styles={customStyles}
          />
          {!!errors?.invitedPlayer && (
            <p className="text-danger">{errors?.invitedPlayer}</p>
          )}
        </div>
        <div className="createGameCheckHand">
          <Form.Check
            inline
            label="Public Game"
            name="public"
            type="checkbox"
            id={"public"}
            onChange={handleChange}
            checked={values.public}
          />
          <Form.Check
            inline
            label="Auto Hand"
            name="autohand"
            type="checkbox"
            id={"autohand"}
            onChange={handleChange}
            checked={values.autohand}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleShow}>
          Close
        </Button>
        <Button variant="primary" onClick={createTable}>
          Create Table
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GameTable = ({ data }) => {
  const history = useHistory();
  const redirectToTable = () => {
    history.push({
      pathname: "/table",
      search: "?gamecollection=poker&tableid=" + data?._id,
    });
  };

  return (
    <div className="home-poker-content">
      <div className="home-poker-cover">
        <img alt="" src={casino} />
      </div>
      <div className="home-poker-info">
        <h4>{data.gameName}</h4>

        <AvatarGroup imgArr={data.players} />
        <button onClick={redirectToTable} type="submit">
          Join Game
        </button>
      </div>
    </div>
  );
};

const AvatarGroup = ({ imgArr }) => {
  return (
    <div className="poker-avatar-box">
      <div className="avatars">
        {Array.isArray(imgArr) &&
          imgArr.map((el) => (
            <span className="avatar">
              <img
                src={
                  el.photoURI ||
                  "https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
                }
                width="30"
                height="30"
                alt=""
              />
            </span>
          ))}
      </div>
      <p>{imgArr?.length || 0} people</p>
    </div>
  );
};

export default Home;
