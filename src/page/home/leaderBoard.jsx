/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Table from 'react-bootstrap/Table'
import { landingClient } from '../../config/keys'
import { tournamentInstance } from '../../utils/axios.config'
import { getTime } from '../../utils/utils'
// import Header from './header'
import logo from "../../assets/game/logo.png";
import userUtils from '../../utils/user'
import { socket } from '../../config/socketConnection'
import { useHistory } from 'react-router-dom'
import { Button, Tab, Tabs } from 'react-bootstrap'
import Loader from '../../components/pageLoader/loader'
import { FaArrowLeft } from 'react-icons/fa'
// import ReactSelect from 'react-select'
// import { useMemo } from 'react'
// import ReactSelect from 'react-select'

let userId;

// const customStyles = {
//   option: (provided) => ({
//     ...provided,
//     background: "#1b1b1b",
//     color: "#ddd",
//     fontWeight: "400",
//     fontSize: "16px",
//     padding: "10px 20px",
//     lineHeight: "16px",
//     cursor: "pointer",
//     borderRadius: "4px",
//     borderBottom: "1px solid #141414",
//     ":hover": {
//       background: "#141414",
//       borderRadius: "4px",
//     },
//   }),
//   menu: (provided) => ({
//     ...provided,
//     background: "#1b1b1b",
//     borderRadius: "30px",
//     padding: "10px 20px",
//     border: "2px solid transparent",
//   }),
//   control: () => ({
//     background: "#1b1b1b",
//     border: "2px solid #1b1b1b",
//     borderRadius: "30px",
//     color: "#fff",
//     display: "flex",
//     alignItem: "center",
//     height: "41",
//     margin: "2px 0",
//     boxShadow: " 0 2px 10px #000000a5",
//     cursor: "pointer",
//     ":hover": {
//       background: "#1b1b1b",
//       // border: "2px solid #306CFE",
//     },
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: "#fff",
//     fontWeight: "400",
//     fontSize: "14px",
//     lineHeight: "16px",
//   }),
//   indicatorSeparator: (provided) => ({
//     ...provided,
//     display: "none",
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     fontWeight: "400",
//     fontSize: "14px",
//     lineHeight: "19px",
//     color: "#858585c7",
//   }),
//   input: (provided) => ({
//     ...provided,
//     // height: "38px",
//     color: "fff",
//   }),
//   valueContainer: (provided) => ({
//     ...provided,
//     padding: "2px 20px",
//   }),
//   indicatorsContainer: (provided) => ({
//     ...provided,
//     paddingRight: "20px",
//     color: "#858585c7",
//   }),
//   svg: (provided) => ({
//     ...provided,
//     fill: "#858585c7 !important",
//     ":hover": {
//       fill: "#858585c7 !important",
//     },
//   }),
// };

const LeaderBoard = () => {
  const history = useHistory();
  const url = new URLSearchParams(window.location.search)
  const [tournamentData, setTournamentData] = useState([])
  const [dateState, setDateState] = useState()
  //const [tournaments, setTournaments] = useState([]);
  const [prizeStructure, setPrizeStructure] = useState([]);
  // const [keys, setKeys] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  // const [keys, setPrize] = useState([]);

  const getTournamentById = async () => {
    try {
      setShowLoader(true);
      if (url.get('tournamentId')) {
        const res = await tournamentInstance().get(`/tournamentById`, {
          params: { tournamentId: url.get('tournamentId') },
        })
        const { tournament, payout } = res.data || {}
        if (tournament) {
          setTournamentData(tournament);
          setPrizeStructure(getPrizeStructure(tournament, payout));
        }
      }
      setShowLoader(false);
    } catch (err) {
      console.log("erroorr ===>", err);
      history.push('/')
      setShowLoader(false);
    }
  }

  const getPrizeStructure = (tournament, payout) => {
    const { prizeType, winPlayer, totalJoinPlayer, tournamentFee } = tournament;
    const prize = totalJoinPlayer * parseFloat(tournamentFee);
    if (prizeType === "Fixed") {
      let keys = Object.keys(winPlayer);
      let reqData = keys.map(key => {
        return {
          place: key,
          earnings: winPlayer[key].amount
        }
      })
      return reqData;
    } else {
      // let keys = Object.keys(payout?.amount);
      let reqData = payout?.amount.map(obj => {
        let key = Object.keys(obj)[0];
        return {
          place: parseFloat(key) + 1,
          earnings: prize * obj[key] / 100
        }
      })
      return reqData;
    }
  }

  // const getTournamentDetails = async () => {
  //   try {
  //     const response = await tournamentInstance().get("/tournaments");
  //     const { status } = response;
  //     if (status === 200) {
  //       const { tournaments } = response.data;
  //       setTournaments(tournaments || []);
  //     }
  //   } catch (error) { }
  // };

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

  const getUser = async () => {
    let user = await userUtils.getAuthUserData();
    userId = user?.data?.user?.id;
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  };
  useEffect(() => {
    getTournamentById()
    getUser()
    // getTournamentDetails();
  }, [])

  if (tournamentData && tournamentData?.tournamentDate) {
    var x = setInterval(() => {
      let countDownDate = new Date(tournamentData?.tournamentDate).getTime()
      var now = new Date().getTime()
      var distance = countDownDate - now
      var days = Math.floor(distance / (1000 * 60 * 60 * 24))
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)
      setDateState({
        days,
        hours,
        minutes,
        seconds,
      })
      if (distance < 0) {
        clearInterval(x)
        setDateState({
          days: '0',
          hours: '0',
          minutes: '0',
          seconds: '0',
        })
      }
    }, 1000)
  }

  const ifUserJoind = () => {
    let getData = tournamentData?.rooms?.find((el) =>
      el?.players?.find((el) => el?.userid === userId)
    );
    return getData;
  };

  const joinTournament = async (tournamentId, fees) => {
    socket.emit("joinTournament", {
      tournamentId: tournamentId,
      userId: userId,
      fees,
    });
    setTimeout(() => {
      getTournamentById();
    }, 1000);
  };

  const spectateTournament = (data) => {
    const { _id, tournamentType, tournamentFee } = data;
    if (tournamentType === 'sit&go') {
      joinTournament(_id, tournamentFee)
    } else {
      window.location.href = '/spectate?tournamentId=' + _id.toString();
    }
  }

  const backFromLeaderBoard = () => {
    window.location.href = '/';
  }

  useEffect(() => {
    socket.on("redirectToTableAsWatcher", async (data) => {
      console.log("redirectToTableAsWatcher ==>", data);
      try {
        if (data?.userId === userId) {
          console.log("hellow", data, window)
          if (window) {
            console.log("redirectToTableAsWatcher111 ==>", data, window);
            window.location.href = window.location.origin + "/table?gamecollection=poker&tableid=" + data?.gameId;
            console.log("helloo i am here");
          }
          // history.push("/table?gamecollection=poker&tableid=" + data?.gameId);
        }
      } catch (err) {
        console.log("errror in redirection ==>", err);
      }
    });
  }, [])

  // const options = useMemo(
  //   () =>
  //     tournaments?.map((el) => {
  //       return { value: el?.name, label: el?.name };
  //     }),
  //   [tournaments]
  // );

  return (
    <div className="leaderBoardPage">
      <div className="user-header">
        <div className="container">
          <div className="user-header-grid">
            <div className="casino-logo">
              <a href={landingClient}>
                <img src={logo} alt="" />
              </a>
            </div>
            {/* <div className="create-game-box">
                        <a href={`${landingClient}profile`}>
                            <div className="create-game-box-avtar">
                                <img
                                    src={
                                        userData?.profile ||
                                        "https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
                                    }
                                    alt=""
                                />
                                <h5>{userData?.username}</h5>
                            </div>
                        </a>
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
                    </div> */}
          </div>
        </div>
      </div>
      {showLoader ?
        <Loader />
        : <>
          <div className="container leaderBoardContainer">
            <Button className='back-btn' onClick={() => { backFromLeaderBoard() }}>
              <FaArrowLeft />
            </Button>
            <div className="leaderBoardHeader">

              <h1>LEADERBOARD</h1>

              {/* <div className="tournamentFilter">
            <ReactSelect
              // onChange={handleChnageInviteUsers}
              options={options}
              styles={customStyles}
            />
            <Button>GO</Button>
          </div> */}
              <br />
              <div className="tournamentDetails">
                <div className="tournamentContent">
                  <h4>
                    Tournament table name : <span>{tournamentData?.name}</span>
                  </h4>
                  <p>Starting Stack : <span>{tournamentData?.buyIn}</span></p>
                  <p>
                    Total Players :{' '}
                    <span>
                      {tournamentData?.totalJoinPlayer || 0}
                    </span>
                  </p>
                  <p>
                    Blind:{' '}
                    <span>
                      {tournamentData?.levels?.smallBlind?.amount}
                      {tournamentData?.levels?.smallBlind?.amount ? '/' : ''}
                      {tournamentData?.levels?.bigBlind?.amount}
                    </span>
                  </p>
                  {tournamentData?.tournamentType !== "sit&go" ? <p>
                    Date : <span>{getTime(tournamentData?.tournamentDate)}</span>
                  </p> : ""}

                </div>

                <div className="tournamentTime">
                  {tournamentData?.isFinished ? (
                    <h2 className='tournamentFinished'>Tournament Finished.</h2>
                  ) : tournamentData?.isStart ? (
                    <h2 className='tournamentRunning'>Tournament Is Running ...</h2>
                  ) : (
                    tournamentData?.tournamentType !== "sit&go" ? <><h2>Tournament Start Time </h2>
                      <div id="clockdiv">
                        <h4>Days / Time : <span>{dateState?.days || '00'}/{dateState?.hours || '00'}:{dateState?.minutes || '00'}:{dateState?.seconds || '00'}</span></h4>
                      </div>
                    </> : null
                  )}
                  {tournamentData?.isFinished ? "" : (
                    <div className="btn-grid">
                      {" "}

                      {ifUserJoind() && !tournamentData?.eleminatedPlayers?.find(el => (el.userid?.toString() === userId?.toString())) ? (
                        <button

                          onClick={() => enterRoom(tournamentData?._id)}
                          type="submit"
                        >
                          Enter Game
                        </button>
                      ) : (tournamentData?.tournamentType !== 'sit&go' && !tournamentData.joinTimeExceeded && !ifUserJoind() && !tournamentData?.eleminatedPlayers?.find(el => (el.userid.toString() === userId.toString()))) || (tournamentData?.tournamentType === 'sit&go' && !tournamentData?.isStart) ? (
                        <button
                          disabled={ifUserJoind() || tournamentData?.isStart || tournamentData?.isFinished}
                          onClick={() => joinTournament(tournamentData?._id, tournamentData?.tournamentFee)
                          }
                          type="submit"
                        >
                          Join Game
                        </button>
                      ) : (
                        <button
                          // disabled={ifUserJoind() || tournamentData?.isStart || tournamentData?.isFinished}
                          onClick={() => spectateTournament(tournamentData)}
                          type="submit"
                        >
                          Spectate
                        </button>
                      )}
                    </div>)}
                </div>
              </div>
            </div>
            <Tabs
              defaultActiveKey="home"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="home" title="Final Results">
                <Results tournamentData={tournamentData} />
              </Tab>
              {/* <Tab eventKey="profile" title="Structure">
                <Structure />
              </Tab> */}
              <Tab eventKey="contact" title="Prize Pool">
                <PrizePool prizeStructure={prizeStructure} />
              </Tab>
            </Tabs>

          </div>
        </>}

    </div >
  )
}

export default LeaderBoard

const Star = () => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.12 9.88005C21.0781 9.74719 20.9996 9.62884 20.8935 9.53862C20.7873 9.4484 20.6579 9.38997 20.52 9.37005L15.1 8.58005L12.67 3.67005C12.6008 3.55403 12.5027 3.45795 12.3853 3.39123C12.2678 3.32451 12.1351 3.28943 12 3.28943C11.8649 3.28943 11.7322 3.32451 11.6147 3.39123C11.4973 3.45795 11.3991 3.55403 11.33 3.67005L8.89999 8.58005L3.47999 9.37005C3.34211 9.38997 3.21266 9.4484 3.10652 9.53862C3.00038 9.62884 2.92186 9.74719 2.87999 9.88005C2.83529 10.0124 2.82846 10.1547 2.86027 10.2907C2.89207 10.4268 2.96124 10.5512 3.05999 10.6501L6.99999 14.4701L6.06999 19.8701C6.04642 20.0091 6.06199 20.1519 6.11497 20.2826C6.16796 20.4133 6.25625 20.5267 6.36999 20.6101C6.48391 20.6912 6.61825 20.7389 6.75785 20.7478C6.89746 20.7566 7.03675 20.7262 7.15999 20.6601L12 18.1101L16.85 20.6601C16.9573 20.7189 17.0776 20.7499 17.2 20.7501C17.3573 20.7482 17.5105 20.6995 17.64 20.6101C17.7537 20.5267 17.842 20.4133 17.895 20.2826C17.948 20.1519 17.9636 20.0091 17.94 19.8701L17 14.4701L20.93 10.6501C21.0305 10.5523 21.1015 10.4283 21.1351 10.2922C21.1687 10.1561 21.1634 10.0133 21.12 9.88005Z"
        fill="#000000"
      />
    </svg>
  )
}


const Results = ({ tournamentData }) => {

  const [allPlayers, setAllPlayers] = useState([]);
  useEffect(() => {
    if (tournamentData?.winPlayer) {
      let winPlayers = tournamentData.winPlayer;
      let allKeys = winPlayers ? Object.keys(winPlayers) : [];
      let players = [];
      allKeys.forEach(key => {
        if (winPlayers[key]?.userId) {
          winPlayers[key] = {
            ...winPlayers[key],
            amount: winPlayers[key].amount,
          }
          players.push(winPlayers[key]);
        } else {
          winPlayers[key]?.userIds?.forEach(user => {
            user = {
              ...user,
              amount: winPlayers[key]?.amount,
            }
            players.push(user);
          });
        }
      });
      setAllPlayers(players);
    }
  }, [tournamentData]);

  return (
    <div className='tournament-results'>
      <h4>Final Results</h4>
      <div className="leaderboard-table">
        {/* {data?.winPlayer?.first?.userId ?  */}
        <Table striped bordered variant="dark" responsive>
          <thead>
            <tr>
              <th>
                <p>Rank</p>
              </th>
              <th>
                <p>Player</p>
              </th>
              <th>
                <p>Tickets won</p>
              </th>
            </tr>
          </thead>

          {tournamentData.prizeType === 'Fixed' ? (<tbody>
            <tr className="firstRank">
              <td>
                <p>1</p>
                <Star />
              </td>
              <td>
                <div className="rankingUsers">
                  <img
                    src={
                      (tournamentData?.isFinished && tournamentData?.winPlayer?.first?.userId?.profile) ||
                      'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                    }
                    alt=""
                  />
                  <p>
                    {(tournamentData?.isFinished &&
                      tournamentData?.winPlayer?.first?.userId?.username) ||
                      'To be decided'}
                  </p>
                </div>
              </td>
              <td>
                <p>
                  {(tournamentData?.isFinished &&
                    tournamentData?.winPlayer?.first?.amount) ||
                    'To be decided'}
                </p>
              </td>
            </tr>
            <tr className="secondRank myRank">
              <td>
                <p>2</p>
                <Star />
              </td>

              <td>
                <div className="rankingUsers">
                  <img
                    src={
                      (tournamentData?.isFinished && tournamentData?.winPlayer?.second?.userId?.profile) ||
                      'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                    }
                    alt=""
                  />
                  <p>
                    {(tournamentData?.isFinished &&
                      tournamentData?.winPlayer?.second?.userId?.username) ||
                      'To be decided'}
                  </p>
                </div>
              </td>


              <td>
                <p>
                  {(tournamentData?.isFinished &&
                    tournamentData?.winPlayer?.second?.amount) ||
                    'To be decided'}
                </p>
              </td>
            </tr>
            <tr className="thirdRank">
              <td>
                <p>3</p>
                <Star />
              </td>
              <td>
                <div className="rankingUsers">
                  <img
                    src={
                      (tournamentData?.isFinished && tournamentData?.winPlayer?.third?.userId?.profile) ||
                      'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                    }
                    alt=""
                  />
                  <p>
                    {(tournamentData?.isFinished &&
                      tournamentData?.winPlayer?.third?.userId?.username) ||
                      'To be decided'}
                  </p>
                </div>

              </td>
              <td>
                <p>
                  {(tournamentData?.isFinished &&
                    tournamentData?.winPlayer?.third?.amount) ||
                    'To be decided'}
                </p>
              </td>
            </tr>

            {tournamentData?.winPlayer?.['4-10']?.userIds?.length > 0 &&
              tournamentData?.winPlayer?.['4-10']?.userIds?.map((fourP, i) => (
                <tr>
                  <td>
                    <p>{4 + i}</p>
                  </td>
                  <td>
                    <div className="rankingUsers">
                      <img
                        src={
                          (tournamentData?.isFinished && fourP?.profile) ||
                          'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                        }
                        alt=""
                      />
                      <p>
                        {(tournamentData?.isFinished && fourP?.username) ||
                          'To be decided'}
                      </p>
                    </div>

                  </td>
                  <td>
                    <p>
                      {(tournamentData?.isFinished &&
                        tournamentData?.winPlayer?.['4-10']?.amount) ||
                        'To be decided'}
                    </p>
                  </td>
                </tr>
              ))}
            {tournamentData?.winPlayer?.['11-25']?.userIds?.length > 0 &&
              tournamentData?.winPlayer?.['4-10']?.userIds?.map(
                (elevenP, i) => (
                  <tr>
                    <td>
                      <p>{11 + i}</p>
                    </td>
                    <td>
                      <div className="rankingUsers">
                        <img
                          src={
                            (tournamentData?.isFinished && elevenP?.profile) ||
                            'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                          }
                          alt=""
                        />
                        <p>
                          {(tournamentData?.isFinished && elevenP?.username) ||
                            'To be decided'}
                        </p>
                      </div>

                    </td>
                    <td>

                      <p>
                        {(tournamentData?.isFinished &&
                          tournamentData?.winPlayer?.['11-25']?.amount) ||
                          'To be decided'}
                      </p>
                    </td>
                  </tr>
                ),
              )}
          </tbody>) : (
            <tbody>
              {!tournamentData?.isFinished ? (
                <>
                  <tr className="firstRank">
                    <td>
                      <p>1</p>
                      <Star />
                    </td>
                    <td>
                      <div className="rankingUsers">
                        <img
                          src={
                            (tournamentData?.isFinished && tournamentData?.winPlayer?.first?.userId?.profile) ||
                            'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                          }
                          alt=""
                        />
                        <p>
                          {(tournamentData?.isFinished &&
                            tournamentData?.winPlayer?.first?.userId?.username) ||
                            'To be decided'}
                        </p>
                      </div>
                    </td>
                    <td>
                      <p>
                        {(tournamentData?.isFinished &&
                          tournamentData?.winPlayer?.first?.amount) ||
                          'To be decided'}
                      </p>
                    </td>
                  </tr>
                  <tr className="secondRank myRank">
                    <td>
                      <p>2</p>
                      <Star />
                    </td>

                    <td>
                      <div className="rankingUsers">
                        <img
                          src={
                            (tournamentData?.isFinished && tournamentData?.winPlayer?.second?.userId?.profile) ||
                            'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                          }
                          alt=""
                        />
                        <p>
                          {(tournamentData?.isFinished &&
                            tournamentData?.winPlayer?.second?.userId?.username) ||
                            'To be decided'}
                        </p>
                      </div>
                    </td>


                    <td>
                      <p>
                        {(tournamentData?.isFinished &&
                          tournamentData?.winPlayer?.second?.amount) ||
                          'To be decided'}
                      </p>
                    </td>
                  </tr>
                  <tr className="thirdRank">
                    <td>
                      <p>3</p>
                      <Star />
                    </td>
                    <td>
                      <div className="rankingUsers">
                        <img
                          src={
                            (tournamentData?.isFinished && tournamentData?.winPlayer?.third?.userId?.profile) ||
                            'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                          }
                          alt=""
                        />
                        <p>
                          {(tournamentData?.isFinished &&
                            tournamentData?.winPlayer?.third?.userId?.username) ||
                            'To be decided'}
                        </p>
                      </div>

                    </td>
                    <td>
                      <p>
                        {(tournamentData?.isFinished &&
                          tournamentData?.winPlayer?.third?.amount) ||
                          'To be decided'}
                      </p>
                    </td>
                  </tr>
                </>
              ) : allPlayers?.map((el, i) => {
                if (i === 0) {
                  return (
                    <tr className="firstRank">
                      <td>
                        <p>1</p>
                        <Star />
                      </td>
                      <td>
                        <div className="rankingUsers">
                          <img
                            src={
                              el?.profile
                            }
                            alt=""
                          />
                          <p>
                            {el?.name}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p>
                          {el?.amount}
                        </p>
                      </td>
                    </tr>
                  )
                }
                if (i === 1) {
                  return (
                    <tr className="secondRank myRank">
                      <td>
                        <p>2</p>
                        <Star />
                      </td>

                      <td>
                        <div className="rankingUsers">
                          <img
                            src={
                              el?.profile
                            }
                            alt=""
                          />
                          <p>
                            {el?.name}
                          </p>
                        </div>
                      </td>


                      <td>
                        <p>
                          {el?.amount}
                        </p>
                      </td>
                    </tr>
                  )
                }
                if (i === 2) {
                  return (
                    <tr className="secondRank myRank">
                      <td>
                        <p>3</p>
                        <Star />
                      </td>

                      <td>
                        <div className="rankingUsers">
                          <img
                            src={
                              el?.profile
                            }
                            alt=""
                          />
                          <p>
                            {el?.name}
                          </p>
                        </div>
                      </td>


                      <td>
                        <p>
                          {el?.amount}
                        </p>
                      </td>
                    </tr>
                  )
                }
                return (
                  <tr className="secondRank myRank">
                    <td>
                      <p>{i + 1}</p>
                    </td>

                    <td>
                      <div className="rankingUsers">
                        <img
                          src={
                            el?.profile
                          }
                          alt=""
                        />
                        <p>
                          {el?.name}
                        </p>
                      </div>
                    </td>


                    <td>
                      <p>
                        {el?.amount}
                      </p>
                    </td>
                  </tr>
                )
              })}

              {/* {} */}
              {/* <tr className="firstRank">
                <td>
                  <p>1</p>
                  <Star />
                </td>
                <td>
                  <div className="rankingUsers">
                    <img
                      src={
                        (tournamentData?.isFinished && tournamentData?.winPlayer?.first?.userId?.profile) ||
                        'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                      }
                      alt=""
                    />
                    <p>
                      {(tournamentData?.isFinished &&
                        tournamentData?.winPlayer?.first?.userId?.username) ||
                        'To be decided'}
                    </p>
                  </div>
                </td>
                <td>
                  <p>
                    {(tournamentData?.isFinished &&
                      tournamentData?.winPlayer?.first?.amount) ||
                      'To be decided'}
                  </p>
                </td>
              </tr>
              <tr className="secondRank myRank">
                <td>
                  <p>2</p>
                  <Star />
                </td>

                <td>
                  <div className="rankingUsers">
                    <img
                      src={
                        (tournamentData?.isFinished && tournamentData?.winPlayer?.second?.userId?.profile) ||
                        'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                      }
                      alt=""
                    />
                    <p>
                      {(tournamentData?.isFinished &&
                        tournamentData?.winPlayer?.second?.userId?.username) ||
                        'To be decided'}
                    </p>
                  </div>
                </td>


                <td>
                  <p>
                    {(tournamentData?.isFinished &&
                      tournamentData?.winPlayer?.second?.amount) ||
                      'To be decided'}
                  </p>
                </td>
              </tr>
              <tr className="thirdRank">
                <td>
                  <p>3</p>
                  <Star />
                </td>
                <td>
                  <div className="rankingUsers">
                    <img
                      src={
                        (tournamentData?.isFinished && tournamentData?.winPlayer?.third?.userId?.profile) ||
                        'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                      }
                      alt=""
                    />
                    <p>
                      {(tournamentData?.isFinished &&
                        tournamentData?.winPlayer?.third?.userId?.username) ||
                        'To be decided'}
                    </p>
                  </div>

                </td>
                <td>
                  <p>
                    {(tournamentData?.isFinished &&
                      tournamentData?.winPlayer?.third?.amount) ||
                      'To be decided'}
                  </p>
                </td>
              </tr>

              {tournamentData?.winPlayer?.['4-10']?.userIds?.length > 0 &&
                tournamentData?.winPlayer?.['4-10']?.userIds?.map((fourP, i) => (
                  <tr>
                    <td>
                      <p>{4 + i}</p>
                    </td>
                    <td>
                      <div className="rankingUsers">
                        <img
                          src={
                            (tournamentData?.isFinished && fourP?.profile) ||
                            'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                          }
                          alt=""
                        />
                        <p>
                          {(tournamentData?.isFinished && fourP?.username) ||
                            'To be decided'}
                        </p>
                      </div>

                    </td>
                    <td>
                      <p>
                        {(tournamentData?.isFinished &&
                          tournamentData?.winPlayer?.['4-10']?.amount) ||
                          'To be decided'}
                      </p>
                    </td>
                  </tr>
                ))}
              {tournamentData?.winPlayer?.['11-25']?.userIds?.length > 0 &&
                tournamentData?.winPlayer?.['4-10']?.userIds?.map(
                  (elevenP, i) => (
                    <tr>
                      <td>
                        <p>{11 + i}</p>
                      </td>
                      <td>
                        <div className="rankingUsers">
                          <img
                            src={
                              (tournamentData?.isFinished && elevenP?.profile) ||
                              'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
                            }
                            alt=""
                          />
                          <p>
                            {(tournamentData?.isFinished && elevenP?.username) ||
                              'To be decided'}
                          </p>
                        </div>

                      </td>
                      <td>

                        <p>
                          {(tournamentData?.isFinished &&
                            tournamentData?.winPlayer?.['11-25']?.amount) ||
                            'To be decided'}
                        </p>
                      </td>
                    </tr>
                  ),
                )} */}
            </tbody>
          )}

        </Table>
      </div>
    </div>
  )
}

// const Structure = () => {
//   return (
//     <div className='tournament-results'><h4>Structure , documents or rule</h4></div>
//   )
// }

const PrizePool = ({ prizeStructure }) => {
  // useEffect(() => {
  //   setKeys(Object.keys(prizeStructure));

  // }, [keys]);

  return (
    <div className='tournament-results'>
      <h4>PAYOUT STRUCTURE</h4>
      <Table striped bordered variant="dark" responsive>
        <thead>
          <tr>
            <th>Place</th>
            <th>Earnings</th>
          </tr>
        </thead>
        <tbody>
          {prizeStructure?.length > 0 ? prizeStructure?.map(el =>
          (
            <>
              {el.earnings ? <tr>
                {el.place === "first" ? <td>1st</td>
                  : el.place === "second" ? <td>2nd</td>
                    : el.place === "third" ? <td>3rd</td>
                      : <td>{el.place}</td>}
                <td>{el.earnings}</td>
              </tr> : null}
            </>
          )
          ) : (
            <div className='yetDecided'>To Be decided</div>
          )}

          {/* <tr>
            <td>2nd</td>
            <td>$80000</td>
          </tr>
          <tr>
            <td>3rd</td>
            <td>$5000</td>
          </tr> */}
        </tbody>
      </Table>
    </div>
  )
}