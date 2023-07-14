/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useEffect, useRef } from 'react'
import { useState } from 'react'
// import Table from 'react-bootstrap/Table'
import { landingClient } from '../../config/keys'
import { tournamentInstance } from '../../utils/axios.config'
// import { getTime } from '../../utils/utils'
// import Header from './header'
import logo from "../../assets/game/logo.png";
import userUtils from '../../utils/user'
import { socket } from '../../config/socketConnection'
import { useHistory } from 'react-router-dom'
// import { Tab, Tabs } from 'react-bootstrap'
import Loader from '../../components/pageLoader/loader'
// import cookie from 'js-cookie'
import toast from 'react-hot-toast'
import { FaInfoCircle } from 'react-icons/fa'
import casino from '../../assets/game/placeholder.png'
// import Button from 'react-bootstrap/Button'
// import ReactSelect from 'react-select'
// import { useMemo } from 'react'
// import ReactSelect from 'react-select'

let userId;

const Spectate = () => {
    const history = useHistory();
    const url = new URLSearchParams(window.location.search)
    const [tournamentData] = useState([])
    // const [dateState, setDateState] = useState();
    const [allRooms, setAllRooms] = useState([]);
    //const [tournaments, setTournaments] = useState([]);
    // const [prizeStructure, setPrizeStructure] = useState([]);
    // const [keys, setKeys] = useState([]);
    const [showLoader, setShowLoader] = useState(true);
    // const [keys, setPrize] = useState([]);
    console.log("url ==>", url);

    const getTournamentById = async () => {
        try {
            setShowLoader(true);
            if (url.get('tournamentId')) {
                const res = await tournamentInstance().get(`/tournamentById`, {
                    params: { tournamentId: url.get('tournamentId') },
                })
                const { tournament } = res.data || {}
                console.log("tournament ===>", tournament.rooms);
                if (tournament) {
                    console.log("tournament ===>", tournament.rooms);
                    setAllRooms(tournament.rooms);
                    // setPrizeStructure(getPrizeStructure(tournament, payout));
                }
            }
            setShowLoader(false);
        } catch (err) {
            history.push('/')
            setShowLoader(false);
        }
    }

    // const getPrizeStructure = (tournament, payout) => {
    //     const { prizeType, winPlayer, totalJoinPlayer, tournamentFee } = tournament;
    //     const prize = totalJoinPlayer * parseFloat(tournamentFee);
    //     if (prizeType === "Fixed") {
    //         let keys = Object.keys(winPlayer);
    //         let reqData = keys.map(key => {
    //             return {
    //                 place: key,
    //                 earnings: winPlayer[key].amount
    //             }
    //         })
    //         return reqData;
    //     } else {
    //         // let keys = Object.keys(payout?.amount);
    //         let reqData = payout?.amount.map(obj => {
    //             let key = Object.keys(obj)[0];
    //             return {
    //                 place: parseFloat(key) + 1,
    //                 earnings: prize * obj[key] / 100
    //             }
    //         })
    //         return reqData;
    //     }
    // }

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

    // const enterRoom = async (tournamentId) => {
    //     const res = await tournamentInstance().post("/enterroom", {
    //         tournamentId: tournamentId,
    //     });
    //     if (res.data.code === 200) {
    //         let roomid = res.data.roomId;
    //         history.push({
    //             pathname: "/table",
    //             search: "?gamecollection=poker&tableid=" + roomid,
    //         });
    //     } else {
    //         // toast.error(toast.success(res.data.msg, { containerId: 'B' }))
    //     }
    // };

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
            // var days = Math.floor(distance / (1000 * 60 * 60 * 24))
            // var hours = Math.floor(
            //     (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            // )
            // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            // var seconds = Math.floor((distance % (1000 * 60)) / 1000)
            // setDateState({
            //     days,
            //     hours,
            //     minutes,
            //     seconds,
            // })
            if (distance < 0) {
                clearInterval(x)
                // setDateState({
                //     days: '0',
                //     hours: '0',
                //     minutes: '0',
                //     seconds: '0',
                // })
            }
        }, 1000)
    }

    // const ifUserJoind = () => {
    //     let getData = tournamentData?.rooms?.find((el) =>
    //         el?.players?.find((el) => el?.userid === userId)
    //     );
    //     return getData;
    // };

    // const joinTournament = async (tournamentId, fees) => {
    //     socket.emit("joinTournament", {
    //         tournamentId: tournamentId,
    //         userId: userId,
    //         fees,
    //     });
    //     setTimeout(() => {
    //         getTournamentById();
    //     }, 1000);
    // };
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

                    </div>
                </div>
            </div>
            {console.log("allRooms ===>", allRooms)}
            {showLoader ?
                <Loader />
                : <>
                    <div className="container leaderBoardContainer">
                        <div className="leaderBoardHeader">
                            <h1>Tables you can spectate</h1>
                            <br />
                            <div className="tournamentDetails">
                                {allRooms?.map((el, i) => (
                                    <GameTable
                                        data={el}
                                        gameType="Poker"
                                        tableId={el._id}
                                        index={i}
                                    />
                                ))}


                            </div>
                        </div>


                    </div>
                </>}

        </div>
    )
}

export default Spectate

// const Star = () => {
//     return (
//         <svg
//             width="800px"
//             height="800px"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path
//                 d="M21.12 9.88005C21.0781 9.74719 20.9996 9.62884 20.8935 9.53862C20.7873 9.4484 20.6579 9.38997 20.52 9.37005L15.1 8.58005L12.67 3.67005C12.6008 3.55403 12.5027 3.45795 12.3853 3.39123C12.2678 3.32451 12.1351 3.28943 12 3.28943C11.8649 3.28943 11.7322 3.32451 11.6147 3.39123C11.4973 3.45795 11.3991 3.55403 11.33 3.67005L8.89999 8.58005L3.47999 9.37005C3.34211 9.38997 3.21266 9.4484 3.10652 9.53862C3.00038 9.62884 2.92186 9.74719 2.87999 9.88005C2.83529 10.0124 2.82846 10.1547 2.86027 10.2907C2.89207 10.4268 2.96124 10.5512 3.05999 10.6501L6.99999 14.4701L6.06999 19.8701C6.04642 20.0091 6.06199 20.1519 6.11497 20.2826C6.16796 20.4133 6.25625 20.5267 6.36999 20.6101C6.48391 20.6912 6.61825 20.7389 6.75785 20.7478C6.89746 20.7566 7.03675 20.7262 7.15999 20.6601L12 18.1101L16.85 20.6601C16.9573 20.7189 17.0776 20.7499 17.2 20.7501C17.3573 20.7482 17.5105 20.6995 17.64 20.6101C17.7537 20.5267 17.842 20.4133 17.895 20.2826C17.948 20.1519 17.9636 20.0091 17.94 19.8701L17 14.4701L20.93 10.6501C21.0305 10.5523 21.1015 10.4283 21.1351 10.2922C21.1687 10.1561 21.1634 10.0133 21.12 9.88005Z"
//                 fill="#000000"
//             />
//         </svg>
//     )
// }


// const Results = ({ tournamentData }) => {

//     const [allPlayers, setAllPlayers] = useState([]);
//     useEffect(() => {
//         if (tournamentData?.winPlayer) {
//             let winPlayers = tournamentData.winPlayer;
//             let allKeys = winPlayers ? Object.keys(winPlayers) : [];
//             let players = [];
//             allKeys.forEach(key => {
//                 if (winPlayers[key]?.userId) {
//                     winPlayers[key] = {
//                         ...winPlayers[key],
//                         amount: winPlayers[key].amount,
//                     }
//                     players.push(winPlayers[key]);
//                 } else {
//                     winPlayers[key]?.userIds?.forEach(user => {
//                         user = {
//                             ...user,
//                             amount: winPlayers[key]?.amount,
//                         }
//                         players.push(user);
//                     });
//                 }
//             });
//             setAllPlayers(players);
//         }
//     }, [tournamentData]);

//     return (
//         <div className='tournament-results'>
//             <h4>Tables you can spectate</h4>

//         </div>
//     )
// }

const GameTable = ({
    data,
    gameType,
    getTournamentDetails,
    height,
    setUserData,
    tableId,
    index
}) => {
    // const history = useHistory()
    // const redirectToTable = () => {
    //     socket.emit('checkAlreadyInGame', {
    //         userId,
    //         tableId,
    //         gameMode: cookie.get('mode'),
    //     })
    //     socket.on('userAlreadyInGame', (value) => {
    //         const { message, join } = value
    //         if (join) {
    //             history.push({
    //                 pathname: '/table',
    //                 search: '?gamecollection=poker&tableid=' + data?._id,
    //             })
    //         } else {
    //             toast.error(message, { id: 'create-table-error' })
    //         }
    //     })
    // }

    useEffect(() => {
        socket.on('alreadyInTournament', (data) => {
            const { message, code } = data
            if (code === 200) {
                if (data?.user && Object.keys(data?.user)?.length > 0) {
                    setUserData(data?.user)
                }

                toast.success(message, { id: 'Nofull' })
            } else {
                toast.error(message, { id: 'full' })
            }
        })
        socket.on('notEnoughAmount', (data) => {
            const { message, code } = data
            if (code === 200) {
                toast.success(message, { id: 'Nofull' })
            } else {
                toast.error(message, { id: 'full' })
            }
        })

        socket.on('tournamentAlreadyFinished', (data) => {
            toast.error('Tournament has been finished.', {
                id: 'tournament-finished',
            })
        })

        socket.on('tournamentAlreadyStarted', (data) => {
            toast.error(data.message, { id: 'tournamentStarted' })
        })




    }, [])

    const getTime = (time) => {
        let d = new Date(time)
        let pm = d.getHours() >= 12
        let hour12 = d.getHours() % 12
        if (!hour12) hour12 += 12
        let minute = d.getMinutes()
        let date = d.getDate()
        let month = d.getMonth() + 1
        let year = d.getFullYear()
        return `${ date }/${ month }/${ year } ${ hour12 }:${ minute } ${ pm ? 'pm' : 'am' }`
    }

    const [cardFlip, setCardFlip] = useState(false)
    const [dateState, setDateState] = useState()
    const handleFlip = (tDate) => {
        setCardFlip(!cardFlip)
        countDownData(tDate)
    }
    const countDownData = (tDate) => {
        var x = setInterval(() => {
            let countDownDate = new Date(tDate).getTime()
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

    const wrapperRef = useRef()

    const useOutsideAlerter = (ref) => {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setCardFlip(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }, [ref])
    }
    useOutsideAlerter(wrapperRef)

    const doSpectate = (roomId) => {
        console.log("spectate data ==>", {
            roomId: roomId,
            userId: userId,
        })
        socket.emit('spectateMultiTable', {
            roomId: roomId,
            userId: userId,
        })
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


    return (
        <>
            <div className="tournamentCard" ref={wrapperRef}>
                <FaInfoCircle
                    className="leaderboardBtn"
                    onClick={() => handleFlip(data.tournamentDate)}
                />
                <div
                    className={`tournamentCard-inner
           ${ cardFlip && gameType === 'Poker' ? 'rotate' : '' }
           `}
                >
                    {!cardFlip && gameType === 'Poker' ? (
                        <div className="tournamentCard-front">
                            <img src={casino} alt="" />
                            <div className="tournamentFront-info">
                                <h4>{`Table ${ index + 1 }`}</h4>
                                <button onClick={() => { doSpectate(data._id) }} type="submit">
                                    Spectate22222
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="tournamentCard-back" style={{ height: height }}>
                            {gameType === 'Poker' ? (
                                <AvatarGroup imgArr={data?.players} />
                            ) : (
                                ''
                            )}
                            <h4>
                                people joined :{' '}
                                <span>
                                    {(gameType === 'Tournament'
                                        ? data?.rooms?.filter((el) => el?.players)[0]?.players
                                            ?.length || 0
                                        : data?.players?.length) || 0}
                                </span>
                            </h4>
                            <h4>
                                SB/BB :{' '}
                                <span>
                                    {data?.smallBlind}
                                    {'/'}
                                    {data?.bigBlind}
                                </span>
                            </h4>
                            {gameType === 'Tournament' ? (
                                <h4>
                                    Fee : <span>{data?.tournamentFee}</span>
                                </h4>
                            ) : (
                                ''
                            )}
                            {gameType === 'Tournament' ? (
                                <h4>
                                    Date : <span>{getTime(data?.tournamentDate)}</span>
                                </h4>
                            ) : (
                                ''
                            )}
                            {gameType === 'Tournament' ? (
                                <>
                                    <div id="clockdiv">
                                        <h4>
                                            Days
                                            <span class="days">{dateState?.days || '0'}</span>
                                        </h4>
                                        <h4>
                                            Hours
                                            <span class="hours">{dateState?.hours || '0'}</span>
                                        </h4>
                                    </div>
                                    <div id="clockdiv">
                                        <h4>
                                            Minutes
                                            <span class="minutes">{dateState?.minutes || '0'}</span>
                                        </h4>
                                        <h4>
                                            Seconds
                                            <span class="seconds">{dateState?.seconds || '0'}</span>
                                        </h4>
                                    </div>
                                </>
                            ) : (
                                ''
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

// const Structure = () => {
//   return (
//     <div className='tournament-results'><h4>Structure , documents or rule</h4></div>
//   )
// }

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
                                    'https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg'
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
    )
}

// const PrizePool = ({ prizeStructure }) => {
//     // useEffect(() => {
//     //   setKeys(Object.keys(prizeStructure));

//     // }, [keys]);

//     return (
//         <div className='tournament-results'>
//             <h4>PAYOUT STRUCTURE</h4>
//             <Table striped bordered variant="dark" responsive>
//                 <thead>
//                     <tr>
//                         <th>Place</th>
//                         <th>Earnings</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {prizeStructure?.length > 0 ? prizeStructure?.map(el =>
//                     (
//                         <>
//                             {el.earnings ? <tr>
//                                 {el.place === "first" ? <td>1st</td>
//                                     : el.place === "second" ? <td>2nd</td>
//                                         : el.place === "third" ? <td>3rd</td>
//                                             : <td>{el.place}</td>}
//                                 <td>{el.earnings}</td>
//                             </tr> : null}
//                         </>
//                     )
//                     ) : (
//                         <div className='yetDecided'>To Be decided</div>
//                     )}

//                     {/* <tr>
//             <td>2nd</td>
//             <td>$80000</td>
//           </tr>
//           <tr>
//             <td>3rd</td>
//             <td>$5000</td>
//           </tr> */}
//                 </tbody>
//             </Table>
//         </div>
//     )
// }