/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Spinner } from "react-bootstrap";

import { useHistory } from "react-router-dom";
import "./home.css";
import cookie from "js-cookie";

import userUtils from "../../utils/user";
import loaderImg from "../../assets/chat/loader1.webp";
import casino from "../../assets/game/placeholder.png";
import casino1 from "../../assets/game/logo-poker.png";
import { pokerInstance, tournamentInstance } from "../../utils/axios.config";
import Homesvg from "../../assets/home.svg";
// import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { FaInfoCircle, FaUser, FaTrophy, FaCoins } from "react-icons/fa";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { socket } from "../../config/socketConnection";
import axios from "axios";
import { landingClient } from "../../config/keys";
import UserContext from "../../context/UserContext";
import AlreadyInGamePopup from "../../components/pokertable/alreadyInGamePopup";
import Header from "./header";
import CONSTANTS from "../../config/contants";
import { getCookie } from "../../utils/cookieUtil";
// import feeIcon from "../../assets/images/feeIcon.png"
import ranking from "../../assets/images/ranking.png";
import { dateFormat, timeFormat } from "../../utils/utils"; //, getTime
import PlayerList from "./PlayerList";
let userId;
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
    actionTime: "",
  };
  // States
  const { userInAnyGame, setUserInAnyGame, user, setUser, mode, setMode } =
    useContext(UserContext); //userInAnyGame,
  const [searchText, setSearchText] = useState("");
  const [loader, setLoader] = useState(true);
  const [tLoader, setTLoader] = useState(true);
  const [userData, setUserData] = useState({});
  const [gameState, setGameState] = useState({ ...gameInit });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [pokerRooms, setPokerRooms] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [key, setKey] = useState("home");
  const history = useHistory();
  const [allUsers, setAllUsers] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [timeOptions] = useState([
    { value: 10, label: "10 seconds" },
    { value: 15, label: "15 seconds" },
    { value: 20, label: "20 seconds" },
    { value: 30, label: "30 seconds" },
    { value: 45, label: "45 seconds" },
    { value: 60, label: "60 seconds" },
  ]);
  const [eventKey, setEventKey] = useState("register");
  const [sitKey, setSitKey] = useState("s&gregister");

  const [showPlayerList, setShowPlayerList] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  // utils function
  const checkUserInGame = async () => {
    let userData = await axios({
      method: "get",
      url: `${CONSTANTS.landingServerUrl}/users/checkUserInGame`,
      headers: { authorization: `Bearer ${getCookie("token")}` },
      withCredentials: true,
      credentials: "include",
    });
    if (userData?.data) {
      setUserInAnyGame(userData.data);
    }
  };
  useEffect(() => {
    checkUserInGame();
  }, []);
  const handleShow = () => {
    setShow(!show);
    setGameState({ ...gameInit });
    setShowSpinner(false);
    setErrors({});
  };
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

  const getUser = async () => {
    let res = await userUtils.getAuthUserData();
    userId = res?.data?.user?.id;
    setUser(res?.data?.user);
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  };
  const handleChnageInviteUsers = (selectedOptions) => {
    setGameState({ ...gameState, invitedUsers: [...selectedOptions] });
  };

  const validateCreateTable = () => {
    let checkIfExist =
      pokerRooms?.length > 0 &&
      pokerRooms.find(
        (el) =>
          el?.gameName?.toLowerCase() ===
            gameState?.gameName?.trim()?.toLowerCase() &&
          el?.gameMode === cookie.get("mode")
      );

    let valid = true;
    let err = {};
    const mimimumBet = 0;
    if (gameState?.gameName === "") {
      err.gameName = "Game name is required.";
      valid = false;
    }
    if (gameState?.gameName.trim() === "") {
      err.gameName = "Game name is required.";
      valid = false;
    }
    console.log("mode and user data", userData, cookie.get("mode"));
    if (
      (!userData?.wallet && cookie.get("mode") === "token") ||
      (gameState?.minchips > userData?.wallet && cookie.get("mode") === "token")
    ) {
      err.minchips = "You don't have enough balance in your wallet.";
      valid = false;
    } else if (
      (!userData?.goldCoin && cookie.get("mode") === "goldCoin") ||
      (gameState?.minchips > userData?.goldCoin &&
        cookie.get("mode") === "goldCoin")
    ) {
      err.minchips = "You don't have enough gold coins in your wallet.";
      valid = false;
    } else if (gameState.minchips <= mimimumBet) {
      err.minchips =
        `Minimum bet can't be less then or equal to ` + mimimumBet + ".";
    } else if (gameState.minchips <= mimimumBet) {
      err.minchips =
        `Minimum bet can't be less then or equal to ` + mimimumBet + ".";
      valid = false;
    } else if (
      parseInt(gameState?.sitInAmount) < parseInt(gameState?.minchips)
    ) {
      err.minchips = "Small blind amount must be less than Sit In amount";
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

    if (
      parseFloat(gameState.sitInAmount) > userData?.wallet &&
      cookie.get("mode") === "token"
    ) {
      err.sitInAmount = `You don't have enough balance in your wallet.`;
      valid = false;
    }
    if (
      parseFloat(gameState.sitInAmount) > userData?.goldCoin &&
      cookie.get("mode") === "goldCoin"
    ) {
      err.sitInAmount = `You don't have enough gold coins in your wallet.`;
      valid = false;
    }

    //  else if (!gameState.maxchips) {
    //   err.maxchips = 'Please enter amount for big blind.';
    //   valid = false;
    // }
    else if (parseFloat(gameState.maxchips) < parseFloat(gameState.minchips)) {
      err.maxchips = "Big blind amount cant be less then small blind";
      valid = false;
    } else if (gameState.minchips <= 0) {
      err.maxchips = "Minimum bet cant be less then or equal to 0";
      valid = false;
    } else if (!gameState.public && !gameState.invitedUsers.length) {
      err.invitedPlayer = "Please invite some player if table is private.";
      valid = false;
    }

    if (checkIfExist) {
      err.gameName = "Game name is already exist.";
      valid = false;
    }

    if (gameState.actionTime === "") {
      err.actionTime = "Please select an action time.";
      valid = false;
    }

    return { valid, err };
  };

  const createTable = async (e) => {
    e.preventDefault();
    setErrors({});
    setShowSpinner(true);
    if (showSpinner) {
      return false;
    }

    const tableValidation = validateCreateTable();
    if (!tableValidation.valid) {
      setErrors({ ...tableValidation.err });
      setShowSpinner(false);
      return;
    }
    try {
      const resp = await pokerInstance().post("/createTable", {
        ...gameState,
        sitInAmount: parseInt(gameState.sitInAmount),
        gameMode: cookie.get("mode"),
      });
      setGameState({ ...gameInit });
      history.push({
        pathname: "/table",
        search: "?gamecollection=poker&tableid=" + resp.data.roomData._id,
      });

      setShowSpinner(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message, { id: "create-table-error" });
      }
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await pokerInstance().get("/getAllUsers");
      setAllUsers(response.data.allUsers || []);
    })();
  }, []);

  useEffect(() => {
    socket.on("updatePlayerList", (data) => {
      setTournaments(data);
    });
    socket.on("tournamentUpdate", (data) => {
      const { updateTournament } = data;
      if (updateTournament) {
        getTournamentDetails();
      }
    });

    socket.on("allTournaments", (data) => {
      setTournaments(data?.tournaments);
    });

    socket.on("tournamentCreated", (data) => {
      setTournaments(data.tournaments);
    });

    socket.on("NoTournamentFound", (data) => {
      toast.error("No tournament found", { id: "no-tournament" });
    });
    socket.on("AllTables", (data) => {
      setPokerRooms(data?.tables || []);
    });
  }, []);

  const checkAuth = async () => {
    const data = await userUtils.getAuthUserData();
    if (!data.success) {
      return (window.location.href = `${landingClient}`);
    }
    setLoader(false);
    setUserData({ ...data?.data?.user });
  };
  // UseEffects
  useEffect(() => {
    checkAuth();
    getUser();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await pokerInstance().get("/rooms");
        setPokerRooms(response.data.rooms || []);
      } catch (error) {}
    })();
  }, []);

  const getTournamentDetails = async () => {
    try {
      setTLoader(true);
      const response = await tournamentInstance().get("/tournaments");
      const { status } = response;
      if (status === 200) {
        const { tournaments } = response.data;
        setTournaments(tournaments || []);
      }
      setTLoader(false);
    } catch (error) {
      setTLoader(false);
    }
  };

  const handleActionTime = (selectedOption) => {
    console.log("selectedOption ===>", selectedOption);
    setGameState({ ...gameState, actionTime: selectedOption.value });
  };

  useEffect(() => {
    getTournamentDetails();
  }, []);

  socket.on("tournamentStart", (data) => {
    getTournamentDetails();

    // setTimeout(() => {
    //   getTournamentDetails()
    // }, 1000)
  });

  const options = useMemo(
    () =>
      allUsers.map((el) => {
        return { value: el.id, label: el.username };
      }),
    [allUsers]
  );

  useEffect(() => {
    socket.on("redirectToTableAsWatcher", async (data) => {
      console.log("redirectToTableAsWatcher ==>", data);
      try {
        if (data?.userId === userId) {
          console.log("hellow", data, window);
          if (window) {
            console.log("redirectToTableAsWatcher111 ==>", data, window);
            window.location.href =
              window.location.origin +
              "/table?gamecollection=poker&tableid=" +
              data?.gameId;
            console.log("helloo i am here");
          }
          // history.push("/table?gamecollection=poker&tableid=" + data?.gameId);
        }
      } catch (err) {
        console.log("errror in redirection ==>", err);
      }
    });
  }, []);

  console.log("cookie?", cookie?.get("mode"));

  const filterRoom =
    pokerRooms &&
    pokerRooms?.length > 0 &&
    pokerRooms?.filter(
      (el) =>
        el?.gameName &&
        el?.gameName?.toLowerCase()?.includes(searchText?.toLowerCase()) &&
        el?.gameMode === mode
    );

  const filterTournaments =
    tournaments &&
    tournaments?.length > 0 &&
    tournaments?.filter(
      (el) =>
        el?.name && el?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
    );

  const [openCardHeight, setOpenCardHeight] = useState(150);
  const pokerCard = useRef(null);
  useEffect(() => {
    if (pokerCard?.current?.clientHeight) {
      setOpenCardHeight(pokerCard.current.clientHeight);
    }
  }, [pokerCard, filterRoom]);

  const handleTabSwitch = (k) => {
    setEventKey(k);
  };
  const handleSitTabSwitch = (k) => {
    setSitKey(k);
  };

  return (
    <div className="poker-home">
      {userInAnyGame?.inGame && (
        <AlreadyInGamePopup
          userInAnyGame={userInAnyGame}
          setUserInAnyGame={setUserInAnyGame}
        />
      )}
      {loader && (
        <div className="poker-loader">
          <img src={loaderImg} alt="loader" />
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
        showSpinner={showSpinner}
        timeOptions={timeOptions}
        handleActionTime={handleActionTime}
      />
      <Header
        userData={userData}
        handleShow={handleShow}
        mode={mode}
        setMode={setMode}
        setUserData={setUserData}
      />
      <div className="home-poker-card">
        <div className="container">
          <div className="poker-table-header">
            <div className="backtoHome">
              <a href={landingClient}>
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
              </div>
            </div>
          </div>

          <div className="poker-table-content ">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3 first-tab-content"
            >
              <Tab eventKey="home" title="Ring games">
                {filterRoom.length > 0 ? (
                  <>
                    <div className="home-poker-card-grid">
                      {filterRoom.map((el) => (
                        <React.Fragment key={el._id}>
                          {el.public && (
                            <GameTable
                              data={el}
                              gameType="Poker"
                              height={openCardHeight}
                              setUserData={setUserData}
                              tableId={el._id}
                            />
                          )}
                          {!el.public &&
                            el?.invPlayers?.find(
                              (pl) =>
                                pl?.toString() === userId ||
                                pl?.toString() === user?.id
                            ) &&
                            el?.hostId?.toString !== user?.id?.toString() && (
                              <GameTable
                                data={el}
                                gameType="Poker"
                                height={openCardHeight}
                                setUserData={setUserData}
                                tableId={el._id}
                              />
                            )}
                          {!el.public &&
                            (el?.hostId?.toString === user?.id?.toString() ||
                              el?.hostId?.toString() ===
                                userId?.toString()) && (
                              <GameTable
                                data={el}
                                gameType="Poker"
                                height={openCardHeight}
                                setUserData={setUserData}
                                tableId={el._id}
                              />
                            )}
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                    <div className="no-room-available">
                      <h4>No Room Available</h4>

                      {/* <button type="button" onClick={handleShow}>
                        Create Game
                      </button> */}
                    </div>
                  </div>
                )}
              </Tab>
              <Tab eventKey="sit&go" title="Sit & Go">
                {tLoader ? (
                  <div className="tab-loader-grid">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <>
                    {filterTournaments.length > 0 ? (
                      <div className="home-poker-card">
                        <div className="container">
                          <Tabs
                            activeKey={sitKey}
                            onSelect={(k) => handleSitTabSwitch(k)}
                            id="uncontrolled-tab-example"
                          >
                            <Tab eventKey="s&gregister" title="Register">
                              <div className="home-poker-card-grid">
                                {filterTournaments.length > 0 &&
                                  filterTournaments
                                    .filter(
                                      (el) =>
                                        el?.isStart === false &&
                                        el?.isFinished === false &&
                                        el?.tournamentType === key
                                    )
                                    .map((el) => (
                                      <React.Fragment key={el._id}>
                                        {/* {console.log("elll", el)} */}
                                        <GameTournament
                                          data={el}
                                          gameType="Tournament"
                                          getTournamentDetails={
                                            getTournamentDetails
                                          }
                                          setUserData={setUserData}
                                          filterTournaments={filterTournaments}
                                          userId={user?.id || userId}
                                          setShowPlayerList={setShowPlayerList}
                                          setSelectedTournament={
                                            setSelectedTournament
                                          }
                                        />
                                      </React.Fragment>
                                    ))}
                                {filterTournaments.length > 0 &&
                                  filterTournaments.filter(
                                    (el) =>
                                      el?.isStart === false &&
                                      el?.isFinished === false &&
                                      el?.tournamentType === key
                                  ).length === 0 && (
                                    <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                                      <div className="no-room-available">
                                        <h4>No Tournament Available</h4>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </Tab>
                            <Tab eventKey="s&grunning" title="Running">
                              <div className="home-poker-card-grid">
                                {filterTournaments.length > 0 &&
                                  filterTournaments
                                    .filter(
                                      (el) =>
                                        el?.isStart === true &&
                                        el?.tournamentType === key
                                    )
                                    .map((el) => (
                                      <React.Fragment key={el._id}>
                                        <GameTournament
                                          data={el}
                                          gameType="Tournament"
                                          getTournamentDetails={
                                            getTournamentDetails
                                          }
                                          setUserData={setUserData}
                                          filterTournaments={filterTournaments}
                                          userId={user?.id || userId}
                                          setShowPlayerList={setShowPlayerList}
                                          setSelectedTournament={
                                            setSelectedTournament
                                          }
                                        />
                                      </React.Fragment>
                                    ))}
                                {filterTournaments.length > 0 &&
                                  filterTournaments.filter(
                                    (el) =>
                                      el?.isStart === true &&
                                      el?.tournamentType === key
                                  ).length === 0 && (
                                    <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                                      <div className="no-room-available">
                                        <h4>No Tournament Available</h4>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </Tab>
                            <Tab eventKey="s&gfinsih" title="Completed">
                              <div className="home-poker-card-grid">
                                {filterTournaments.length > 0 &&
                                  filterTournaments
                                    .filter(
                                      (el) =>
                                        el.isFinished === true &&
                                        el?.tournamentType === key
                                    )
                                    .map((el) => (
                                      <React.Fragment key={el._id}>
                                        <GameTournament
                                          data={el}
                                          gameType="Tournament"
                                          getTournamentDetails={
                                            getTournamentDetails
                                          }
                                          setUserData={setUserData}
                                          filterTournaments={filterTournaments}
                                          userId={user?.id || userId}
                                          setShowPlayerList={setShowPlayerList}
                                          setSelectedTournament={
                                            setSelectedTournament
                                          }
                                        />
                                      </React.Fragment>
                                    ))}
                                {filterTournaments.length > 0 &&
                                  filterTournaments.filter(
                                    (el) =>
                                      el?.isFinished === true &&
                                      el?.tournamentType === key
                                  ).length === 0 && (
                                    <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                                      <div className="no-room-available">
                                        <h4>No Tournament Available</h4>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </Tab>
                          </Tabs>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                        <div className="no-room-available">
                          <h4>No Tournament Available</h4>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Tab>
              <Tab eventKey="Multi-Table" title="Multi Table Tournament">
                {tLoader ? (
                  <div className="tab-loader-grid">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <>
                    {filterTournaments.length > 0 ? (
                      <div className="home-poker-card">
                        <div className="container">
                          <Tabs
                            activeKey={eventKey}
                            onSelect={(k) => handleTabSwitch(k)}
                            id="uncontrolled-tab-example"
                          >
                            <Tab eventKey="register" title="Register">
                              <div className="home-poker-card-grid">
                                {filterTournaments.length > 0 &&
                                  filterTournaments
                                    .filter(
                                      (el) =>
                                        // el?.isStart === false &&
                                        !el.joinTimeExceeded &&
                                        el?.isFinished === false &&
                                        el?.tournamentType === key
                                    )
                                    .map((el) => (
                                      <React.Fragment key={el._id}>
                                        {/* {console.log("elll", el)} */}
                                        <GameTournament
                                          data={el}
                                          gameType="Tournament"
                                          getTournamentDetails={
                                            getTournamentDetails
                                          }
                                          setUserData={setUserData}
                                          filterTournaments={filterTournaments}
                                          userId={user?.id || userId}
                                          setShowPlayerList={setShowPlayerList}
                                          setSelectedTournament={
                                            setSelectedTournament
                                          }
                                        />
                                      </React.Fragment>
                                    ))}
                                {filterTournaments.length > 0 &&
                                  filterTournaments.filter(
                                    (el) =>
                                      !el.joinTimeExceeded &&
                                      el?.isFinished === false &&
                                      el?.tournamentType === key
                                  ).length === 0 && (
                                    <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                                      <div className="no-room-available">
                                        <h4>No Tournament Available</h4>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </Tab>
                            <Tab eventKey="running" title="Running">
                              <div className="home-poker-card-grid">
                                {filterTournaments.length > 0 &&
                                  filterTournaments
                                    .filter(
                                      (el) =>
                                        el?.isStart === true &&
                                        el.joinTimeExceeded &&
                                        el?.tournamentType === key
                                    )
                                    .map((el) => (
                                      <React.Fragment key={el._id}>
                                        <GameTournament
                                          data={el}
                                          gameType="Tournament"
                                          getTournamentDetails={
                                            getTournamentDetails
                                          }
                                          setUserData={setUserData}
                                          filterTournaments={filterTournaments}
                                          userId={user?.id || userId}
                                          setShowPlayerList={setShowPlayerList}
                                          setSelectedTournament={
                                            setSelectedTournament
                                          }
                                        />
                                      </React.Fragment>
                                    ))}
                                {filterTournaments.length > 0 &&
                                  filterTournaments.filter(
                                    (el) =>
                                      el?.isStart === true &&
                                      el.joinTimeExceeded &&
                                      el?.tournamentType === key
                                  ).length === 0 && (
                                    <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                                      <div className="no-room-available">
                                        <h4>No Tournament Available</h4>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </Tab>
                            <Tab eventKey="finsih" title="Completed">
                              <div className="home-poker-card-grid">
                                {filterTournaments.length > 0 &&
                                  filterTournaments
                                    .filter(
                                      (el) =>
                                        el.isFinished === true &&
                                        el?.tournamentType === key
                                    )
                                    .map((el) => (
                                      <React.Fragment key={el._id}>
                                        <GameTournament
                                          data={el}
                                          gameType="Tournament"
                                          getTournamentDetails={
                                            getTournamentDetails
                                          }
                                          setUserData={setUserData}
                                          filterTournaments={filterTournaments}
                                          userId={user?.id || userId}
                                          setShowPlayerList={setShowPlayerList}
                                          setSelectedTournament={
                                            setSelectedTournament
                                          }
                                        />
                                      </React.Fragment>
                                    ))}
                                {filterTournaments.length > 0 &&
                                  filterTournaments.filter(
                                    (el) =>
                                      el?.isFinished === true &&
                                      el?.tournamentType === key
                                  ).length === 0 && (
                                    <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                                      <div className="no-room-available">
                                        <h4>No Tournament Available</h4>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </Tab>
                          </Tabs>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                        <div className="no-room-available">
                          <h4>No Tournament Available</h4>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Tab>
            </Tabs>
            <PlayerList
              show={showPlayerList}
              setShowPlayerList={setShowPlayerList}
              tournament={selectedTournament}
              setSelectedTournament={setSelectedTournament}
            />
          </div>
        </div>
      </div>
    </div>
  );
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
    color: "#858585c7",
  }),
  svg: (provided) => ({
    ...provided,
    fill: "#858585c7 !important",
    ":hover": {
      fill: "#858585c7 !important",
    },
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
  showSpinner,
  handleChnageInviteUsers,
  handleActionTime,
  timeOptions,
}) => {
  return (
    <Modal show={show} onHide={handleShow} centered className="casino-popup">
      <Modal.Header closeButton>
        <Modal.Title className="text-dark">Create Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="form-group" controlId="formPlaintextPassword">
          <Form.Label>Enter Game name</Form.Label>
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
            {" "}
            <div className="blindFields-box">
              <div>
                {" "}
                <Form.Label>Small Blind</Form.Label>
                <Form.Control
                  name="minchips"
                  onChange={handleChange}
                  value={values.minchips}
                  type="number"
                  placeholder="Ex : 50"
                />
              </div>
              <div>
                {" "}
                <Form.Label>Big Blind</Form.Label>
                <Form.Control
                  name="maxchips"
                  onChange={handleChange}
                  value={values.minchips * 2}
                  type="number"
                  placeholder="Ex : 1000"
                  disabled
                />
              </div>
              {/* {!!errors?.maxchips && (
              <p className='text-danger'>{errors?.maxchips}</p>
            )} */}
            </div>
            {!!errors?.minchips && (
              <p className="text-danger">{errors?.minchips}</p>
            )}
          </div>
        </Form.Group>
        <div className="searchSelectDropdown">
          <Form.Label>Action time</Form.Label>
          <Select
            onChange={handleActionTime}
            options={timeOptions}
            styles={customStyles}
          />
          {!!errors?.actionTime && (
            <p className="text-danger">{errors?.actionTime}</p>
          )}
        </div>
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
        <Button variant="primary" type="submit" onClick={createTable}>
          {showSpinner ? <Spinner animation="border" /> : "Create Table"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GameTable = ({
  data,
  gameType,
  getTournamentDetails,
  height,
  setUserData,
  tableId,
}) => {
  const history = useHistory();
  const redirectToTable = () => {
    socket.emit("checkAlreadyInGame", {
      userId,
      tableId,
      gameMode: cookie.get("mode"),
    });
    socket.on("userAlreadyInGame", (value) => {
      const { message, join } = value;
      if (join) {
        history.push({
          pathname: "/table",
          search: "?gamecollection=poker&tableid=" + data?._id,
        });
      } else {
        toast.error(message, { id: "create-table-error" });
      }
    });
  };

  useEffect(() => {
    socket.on("alreadyInTournament", (data) => {
      const { message, code } = data;
      if (code === 200) {
        if (data?.user && Object.keys(data?.user)?.length > 0) {
          setUserData(data?.user);
        }

        toast.success(message, { id: "Nofull" });
      } else {
        toast.error(message, { id: "full" });
      }
    });
    socket.on("notEnoughAmount", (data) => {
      const { message, code } = data;
      if (code === 200) {
        toast.success(message, { id: "Nofull" });
      } else {
        toast.error(message, { id: "full" });
      }
    });

    socket.on("tournamentAlreadyFinished", (data) => {
      toast.error("Tournament has been finished.", {
        id: "tournament-finished",
      });
    });

    socket.on("tournamentAlreadyStarted", (data) => {
      toast.error(data.message, { id: "tournamentStarted" });
    });
  }, []);

  const joinTournament = async (tournamentId, fees) => {
    socket.emit("joinTournament", {
      tournamentId: tournamentId,
      userId: userId,
      fees,
    });
    setTimeout(() => {
      getTournamentDetails();
    }, 1000);
  };

  const enterRoom = async (tournamentId) => {
    const res = await tournamentInstance().post("/enterroom", {
      tournamentId: tournamentId,
    });
    if (res.data.code === 200) {
      let roomid = res.data.roomId;
      history.push({
        pathname: "/table",
        search: "?gamecollection=poker&tableid=" + roomid,
      });
    } else {
      // toast.error(toast.success(res.data.msg, { containerId: 'B' }))
    }
  };

  const getTime = (time) => {
    let d = new Date(time);
    let pm = d.getHours() >= 12;
    let hour12 = d.getHours() % 12;
    if (!hour12) hour12 += 12;
    let minute = d.getMinutes();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    return `${date}/${month}/${year} ${hour12}:${minute} ${pm ? "pm" : "am"}`;
  };

  const [cardFlip, setCardFlip] = useState(false);
  const [dateState, setDateState] = useState();
  const handleFlip = (tDate) => {
    setCardFlip(!cardFlip);
    countDownData(tDate);
  };
  const countDownData = (tDate) => {
    var x = setInterval(() => {
      let countDownDate = new Date(tDate).getTime();
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setDateState({
        days,
        hours,
        minutes,
        seconds,
      });
      if (distance < 0) {
        clearInterval(x);
        setDateState({
          days: "0",
          hours: "0",
          minutes: "0",
          seconds: "0",
        });
      }
    }, 1000);
  };

  const wrapperRef = useRef();

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setCardFlip(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideAlerter(wrapperRef);

  const ifUserJoind = () => {
    let getData = data?.rooms?.find((el) =>
      el?.players?.find((el) => el?.userid === userId)
    );
    return getData;
  };
  return (
    <>
      <div className="tournamentCard" ref={wrapperRef}>
        <FaInfoCircle
          className="leaderboardBtn"
          onClick={() => handleFlip(data.tournamentDate)}
        />
        <div
          className={`tournamentCard-inner
         ${cardFlip && gameType === "Poker" ? "rotate" : ""}
         `}
        >
          {!cardFlip && gameType === "Poker" ? (
            <div className="tournamentCard-front">
              <img src={casino} alt="" />
              <div className="tournamentFront-info">
                <h4>{gameType === "Poker" ? data?.gameName : data.name}</h4>
                {gameType === "Poker" ? (
                  <button onClick={redirectToTable} type="submit">
                    Join Game
                  </button>
                ) : (
                  <div className="btn-grid">
                    {" "}
                    {!data?.isFinished ? (
                      <button
                        disabled={ifUserJoind()}
                        onClick={() =>
                          joinTournament(data?._id, data?.tournamentFee)
                        }
                        type="submit"
                      >
                        Join Game
                      </button>
                    ) : null}
                    {ifUserJoind() && !data?.isFinished ? (
                      <button
                        onClick={() => enterRoom(data?._id)}
                        type="submit"
                      >
                        Enter Game
                      </button>
                    ) : null}
                    {data?.isFinished && (
                      <div className="tournamentRanking">
                        <h6>Tournament Finished</h6>
                        <Button>Check Ranking</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="tournamentCard-back" style={{ height: height }}>
              {gameType === "Poker" ? (
                <AvatarGroup imgArr={data?.players} />
              ) : (
                ""
              )}
              <h4>
                people joined :{" "}
                <span>
                  {(gameType === "Tournament"
                    ? data?.rooms?.filter((el) => el?.players)[0]?.players
                        ?.length || 0
                    : data?.players?.length) || 0}
                </span>
              </h4>
              <h4>
                SB/BB :{" "}
                <span>
                  {data?.smallBlind}
                  {"/"}
                  {data?.bigBlind}
                </span>
              </h4>
              {gameType === "Tournament" ? (
                <h4>
                  Fee : <span>{data?.tournamentFee}</span>
                </h4>
              ) : (
                ""
              )}
              {gameType === "Tournament" ? (
                <h4>
                  Date : <span>{getTime(data?.tournamentDate)}</span>
                </h4>
              ) : (
                ""
              )}
              {gameType === "Tournament" ? (
                <>
                  <div id="clockdiv">
                    <h4>
                      Days
                      <span class="days">{dateState?.days || "0"}</span>
                    </h4>
                    <h4>
                      Hours
                      <span class="hours">{dateState?.hours || "0"}</span>
                    </h4>
                  </div>
                  <div id="clockdiv">
                    <h4>
                      Minutes
                      <span class="minutes">{dateState?.minutes || "0"}</span>
                    </h4>
                    <h4>
                      Seconds
                      <span class="seconds">{dateState?.seconds || "0"}</span>
                    </h4>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const GameTournament = ({
  data,
  gameType,
  getTournamentDetails,
  height,
  setUserData,
  userId,
  setShowPlayerList,
  setSelectedTournament,
}) => {
  const history = useHistory();
  let tableId;
  let [buttonClick, setButtonClick] = useState(false);
  
  console.log("game tournament executed");

  const [lateJoiningTimimng, setLateJoiningAtiming] = useState("00:00");

  useEffect(()=>{
    const lateJoiningTime = new Date(data.tournamentStartTime);
    lateJoiningTime.setMinutes(lateJoiningTime.getMinutes() + data.joinTime);

    let lateJoiningInterVal;

    if(data.isStart){
      if(lateJoiningInterVal){
        clearInterval(lateJoiningInterVal);
      }
      lateJoiningInterVal = setInterval(()=>{
        const date1 = new Date();
        const date2 = new Date(lateJoiningTime);

        if(date2 > date1){
          
          const timeDifferenceMs = date2 - date1;

          let minutes = Math.floor(timeDifferenceMs / (1000 * 60));
          let seconds = Math.floor((timeDifferenceMs % (1000 * 60)) / 1000);
          minutes = minutes < 9 ? "0"+minutes : minutes;
          seconds = seconds < 9 ? "0"+seconds : seconds;

          setLateJoiningAtiming(`${minutes}:${seconds}`);

        }else{
          console.log(`time running clear interval`);
          clearInterval(lateJoiningInterVal);
        }
      }, 1000);
    }
  }, [data.isStart]);

  data &&
    data?.rooms?.length > 0 &&
    data?.rooms?.filter((el) => {
      if (el.players.find((p) => p?.userid === userId)) {
        tableId = el?._id;
      }
      return tableId;
    });
  useEffect(() => {
    socket.on("alreadyInTournament", (data) => {
      const { message, code } = data;
      if (code === 200) {
        if (data?.user && Object.keys(data?.user)?.length > 0) {
          setUserData(data?.user);
        }

        toast.success(message, { id: "Nofull" });
      } else {
        toast.error(message, { id: "full" });
      }
    });

    socket.on("leaveTournament", (data) => {
      const { message, code } = data;
      if (code === 200) {
        if (
          data?.user &&
          Object.keys(data?.user)?.length > 0 &&
          data.user.id === userId
        ) {
          setUserData(data?.user);
          toast.success(message, { id: "Nofull" });
        }
      }
    });
    socket.on("notEnoughAmount", (data) => {
      const { message, code } = data;
      if (code === 200) {
        toast.success(message, { id: "Nofull" });
      } else {
        toast.error(message, { id: "full" });
      }
    });

    socket.on("tournamentSlotFull", (data) => {
      toast.error("Tournament slot is full", { id: "slot-full" });
    });
  }, []);

  const joinTournament = async (tournamentId, fees) => {
    console.log("tournamentId, fees", tournamentId, fees);
    setButtonClick(true);
    socket.emit("joinTournament", {
      tournamentId: tournamentId,
      userId: userId,
      fees,
    });
    setTimeout(() => {
      getTournamentDetails();
      setButtonClick(false);
    }, 1000);
  };

  const enterRoom = async (tournamentId) => {
    buttonClick = true;
    const res = await tournamentInstance().post("/enterroom", {
      tournamentId: tournamentId,
    });
    if (res.data.code === 200) {
      let roomid = res.data.roomId;
      window.location.href =
        window.location.origin +
        "/table?gamecollection=poker&tableid=" +
        roomid;
      // history.push({
      //   pathname: '/table',
      //   search: '?gamecollection=poker&tableid=' + roomid,
      // })
    } else {
      buttonClick = false;
      // toast.error(toast.success(res.data.msg, { containerId: 'B' }))
    }
  };
  const handleFlip = (tournamentId) => {
    history.push(`/leaderboard?tournamentId=${tournamentId}`);
  };
  const ifUserJoind = () => {
    let getData = data?.rooms?.find((el) =>
      el?.players?.find((el) => el?.userid === userId)
    );
    // console.log("getData ===>", getData);

    return getData;
  };
  // var startDateTime = new Date(data?.tournamentDate).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
  const cancelTournament = async () => {
    setButtonClick(true);
    socket.emit("doleavetable", {
      tableId,
      userId,
      gameType: gameType,
      isWatcher: false,
      action: "Leave",
    });
    setTimeout(() => {
      getTournamentDetails();
      setButtonClick(false);
    }, 1000);
  };
  useEffect(() => {
    socket.on("sitInOut", (data) => {
      console.log("sitout runs from home ==>", data);
      if (data?.updatedRoom?.gameType === "poker-tournament") {
        setTimeout(async () => {
          await getTournamentDetails();
        }, 500);
      }
    });
  }, []);

  const openSpectatingTables = (tournamentId) => {
    if (tournamentId) {
      window.location.href = "/spectate?tournamentId=" + tournamentId;
    }
  };

  const handleShowParticipants = () => {
    console.log("handle show aprticipants executed");
    setShowPlayerList(true);
    setSelectedTournament(data);
  };

  // const joinTimeExceeded = (tourData) => {
  //   const startTime = new Date(tourData?.startDate+" "+tourData?.statrTime)
  // }

  return (
    <>
      <div className="pokerTournament-tableCard">
        <div className="tableCard-imgDetail">
          <img src={casino1} className="tournamentImg" alt="" />
          <div className="tournamentCard-nameDetail">
            {data?.tournamentType !== "sit&go" ? (
              <h6>
                {dateFormat(data.startDate)}, Start at{" "}
                {timeFormat(data.tournamentDate)}
              </h6>
            ) : null}

            <h2 title={data?.name}>{data?.name}</h2>
            {data?.isStart ? (
              <p className="tournamentRunning">Tournament Running ...</p>
            ) : data?.isFinished ? (
              <p className="tournamentFinished">Tournament Finished</p>
            ) : (
              <p>Not started</p>
            )}
            {data?.tournamentType === "sit&go" ? (
              <p className="tournamentRunning">Sit & Go</p>
            ) : (
              <p className="tournamentRunning">Multi-Table Tournament</p>
            )}
          </div>
        </div>
        <div className="tournamentCard-extraDetail">
          <div className="cardTournament-Fee">
            <p>Entry Fee</p>
            <div className="extraDetail-container">
              <FaCoins />
              {data?.tournamentFee}
            </div>
          </div>
          <div
            className="cardTournament-Fee participants"
            onClick={handleShowParticipants}
          >
            <p>Participants</p>
            <div className="extraDetail-container">
              <FaUser />
              {data?.totalJoinPlayer}
            </div>
          </div>
          <div className="cardTournament-Fee">
            <p>Prize Pool</p>
            <div className="extraDetail-container">
              <FaTrophy />
              {data?.tournamentFee &&
                data?.havePlayers &&
                (
                  parseFloat(data?.tournamentFee) *
                  parseFloat(data?.totalJoinPlayer)
                ).toFixed(2)}
            </div>
          </div>
        </div>
        {/* {lateJoiningTimimng !== "00:00" ? lateJoiningTimimng : null} */}
        <div className="tournamentCard-buttonDetail">
          {/* {console.log("eleminated players ===>", data?.eleminatedPlayers)} */}
          {data?.isFinished ? (
            <Button type="text" disabled="true">
              Game Finished
            </Button>
          ) : ifUserJoind() ? (
            <div className="buttonDetail-twobtns">
              <Button
                type="text"
                disabled={buttonClick}
                onClick={() => enterRoom(data?._id)}
              >
                Enter Game
              </Button>
              {!data?.isStart ? (
                <Button
                  type="button"
                  disabled={buttonClick}
                  onClick={() => cancelTournament()}
                >
                  Leave
                </Button>
              ) : null}
            </div>
          ) : data?.tournamentType === "sit&go" ? (
            <Button
              type="text"
              disabled={buttonClick}
              onClick={() => joinTournament(data?._id, data?.tournamentFee)}
            >
              {buttonClick ? (
                <Spinner animation="border" />
              ) : data.isStart ? (
                "Spectate"
              ) : (
                "Join Game"
              )}
            </Button>
          ) : data?.tournamentType !== "sit&go" &&
            !data.joinTimeExceeded &&
            !data?.eleminatedPlayers?.find(
              (el) => el.userid?.toString() === userId?.toString()
            ) ? (
            <><Button
              type="text"
              disabled={buttonClick}
              onClick={() => joinTournament(data?._id, data?.tournamentFee)}
            >
              {buttonClick ? <Spinner animation="border" /> :  data.isStart ? `Late Join ${lateJoiningTimimng}` : `Join Game`}
            </Button>
            { data.isStart ? <Button
              type="text"
              onClick={() => {
                openSpectatingTables(data?._id);
              }}
            >
              Spectate
            </Button> : null}
            </>
          ) : (
            <Button
              type="text"
              onClick={() => {
                openSpectatingTables(data?._id);
              }}
            >
              Spectate
            </Button>
          )}
          {/*  && !data?.eleminatedPlayers?.find(el => (el.userid === userId)) */}
          <img
            src={ranking}
            alt=""
            onClick={() => {
              handleFlip(data._id);
            }}
          />
        </div>
      </div>
    </>
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
      {/* <p>{imgArr?.length || 0} people</p> */}
    </div>
  );
};

// const TournamentGroup = ({players}) => {
//   return (
//     <div className="poker-avatar-box">
//       <p>{players || 0} people joined</p>
//     </div>
//   );
// };

export default Home;
