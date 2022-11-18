import React, { useEffect, useRef, useState } from 'react';
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from '@videosdk.live/react-sdk';
import logo from '../../assets/whitelogo.png';
import { Button, Spinner, Dropdown } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Lottie from 'react-lottie';
import front from '../../assets/cards/BLUE_BACK.svg';
import back from '../../assets/cards/RED_BACK.svg';
import { socket } from '../../config/socketConnection';
import firebase from '../../config/firebase';
import accept from '../../assets/checked.png';
import reject from '../../assets/close.png';
import Chat from '../chat/chat';
import winnerSound from '../../assets/Poker Sfx/winSoundPoker.aac';
import call from '../../assets/Poker Sfx/Chip Bet/bet.wav';
import collect from '../../assets/Poker Sfx/Collect Chips/collect.wav';
import check from '../../assets/Poker Sfx/Check/check.mp3';
import chatBubble from '../../assets/Poker Sfx/ChatBubble.wav';
import fold from '../../assets/Poker Sfx/Fold.mp3';
import myTurn from '../../assets/Poker Sfx/MyTurn.wav';
import arrow from '../../assets/left-arrow.png';
import Bet from '../bet/bet';
import './table.css';
import footerlogo from '../../assets/chat/logocoin.png';
import { Tooltip, Overlay, OverlayTrigger } from 'react-bootstrap';
import winnericon from '../../assets/win-icon.png';
import loseicon from '../../assets/loss-icon.png';
import StatsPopup from './statsPopup';
import BuyInPopup from './buyInPopup';
import LeaveConfirmPopup from './leaveConfirmPopup';
import './tablepopup.css';
import NewBuyInPopup from './newBuyinPopup';
import btntoggle from '../../assets/btnmenu.png';
import sitdown from '../../assets/sit-in.png';
import situp from '../../assets/sit-out.png';
import addcoin from '../../assets/add-coin.png';
import loaderImg from '../../assets/chat/loader1.webp';
import InviteFriend from './InviteFriend';
import Helmet from 'react-helmet';
import MarketStore from '../MarketPlace/marketStore';
import axios from 'axios';
import defaultFlag from '../../assets/flag.png';
import winImage from '../../assets/animation/win.json';
import userUtils from './../../utils/user';
import { useHistory } from 'react-router-dom';

const winImageanim = {
  loop: true,
  autoplay: true,
  animationData: winImage,
};

let roomData;
let userId;
let isWatcher = false;
let joinInRunningRound = false;
let tRound = null;
let tPlayer = null;
let showFinish = false;
let AvailablePosition = [];
let admin = false;
let idToken;

const numFormatter = (num) => {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(2) + 'K'; // convert to K for number from > 1000 < 1 million
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
  } else if (num >= 100000000 && num < 1000000000000) {
    return (num / 100000000).toFixed(2) + 'B';
  } else if (num >= 1000000000000)
    return (num / 1000000000000).toFixed(2) + 'T';
  else return num; // if value < 1000, nothing to do
};

const chunk = (arr, players) => {
  let newArr = [];
  if (arr.length === 0) {
    return players;
  }
  for (let i = 0; i < players.length; i++) {
    let player = arr.find((el) => el.displayName === players[i].id);
    console.log(player, i, 'fsdfsdf');
    if (player) newArr.push(player);
    else newArr.push(players[i]);
  }
  console.log('newArr =>', newArr);
  return newArr;
};

const ParticipantView = ({
  participantId,
  toggleMic,
  toggleWebcam,
  systemplayer,
  winner,
  setBuyinPopup,
  playerclass,
  betOn,
  betWin,
  handMatch,
  message,
  messageBy,
  action,
  currentPlayer,
  playerData,
  actionText,
  timer,
  remainingTime,
  winAnimationType,
  friendList,
  followingList,
  setFriendList,
  setFollowingList,
}) => {
  const webcamRef = useRef(null);
  const micRef = useRef(null);
  const [showFollowMe, setShowFollowMe] = useState(false);
  const [followClick, setFollowClick] = useState('');
  const target = useRef(null);
  const onStreamEnabled = (stream) => {};
  const onStreamDisabled = (stream) => {};
  const [newPurchase, setNewPurchase] = useState(false);

  useEffect(() => {
    const showBuyIn = () => {
      if (
        playerData &&
        playerData.id === userId &&
        playerData.wallet === 0 &&
        roomData &&
        roomData.runninground === 0 &&
        !roomData.buyin.find(
          (ele) => ele.userid === userId && ele.redeem === 0
        ) &&
        roomData.gameType !== 'pokerTournament_Tables'
      ) {
        setBuyinPopup(true);
      } else {
        setBuyinPopup(false);
      }
      if (
        playerData &&
        playerData.id === userId &&
        roomData &&
        roomData.buyin.find(
          (ele) => ele.userid === userId && ele.redeem === 0
        ) &&
        roomData.gameType !== 'pokerTournament_Tables'
      ) {
        setBuyinPopup(false);
        setNewPurchase(true);
      }
    };
    if (playerData && playerData.wallet === 0) {
      showBuyIn();
    }
    if (roomData && roomData.runninground === 0) {
      setNewPurchase(false);
    }
  }, [playerData, setBuyinPopup]);

  const { webcamStream, micStream, webcamOn, micOn } = useParticipant(
    participantId,
    {
      onStreamEnabled,
      onStreamDisabled,
    }
  );
  useEffect(() => {
    if (webcamRef.current) {
      if (webcamOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);

        webcamRef.current.srcObject = mediaStream;
        webcamRef.current
          .play()
          .catch((error) =>
            console.error('videoElem.current.play() failed', error)
          );
      } else {
        webcamRef.current.srcObject = null;
      }
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error('audioElem.current.play() failed', error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  const {
    name,
    photoURI: playerImage,
    stats: { Level, total, max, countryCode },
  } = playerData;

  const handleFollow = async (followerId, nickname) => {
    const Uid = followerId;
    toast.success('Following..', {
      id: 'please-wait',
      icon: '♠️',
      style: {
        borderRadius: '5px',
        background: '#333',
        color: '#fff',
      },
    });

    axios
      .get('https://follow-t3e66zpola-lz.a.run.app', {
        params: { frId: Uid },
        headers: { idtoken: idToken },
      })
      .then((response) => {
        setFollowClick('');
        if (response.data) {
          if (
            response.data.error === 'no error' &&
            response.data.success === true
          ) {
            setFollowingList((old) => [...old, followerId]);
            toast.success('You are now following @' + nickname, {
              id: 'follow-request',
              icon: '✔️',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }

          if (
            response.data.error === 'no error' &&
            response.data.success === true &&
            response.data.special ===
              'You have removed this follower in the past'
          ) {
            toast.success(
              'You are now following @' +
                nickname +
                ', notice that you removed him from following you',
              {
                id: 'follow-request',
                icon: '✔️',
                style: {
                  borderRadius: '5px',
                  background: '#333',
                  color: '#fff',
                },
              }
            );
          }

          if (response.data.error === 'already following him') {
            toast.success('You are aleady following @' + nickname, {
              id: 'follow-aleady',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }

          if (response.data.error === 'You are rejected follower') {
            toast.success('Request rejected by @' + nickname, {
              id: 'follow-rejected',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }

          if (response.data.error === 'You are rejected follower') {
            toast.success('You rejected @' + nickname + 'from following', {
              id: 'follow-aleady',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }

          if (response.data.error === 'you can not follow yourself') {
            toast.success('You can not follow yourself', {
              id: 'follow-yourself',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          } else if (response.data.error !== 'no error') {
            toast.success(response.data.error, {
              id: 'follow-yourself',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }
        } else {
          console.log('backend response failed: ', response.statusText);
        }
      })
      .catch((error) => {
        console.log('Error req', error);
      });
  };

  const handleConnect = async (friendId, nickname) => {
    toast.success('Send friend request..', {
      id: 'please-wait',
      icon: '♠️',
      style: {
        borderRadius: '5px',
        background: '#333',
        color: '#fff',
      },
    });
    const FUid = friendId;
    const Fname = nickname;

    const IdTokenConst = idToken;
    const Uid = userId;
    axios
      .get('https://friend-reqest-t3e66zpola-uc.a.run.app', {
        params: { usid: Uid, frId: FUid },
        headers: { idtoken: IdTokenConst },
      })
      .then((response) => {
        console.log('Executing friend-request:');
        if (response.data) {
          if (response.data.error === 'already sent friend request') {
            toast.success(
              'Friend request already sent to @' +
                Fname +
                ' please wait ' +
                response.data.hours +
                ' hours before you can try again.',
              {
                duration: 6000,
                id: 'frined-already-sent',
                icon: '❌',
                style: {
                  borderRadius: '5px',
                  background: '#333',
                  color: '#fff',
                },
              }
            );
          }
          if (response.data.error === 'already friends') {
            toast.success('You and @' + Fname + ' already friends', {
              duration: 4000,
              id: 'frined-already-sent',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }
          if (
            response.data.error === 'no error' &&
            response.data.success === true
          ) {
            setFriendList((old) => [...old, friendId]);
            toast.success('Friend request successfully sent to @' + Fname, {
              duration: 4000,
              id: 'frined-request',
              icon: '✔️',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          } else if (response.data.error !== 'no error') {
            toast.success(response.data.error, {
              id: 'follow-yourself',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }
          setFollowClick('');
        } else {
          console.log('Backend response failed: ', response.statusText);
        }
      })
      .catch((error) => {
        console.log('Error req', error);
      });
    console.log('It works my friend-request!!!');
  };

  return (
    <>
      <div
        key={playerData?.id}
        onClick={() => {
          if (playerData?.id !== userId) {
            setShowFollowMe(!showFollowMe);
          }
        }}
        ref={target}
        className={`players ${playerclass} ${
          winner && playerData && winner.id === playerData.id
            ? `winner-player`
            : ``
        } ${playerData && playerData.playing ? '' : 'not-playing'}`}>
        {/* start win or lose animation */}
        {/* {winner &&
      playerData &&
      winner.id !== playerData.id &&
      winAnimationType.activeWinAnimation.win !== "notFound" &&
      winAnimationType.level ? (
        <div className="win-animation"> */}
        {/* loser div */}
        {/* {`${winAnimationType.activeWinAnimation.win}-${
            winAnimationType.level
          } ${
            playerData.items.level > winAnimationType.level &&
            playerData.items["defence"][
              winAnimationType.activeWinAnimation.type
            ]
              ? "<"
              : ">"
          } ${
            winAnimationType.activeWinAnimation.type === "fart"
              ? "Gas-mask"
              : winAnimationType.activeWinAnimation.type === "gun"
              ? "Shield"
              : winAnimationType.activeWinAnimation.type === "dick"
              ? "Umbrella"
              : ""
          }${playerData.items.level}`} */}

        {/* <img
            src={
              require(`../../assets/${
                playerData.items.level > winAnimationType.level &&
                playerData.items["defence"][
                  winAnimationType.activeWinAnimation.type
                ]
                  ? playerData.items["defence"][
                      winAnimationType.activeWinAnimation.type
                    ] + playerData.items.level
                  : winAnimationType.activeWinAnimation.type +
                    winAnimationType.level
              }.gif`).default
            }
            alt="animation effect"
          /> */}
        {/* </div>
      ) : (
        ""
      )} */}

        {/* end of win or lose animation */}
        {currentPlayer &&
          playerData &&
          currentPlayer.id === playerData.id &&
          action && <span className='player-action'>{actionText}</span>}

        <div className='player-box'>
          <audio ref={micRef} muted={userId === playerData.id} autoPlay />

          {winner && playerData && winner.id === playerData.id && (
            <div className='pyro'>
              <div className='before'></div>
              <div className='after'></div>
              <Lottie options={winImageanim} width={600} height={500} />
            </div>
          )}
          {playerData && (playerData.fold || !playerData.playing) ? (
            ''
          ) : roomData && roomData.runninground === 5 ? (
            <ShowCard
              cards={playerData.cards ? playerData.cards : []}
              handMatch={handMatch}
            />
          ) : roomData &&
            roomData.runninground >= 1 &&
            playerData.id === userId ? (
            <ShowCard
              cards={playerData.cards ? playerData.cards : []}
              handMatch={handMatch}
            />
          ) : roomData && roomData.runninground === 0 ? (
            ''
          ) : (
            <HideCard />
          )}
          <div
            className='player-pic'
            style={{
              backgroundImage: `url(${playerData.items.avatar})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}>
            {currentPlayer &&
              playerData &&
              currentPlayer.id === playerData.id && (
                <TimerSeparator time={timer} remainingTime={remainingTime} />
              )}
            {roomData?.media === 'video' && webcamOn ? (
              <video ref={webcamRef} autoPlay muted playsInline />
            ) : (
              <img src={playerData?.photoURI} alt='off-camera' />
              // <video ref={webcamRef} autoPlay />
            )}
          </div>
          <div className='player-with-icons'>
            {systemplayer ? (
              <div className='cam-tool'>
                <Dropdown>
                  <Dropdown.Toggle variant='success' id='dropdown-basic'>
                    <i className='fa fa-ellipsis-v'></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <div eventKey='audio'>
                        <i
                          onClick={() => {
                            toggleMic();
                          }}
                          className={`cursor ${
                            micOn
                              ? 'fas fa-microphone-alt'
                              : 'fas fa-microphone-alt-slash'
                          }`}></i>
                      </div>
                      {roomData?.media === 'video' ? (
                        <div eventKey='video-cam'>
                          <>
                            <i
                              onClick={() => toggleWebcam()}
                              className={`cursor ${
                                webcamOn ? 'fas fa-video' : 'fas fa-video-slash'
                              }`}></i>
                          </>
                        </div>
                      ) : (
                        ''
                      )}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              ''
            )}

            <div className='player-info'>
              <h4>
                {playerData && playerData.name.length > 8
                  ? playerData.name.substring(0, 8) + '..'
                  : playerData.name}
              </h4>
              <p>
                {newPurchase
                  ? 'Purchase'
                  : numFormatter(playerData && playerData.wallet)}
              </p>
              {/* {userId === playerData.id && gameCollection !== 'pokerTournament_Tables' && } */}
            </div>
          </div>
          {roomData &&
            roomData.runninground !== 0 &&
            playerData &&
            (playerData.isBigBlind ||
              playerData.isSmallBlind ||
              playerData.isDealer) && (
              <div className='player-badge'>
                {playerData.isSmallBlind
                  ? 'S'
                  : playerData.isBigBlind
                  ? 'B'
                  : playerData.isDealer
                  ? 'D'
                  : ''}
              </div>
            )}

          {playerData && playerData.pot > 0 && playerData !== undefined ? (
            <div className='player-chip'>
              <span>{numFormatter(playerData && playerData.pot)}</span>
            </div>
          ) : (
            ''
          )}

          {betOn && playerData && betOn === playerData.id ? (
            <WatcherResult betWin={betWin} />
          ) : (
            ''
          )}

          {betOn && playerData && betOn === playerData.id ? (
            <WatcherResult betWin={betWin} />
          ) : (
            ''
          )}
        </div>
        {playerData && playerData.id === messageBy && (
          <BubbleMessage message={message} />
        )}
      </div>

      <Overlay
        target={target.current}
        show={showFollowMe}
        placement='right'
        rootClose={true}
        onHide={() => setShowFollowMe(false)}>
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            id='button-tooltip'
            className='tootltip player-tooltip'
            {...props}>
            <div className='tooltip-box'>
              <h5>
                {name}{' '}
                <img
                  className='country-flag'
                  src={
                    countryCode
                      ? `https://countryflagsapi.com/png/${countryCode}`
                      : 'https://countryflagsapi.com/png/us'
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultFlag;
                  }}
                  alt='country-flag'
                />
              </h5>
              <div className='tooltip-content'>
                <img src={playerImage} alt='las-vegas-player' />
                <div className='player-details-content'>
                  <p>
                    Level - <span>{Level}</span>
                  </p>
                  <p>
                    Win - <span>{total.win}</span>
                  </p>
                  <p>
                    Win ratio - <span>{total.wl_ratio.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <p>
                Win coins - <span>{max.winCoins}</span>
              </p>
              <p>
                Game played - <span>{total.games}</span>
              </p>
              <div className='action-tooltip'>
                <Button
                  className='btn-gold'
                  onClick={() => {
                    setFollowClick('follow');
                    handleFollow(playerData.id, playerData.name);
                  }}
                  disabled={
                    followClick ||
                    followingList.find((ele) => ele === playerData.id)
                  }>
                  {followClick === 'follow' ? (
                    <Spinner animation='border' />
                  ) : (
                    'Follow'
                  )}
                </Button>
                <Button
                  className='btn-dark'
                  onClick={() => {
                    setFollowClick('friend');
                    handleConnect(playerData.id, playerData.name);
                  }}
                  disabled={
                    followClick ||
                    friendList.find((ele) => ele === playerData.id)
                  }>
                  {followClick === 'friend' ? (
                    <Spinner animation='border' />
                  ) : (
                    'Add Friend'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
};

const ParticipantsView = ({
  toggleWebcam,
  toggleMic,
  players,
  winner,
  setBuyinPopup,
  betOn,
  betWin,
  handMatch,
  message,
  messageBy,
  action,
  currentPlayer,
  actionText,
  timer,
  remainingTime,
  winAnimationType,
  setShowFollowMe,
  friendList,
  followingList,
  setFriendList,
  setFollowingList,
}) => {
  const { participants } = useMeeting();
  return chunk([...participants.values()], players).map((l, i) =>
    AvailablePosition[i] + 1 ? (
      <ParticipantView
        key={l.id}
        playerclass={`player${AvailablePosition[i] + 1} wow animate__animated`}
        systemplayer={i === 0 ? true : false}
        participantId={l.id}
        toggleMic={toggleMic}
        toggleWebcam={toggleWebcam}
        playerData={players.length > i ? players[i] : undefined}
        winner={winner}
        setBuyinPopup={setBuyinPopup}
        betOn={betOn}
        betWin={betWin}
        handMatch={handMatch}
        message={message}
        messageBy={messageBy}
        action={action}
        currentPlayer={currentPlayer}
        actionText={actionText}
        timer={timer}
        remainingTime={remainingTime}
        winAnimationType={winAnimationType}
        setShowFollowMe={setShowFollowMe}
        friendList={friendList}
        followingList={followingList}
        setFriendList={setFriendList}
        setFollowingList={setFollowingList}
      />
    ) : (
      ''
    )
  );
};

const MeetingView = ({
  players,
  winner,
  setBuyinPopup,
  betOn,
  betWin,
  handMatch,
  message,
  messageBy,
  action,
  currentPlayer,
  actionText,
  timer,
  remainingTime,
  winAnimationType,
  setShowFollowMe,
  friendList,
  followingList,
  setFriendList,
  setFollowingList,
}) => {
  const onSpeakerChanged = (activeSpeakerId) => {};
  const { join, leave, toggleMic, toggleWebcam, participants, end } =
    useMeeting({
      onParticipantJoined,
      onParticipantLeft,
      onSpeakerChanged,
      onMainParticipantChanged,
      onEntryRequested,
      onEntryResponded,
      onMeetingJoined,
      onMeetingLeft,
    });
  function onParticipantJoined(participant) {
    console.log(' onParticipantJoined', participant);
  }
  function onParticipantLeft(participant) {
    console.log(' onParticipantLeft', participant);
  }

  function onMainParticipantChanged(participant) {
    console.log(' onMainParticipantChanged', participant);
  }
  function onEntryRequested(participant) {
    if (admin) {
      // if (
      //   ![...participants.values()].find(
      //     (ele) => ele.displayName === participant.name
      //   )
      // )
      participant.allow();
    } else participant.deny();
  }
  function onEntryResponded(participantId, name) {
    console.log(' onEntryResponded', participantId, name);
  }

  function onMeetingJoined() {
    console.log('onMeetingJoined');
  }
  function onMeetingLeft() {
    console.log('onMeetingLeft');
  }

  useEffect(() => {
    setTimeout(() => {
      if (participants) join();
    }, 1000);
    return leave();
  }, []);

  useEffect(() => {
    socket.on('roomFinished', () => {
      if (admin) {
        end();
      }
    });
  }, []);

  return (
    <ParticipantsView
      toggleWebcam={toggleWebcam}
      toggleMic={toggleMic}
      players={players}
      winner={winner}
      setBuyinPopup={setBuyinPopup}
      betOn={betOn}
      betWin={betWin}
      handMatch={handMatch}
      message={message}
      messageBy={messageBy}
      action={action}
      currentPlayer={currentPlayer}
      actionText={actionText}
      timer={timer}
      remainingTime={remainingTime}
      winAnimationType={winAnimationType}
      setShowFollowMe={setShowFollowMe}
      friendList={friendList}
      followingList={followingList}
      setFriendList={setFriendList}
      setFollowingList={setFollowingList}
    />
  );
};

const PokerTable = (props) => {
  const [currentPlayer, setCurrentPlayer] = useState();
  const [action, setAction] = useState(false);
  const [actionText, setActionText] = useState('');
  const [winner, setWinner] = useState(false);
  const [bet, setBet] = useState();
  const [raise, setRaise] = useState();
  const [tableId, setTableId] = useState();
  const [players, setPlayers] = useState([]);
  const [tablePot, setTablePot] = useState('');
  const [isAdmin, setisAdmin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [communityCards, setCommunityCards] = useState([]);
  const [newUser, setNewUser] = useState(false);
  const [winnerText, setWinnerText] = useState('');
  const [remainingTime, setRemainingTime] = useState();
  const [handMatch, setHandMatch] = useState([]);
  const [matchCards, setMatchCards] = useState([]);
  const [messageBy, setMessageBy] = useState();
  const [message, setMessage] = useState('');
  const [allowWatcher, setAllowWatcher] = useState(false);
  const [watchers, setWatchers] = useState([]);
  const [betOn, setBetOn] = useState('');
  const [betWin, setBetWin] = useState(false);
  const [onlywatcher, setOnlywatcher] = useState(false);
  const [gameCollection, setGameCollection] = useState('');
  const [handWinner, setHandWinner] = useState([]);
  const [showCoin, setShowCoin] = useState(false);
  const [loader, setLoader] = useState(false);
  const [start, setStart] = useState(false);
  const [newJoinlowBalance, setNewJoinLowBalance] = useState(false);
  const [openAction, setOpenAction] = useState({
    bet: false,
    call: false,
    raise: false,
    check: false,
    allin: false,
    fold: false,
  });
  const history = useHistory();
  const [open, setOpen] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [leaveConfirmShow, setLeaveConfirm] = useState(false);
  const [buyinPopup, setBuyinPopup] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const handleClick = (e) => {
    setOpen(e);
  };

  console.log('Players Data ------------- ', { players });

  const [view, setView] = useState();
  const [btnToggle, setBtnToggle] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [winAnimationType, setWinAnimationType] = useState('');
  const [showFollowMe, setShowFollowMe] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [exchangeRate, setExchangeRate] = useState({
    rate: 1,
    currency: 'USD',
  });

  const getDoc = async (coll, u) => {
    //u = user.uid
    const res = await axios.get('https://get-doc-t3e66zpola-uc.a.run.app/', {
      params: {
        coll,
        usid: u,
      },
    });

    return {
      ...res.data.doc,
      inGame: res.data.inGame,
      exchangeRate: {
        rate: res.data.exchangeRate,
        currency: res.data.currency,
      },
    };
  };

  const getFollowing = async (token) => {
    const res = await axios.get(
      `https://followers-table-t3e66zpola-ez.a.run.app/?type=following`,
      { headers: { idtoken: token } }
    );
    if (res.data.success) {
      setFollowingList(res.data.followers.map((ele) => ele.uid));
    }
  };

  const fetchFriendList = async () => {
    try {
      const res = await axios.get('https://base-api-t3e66zpola-uk.a.run.app', {
        params: {
          usid: userId,
          service: 'getFr-BlockTables',
          params: `usid=${userId},mode=lobby`,
        },
      });
      if (res.data.error === 'no error') {
        setFriendList(res.data.friendList.map((ele) => ele.uid));
      }
    } catch (err) {
      console.log('Error in fetch friend list =>', err.message);
    }
  };

  const handleBtnClick = () => {
    setBtnToggle(!btnToggle);
  };

  const handleBetClick = (e) => {
    setView(e);
  };

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    setTableId(urlParams.get('tableid'));
    setGameCollection(
      urlParams.get('gameCollection') || urlParams.get('gamecollection')
    );
  }, []);

  useEffect(() => {
    const tryReconnect = () => {
      setTimeout(() => {
        console.log('reconnect');
        socket.io.open((err) => {
          if (err) {
            console.log('reconnect err => ', err);
            tryReconnect();
          } else {
            let urlParams = new URLSearchParams(window.location.search);
            let table = urlParams.get('tableid');
            let type =
              urlParams.get('gameCollection') ||
              urlParams.get('gamecollection');
            socket.emit('checkTable', {
              tableId: table,
              userId,
              gameType: type,
            });
            setLoader(true);
          }
        });
      }, 2000);
    };
    socket.io.on('close', tryReconnect);
  }, []);

  useEffect(() => {
    const isLoggedIn = async () => {
      let urlParams = new URLSearchParams(window.location.search);
      let user;
      if (!localStorage.getItem('token') && !urlParams.get('token')) {
        return (window.location.href = `${window.location.origin}/login`);
      }

      user = await userUtils.getAuthUserData();
      console.log('USER DATA HERE -------', { user });

      if (!user.success) {
        return (window.location.href = `${window.location.origin}/login`);
      }
      userId = user?.data.user?.id;
      let table = urlParams.get('tableid');
      let type =
        urlParams.get('gameCollection') || urlParams.get('gamecollection');
      // const users = await getDoc('users', user?.uid);
      // setExchangeRate(users.exchangeRate);
      // fetchFriendList();
      // getFollowing(idToken);
      // alert(`HERE ${table} ${JSON.stringify(user)}`)
      socket.emit('checkTable', {
        gameId: table,
        userId: user?.data.user?.id,
        gameType: type,
      });
      setLoader(true);
    };
    isLoggedIn();
  }, []);

  useEffect(() => {
    socket.on('roomFull', () => {
      setLoader(false);
      toast.error('Room already full', { id: 'full' });
      setTimeout(() => {
        window.location.href = window.location.origin + '/profile';
      }, 1000);
      console.log('dfdfdfdfdfdf');
    });
  }, []);

  useEffect(() => {
    socket.on('userId', async (data) => {
      userId = data;
    });
    socket.on('newMessage', (data) => {
      playAudio('chat');
      setMessage(() => {
        return data.message;
      });
      setMessageBy(() => {
        return data.userId;
      });

      setTimeout(() => {
        setMessage('');
        setMessageBy(null);
      }, 10000);
    });
    socket.on('lowBalance', (data) => {
      setLoader(false);
      if (data.userid === userId) {
        toast(
          (toaster) => (
            <div className='custom-toaster low-balance'>
              <p>Wallet has low balance, Unable to join</p>
            </div>
          ),
          { id: 'A', duration: 2000 }
        );
        setNewJoinLowBalance(true);
        setBuyinPopup(true);
      }
    });

    socket.on('watcherbet', (data) => {
      setBetOn(data.player.id);
      setBetWin(data.betType);
    });

    socket.on('OnlyOne', () => {
      toast.error('Only One player, please wait for othe to join', { id: 'A' });
    });

    socket.on('newWatcherJoin', (data) => {
      setLoader(false);
      if (data.watcherId === userId) {
        toast.success('Joined as Watcher', { id: 'A' });
        isWatcher = true;
      }
      roomData = data.roomData;
      setWatchers(data.roomData.watchers);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on('actionError', (data) => {});
    socket.on('sitInOut', (data) => {
      roomData = data.updatedRoom;
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });
    socket.on('privateTable', () => {
      setLoader(false);
      toast.error('Unable to join Private table', { id: 'A' });
    });
    socket.on('noAdmin', () => {
      setLoader(false);
      toast.error('Table host is not Available', { id: 'A' });
    });
    socket.on('tableOwner', (data) => {
      setLoader(false);
      setisAdmin(true);
      admin = true;
      roomData = data;
    });

    socket.on('noTable', () => {
      toast.error('No such table found', { id: 'A' });
      setLoader(false);
    });
    socket.on('alreadyStarted', () => {
      toast.error('Game already Started, Please comeback after some time', {
        id: 'alreadyStarted',
      });
      setTimeout(() => {
        window.location.href = window.location.origin + '/profile';
      }, 1000);
    });

    socket.on('newWatcher', () => {
      setLoader(false);
      setOnlywatcher(true);
    });

    socket.on('alreadyJoin', () => {
      toast.error('You are already in room', { id: 'A', duration: 1000 });
    });
    socket.on('hostApproval', () => {
      toast.success('Request send for Approval', { id: 'A', duration: 1000 });
    });

    socket.emit('roomFull', () => {
      setLoader(false);
      toast.error('Room is Full.', { id: 'full' });
      console.log('dfdfdfdf');
      setTimeout(() => {
        window.location.href = window.location.origin + '/profile';
      }, 1000);
    });

    socket.emit('notFound', () => {
      toast.error('Table not Found');
    });

    socket.on('newUser', (data) => {
      setLoader(false);
      if (data.allowWatcher) {
        setAllowWatcher(true);
      } else setNewUser(true);
    });

    socket.on('playerleft', (data) => {
      toast.success(data.msg, { id: 'A' });
    });

    socket.on('notAuthorized', () => {
      toast.error('Not Authorized', { id: 'A' });
      setLoader(false);
    });

    socket.on('noUser', () => {
      toast.error('No user found', { id: 'A' });
    });

    socket.on('joinrequest', (data) => {
      if (isAdmin) {
        toast(
          (toaster) => (
            <div className='custom-toaster'>
              <p>{data.player.name} is want to join table</p>
              <Button
                onClick={() => {
                  approveRequest(data);
                  toast.dismiss(toaster.id);
                }}>
                <img src={accept} alt='accept' />
              </Button>
              <Button
                onClick={() => {
                  cancelRequest(data);
                  toast.dismiss(toaster.id);
                }}
                className='reject-btn'>
                <img src={reject} alt='reject' />
              </Button>
            </div>
          ),
          { id: data.player.userid, duration: 200000 }
        );
      }
    });

    socket.on('actionperformed', (data) => {
      setActionText(data.action);
      setAction(true);
      // setCurrentPlayer(false)
    });

    socket.on('notification', (data) => {
      let pl =
        roomData &&
        roomData.players.find(
          (ele) => (ele.id ? ele.id : ele.userid) === data.id
        );
      toast.success(`${pl.name} made ${data.action}`, { id: 'info' });
    });

    socket.on('cancelJoinRequest', (data) => {
      // toast cancel join request
      // open join action panel
    });

    socket.on('approved', (data) => {
      if (data.playerid === userId) {
        toast.success('Join request is approved', { id: 'A' });
        setNewUser(false);
      } else {
        toast.success(`${data.name} join the table`, { id: 'B' });
      }
    });

    socket.on('rejected', (data) => {
      if (data.playerid === userId) {
        toast.error('Your join request is rejected', { id: 'A' });
        if (data.allowWatcher) {
          setAllowWatcher(true);
        } else setNewUser(true);
      }
    });

    socket.on('notEnoughPlayer', (data) => {
      toast.error('Atleast 3 player required to start the game', { id: 'A' });
    });

    socket.on('newhand', (data) => {
      roomData = data.updatedRoom;
      setStart(false);
      joinInRunningRound = false;
      setTablePot(roomData.tablePot);
      updatePlayer(roomData.players);
      setCommunityCards([]);
      setCurrentPlayer(false);
      setWinner(false);
      setWinnerText('');
      setAction(false);
      setActionText('');
      setHandMatch([]);
      if (roomData.hostId === userId) {
        setisAdmin(true);
        admin = true;
      }
    });

    socket.on('preflopround', (data) => {
      roomData = data;
      setTablePot(roomData.pot);
      setTimer(roomData.timer);

      updatePlayer(data.preflopround);
    });

    socket.on('flopround', (data) => {
      playAudio('collect');
      roomData = data;
      setTablePot(roomData.pot);

      setCommunityCards(data.communityCard);
      updatePlayer(data.flopround);
    });

    socket.on('turnround', (data) => {
      playAudio('collect');
      roomData = data;
      setCommunityCards(data.communityCard);

      setTablePot(roomData.pot);
      updatePlayer(data.turnround);
    });

    socket.on('riverround', (data) => {
      playAudio('collect');
      roomData = data;
      setCommunityCards(data.communityCard);

      setTablePot(roomData.pot);
      updatePlayer(data.riverround);
    });

    socket.on('winner', (data) => {
      roomData = data.updatedRoom;
      updatePlayer(roomData.showdown);
      setCurrentPlayer(false);
      showWinner(roomData.winnerPlayer, roomData.players);
    });

    socket.on('gameStarted', () => {
      toast.error('Game already started', { id: 'A' });
    });

    socket.on('gameFinished', () => {
      toast.error('Game already finished', { id: 'A' });
      setLoader(false);
      socket.emit('clearData', {
        tableId,
        gameType: gameCollection,
      });
      setTimeout(() => {
        window.location.href = `${window.location.origin}/profile`;
      }, 100);
    });

    socket.on('beingtimeout', (data) => {
      toast.error('being Timeout');
    });

    socket.on('automaticFold', (data) => {
      playAudio('fold');
      toast.error(data.msg, { id: 'A' });
    });

    socket.on('raise', (data) => {
      playAudio('bet');
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on('allin', (data) => {
      playAudio('bet');
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on('bet', (data) => {
      playAudio('bet');
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on('call', (data) => {
      playAudio('bet');
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on('check', (data) => {
      playAudio('check');
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on('fold', (data) => {
      playAudio('fold');
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on('updateGame', (data) => {
      setLoader(false);
      roomData = data.game;
      console.log('room =>', roomData);
      console.log({ userId });
      if (
        roomData.players.find((ele) => ele.userid === userId) &&
        !roomData.preflopround.find((ele) => ele.id === userId) &&
        roomData.runninground !== 0
      ) {
        joinInRunningRound = true;
      }
      setCommunityCards(data.communityCard);
      if (roomData.hostId === userId) {
        setisAdmin(true);
        admin = true;
      }
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
        setCommunityCards([]);
        setCurrentPlayer(false);
        setWinner(false);
        setWinnerText('');
        setAction(false);
        setActionText('');
        setHandMatch([]);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on('roomPaused', () => {
      toast.success('Game is Pause for Next Hand', { id: 'A' });
    });

    socket.on('roomFinished', (data) => {
      toast.success(data.msg, { id: 'A' });
      if (data.roomdata.runninground === 0) {
        setHandWinner(data.roomdata.handWinner);
        setModalShow(true);
      }
    });

    socket.on('onlyOnePlayingPlayer', (data) => {
      roomData = data.roomdata;
      updatePlayer(roomData.players);
    });
    socket.on('roomResume', () => {
      toast.success('Game is resumed for next hand', { id: 'A' });
    });

    socket.on('joinAndLeave', () => {
      window.location.reload();
    });

    socket.on('adminLeave', (data) => {
      if (userId === data.userId) {
        toast.success('Admin left the game, Now you are the Game Admin', {
          id: 'GameAdmin',
        });
      } else {
        toast.success(
          `Admin left the game, Now ${data.name} is the Game Admin`,
          { id: 'GameAdmin' }
        );
      }
    });

    socket.on('joinInRunningGame', (data) => {
      setLoader(false);
      if (data.playerId === userId) {
        joinInRunningRound = true;
        roomData = data.updatedRoom;
        setCommunityCards(data.communityCard);
        if (roomData.hostId === userId) {
          setisAdmin(true);
          admin = true;
        }
        if (roomData.runninground === 0) {
          updatePlayer(roomData.players);
          setCommunityCards([]);
          setCurrentPlayer(false);
          setWinner(false);
          setWinnerText('');
          setAction(false);
          setActionText('');
          setHandMatch([]);
        } else if (roomData.runninground === 1) {
          updatePlayer(roomData.preflopround);
        } else if (roomData.runninground === 2) {
          updatePlayer(roomData.flopround);
        } else if (roomData.runninground === 3) {
          updatePlayer(roomData.turnround);
        } else if (roomData.runninground === 4) {
          updatePlayer(roomData.riverround);
        } else if (roomData.runninground === 5) {
          updatePlayer(roomData.showdown);
        }
      }
    });

    socket.on('reload', () => {
      window.location.reload();
    });
  }, [isAdmin]);

  useEffect(() => {
    socket.on('timer', (data) => {
      setRemainingTime(data.playerchance);
      if (tPlayer !== data.id || tRound !== data.runninground) {
        if (timer === 0) {
          setTimer(roomData && roomData.timer);
        }
        setAction(false);
        setActionText(false);
        setPlayers((preState) => {
          setCurrentPlayer(preState.find((ele) => ele.id === data.id));
          handleActionButton(preState.find((ele) => ele.id === data.id));
          return preState;
        });
      }
      tPlayer = data.id;
      tRound = data.runninground;
    });
  }, [players]);

  useEffect(() => {
    if (currentPlayer && currentPlayer.id === userId) {
      playAudio('turn');
    }
  }, [currentPlayer]);

  const updatePlayer = (data) => {
    let availablePosition = [];
    switch (data.length) {
      case 1:
        availablePosition = [0];
        break;
      case 2:
        availablePosition = [0, 5];
        break;
      case 3:
        availablePosition = [0, 4, 6];
        break;
      case 4:
        availablePosition = [0, 4, 5, 6];
        break;
      case 5:
        availablePosition = [0, 3, 4, 6, 7];
        break;
      case 6:
        availablePosition = [0, 1, 4, 5, 6, 9];
        break;
      case 7:
        availablePosition = [0, 2, 3, 4, 6, 7, 8];
        break;
      case 8:
        availablePosition = [0, 1, 3, 4, 5, 6, 7, 9];
        break;
      case 9:
        availablePosition = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        break;
      case 10:
        availablePosition = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        break;
      default:
        break;
    }
    AvailablePosition = [...availablePosition];
    let whole = [];
    if (isWatcher || joinInRunningRound) {
      whole = [...data];
    } else {
      const index = data.findIndex(
        (ele) => (ele.id ? ele.id : ele.userid) === userId
      );
      if (index !== -1) {
        const split1 = data.slice(0, index + 1);
        const me = split1.pop();
        const split2 = data.slice(index + 1, data.length);
        whole.push(me);
        whole = whole.concat(split2).concat(split1);
      }
    }
    let playerDetails = [];
    whole.forEach((el, i) => {
      playerDetails.push({
        ...el,
        availablePosition: availablePosition[i],
        isDealer: roomData.dealerPosition === el.position ? true : false,
        isSmallBlind:
          roomData.smallBlindPosition === el.position ? true : false,
        isBigBlind: roomData.bigBlindPosition === el.position ? true : false,
        id: el.userid ? el.userid : el.id,
      });
    });
    setPlayers(playerDetails);
  };

  const showWinner = (data, players) => {
    data.forEach((item, i) => {
      if (i === 0) {
        let type = players.find((el) => el.userid === item.id);
        console.log('ietm  =>', type, players, item);
        setWinAnimationType(type.items);
        setWinner(item);
        playAudio('winner');
        if (item.handName) {
          setWinnerText(`${item.name} wins with ${item.handName}`);
          let newMatch = [];
          let hand = [];
          item.communityCards.forEach((card, j) => {
            let handCard = item.winnerHand.find((hand) => hand === card);
            if (handCard) {
              newMatch.push(j);
            }
          });
          item.winnerCards.forEach((card, j) => {
            let handCard = item.winnerHand.find((hand) => hand === card);
            if (handCard) {
              hand.push(j);
            }
          });
          hand.sort((a, b) => a - b);
          newMatch.sort((a, b) => a - b);
          setMatchCards(newMatch);
          setHandMatch(hand);
        } else if (!item.handName || item.name) {
          setWinnerText(`${item.name} wins before showdown`);
        }
        setTimeout(() => {
          setWinner(false);
        }, 4000);
      } else if (i > 0) {
        setTimeout(() => {
          let type = players.find((el) => el.id === item.id);
          setWinAnimationType(type?.items);
          setWinner(item);
          if (item.handName) {
            setWinnerText(`${item.name} wins with ${item.handName}`);
            let newMatch = [];
            item.communityCards.forEach((card, j) => {
              let handCard = item.winnerHand.find((hand) => hand === card);
              if (handCard) {
                newMatch.push(j);
              }
            });
            newMatch.sort((a, b) => a - b);
            setMatchCards(newMatch);
          } else if (!item.handName || item.name) {
            setWinnerText(`All player folded, ${item.name} Win`);
          }
          setTimeout(() => {
            setWinner(false);
          }, 4000);
        }, 5000);
      }
    });
    if (roomData.finish) {
      setHandWinner(roomData.handWinner);
    }
  };

  const startGame = () => {
    socket.emit('startPreflopRound', {
      tableId,
      userId,
    });
  };

  const joinGame = () => {
    socket.emit('joinGame', {
      tableId,
      userId,
      gameType: gameCollection,
    });
    setNewUser(false);
    setAllowWatcher(false);
  };

  const leaveWatcherJoinPlayer = () => {
    socket.emit('leaveWatcherJoinPlayer', {
      tableId,
      userId,
      gameType: gameCollection,
    });
    setNewUser(false);
    setAllowWatcher(false);
  };

  const joinWatcher = () => {
    socket.emit('joinWatcher', {
      tableId,
      userId,
      gameType: gameCollection,
    });
    setAllowWatcher(false);
    setNewUser(false);
    setOnlywatcher(false);
  };

  const approveRequest = (data) => {
    socket.emit('approveRequest', data);
    setNewUser(false);
  };

  const cancelRequest = (data) => {
    socket.emit('cancelRequest', data);
  };

  const callAction = () => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit('docall', {
      userid: userId,
      roomid: tableId,
      amount: roomData.raiseAmount,
    });
    setTimer(0);
  };

  const raiseAction = (x) => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit('doraise', {
      userid: userId,
      roomid: tableId,
      amount: roomData.raiseAmount * x,
    });
    setTimer(0);
  };

  const checkAction = () => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit('docheck', {
      userid: userId,
      roomid: tableId,
    });
    setTimer(0);
  };

  const betAction = (x) => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit('dobet', {
      userid: userId,
      roomid: tableId,
      amount: roomData.raiseAmount * x,
    });
    setTimer(0);
  };

  const allinAction = () => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit('doallin', {
      userid: userId,
      roomid: tableId,
      amount: currentPlayer.wallet,
    });
    setTimer(0);
  };

  const foldAction = () => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit('dofold', {
      userid: userId,
      roomid: tableId,
    });
    setTimer(0);
  };

  const finishGame = () => {
    socket.emit('dofinishgame', {
      userid: userId,
      roomid: tableId,
    });
  };

  const pauseGame = () => {
    socket.emit('dopausegame', {
      userid: userId,
      roomid: tableId,
    });
  };

  const resumeGame = () => {
    socket.emit('doresumegame', {
      userid: userId,
      roomid: tableId,
    });
  };

  const handleActionButton = (currentPlayer) => {
    setBet(false);
    setRaise(false);
    let currentAction = { ...openAction };
    const { pot, wallet } = currentPlayer ? currentPlayer : {};
    const {
      raiseAmount,
      lastAction,
      runninground: round,
    } = roomData ? roomData : {};
    currentAction.fold = true;
    if (round === 1) {
      if (wallet > raiseAmount * 2) {
        //range true
        currentAction.raise = true;
        currentAction.bet = false;

        if (raiseAmount === pot) {
          //check true
          currentAction.check = true;
        } else if (pot < raiseAmount) {
          //call true
          currentAction.call = true;
          currentAction.bet = false;
        }
      } else if (wallet <= raiseAmount * 2) {
        //allin true
        currentAction.allin = true;
        currentAction.raise = false;
      }
    }

    if (round >= 2) {
      if (lastAction === 'check') {
        currentAction.check = true;
      }

      if (lastAction === 'check') {
        if (raiseAmount > wallet) {
          currentAction.allin = true;
          currentAction.raise = false;
        } else {
          currentAction.call = false;
          currentAction.bet = true;
          currentAction.raise = false;
        }
      } else {
        if (raiseAmount < wallet) {
          currentAction.call = true;
          currentAction.bet = false;
          currentAction.check = false;
        }
        if (raiseAmount > wallet) {
          currentAction.allin = true;
          currentAction.raise = false;
        }
        if (raiseAmount * 2 < wallet) {
          currentAction.allin = false;
          currentAction.bet = false;
          currentAction.raise = true;
        }
      }
      if (wallet <= raiseAmount * 2) {
        currentAction.allin = true;
        currentAction.raise = false;
      }
      if (lastAction !== 'check' && pot !== raiseAmount) {
        currentAction.check = false;
      }
    }
    setOpenAction(() => {
      return currentAction;
    });
  };

  const playAudio = (type) => {
    if (type) {
      const audioEl = document.getElementsByClassName(`audio-${type}`)[0];
      if (audioEl) {
        audioEl.play();
      }
    }
    if (type === 'winner') {
      setTimeout(() => {
        setWinner(false);
      }, 10000);
    }
  };

  const sitout = () => {
    socket.emit('dositout', {
      tableId,
      userId,
      gameType: gameCollection,
    });
  };

  const sitin = () => {
    socket.emit('dositin', {
      tableId,
      userId,
      gameType: gameCollection,
    });
  };

  const leaveTable = () => {
    socket.emit('doleavetable', {
      tableId,
      userId,
      gameType: gameCollection,
      isWatcher: isWatcher,
    });
    window.location.href = `${window.location.origin}/profile`;
  };

  const leaveAndJoinAsWatcher = () => {
    socket.emit('leaveJoinWatcher', {
      tableId,
      userId,
      gameType: gameCollection,
    });
    setAllowWatcher(false);
    setNewUser(false);
  };

  const handleShowStore = (id) => {
    setShowStore(true);
    setSelectedUser(id);
  };

  useEffect(() => {
    socket.on('notInvited', () => {
      alert('This is a private table');
      history.push('/');
    });

    return () => {
      socket.off('notInvited');
    };
  }, [history]);

  return (
    <div className='poker' id={players.length}>
      <Helmet>
        <html
          className={`game-page ${
            !(players && players.find((ele) => ele.id === userId)) &&
            roomData &&
            roomData.players.find((ele) => ele.userid === userId)
              ? 'game-started-join'
              : ''
          }`}
        />
      </Helmet>
      <div className={`poker-bg ${loader ? 'loaderactive' : ''} `}>
        {loader && (
          <div className='poker-loader'>
            <img src={loaderImg} alt='loader-Las vegas' />{' '}
          </div>
        )}
        {roomData && roomData.watchers && roomData.watchers.length ? (
          <WatcherCount
            count={roomData && roomData.watchers && roomData.watchers.length}
          />
        ) : (
          ''
        )}

        <div className='container'>
          {isAdmin && !roomData?.public ? (
            <PlayPauseBtn
              pauseGame={pauseGame}
              finishGame={finishGame}
              resumeGame={resumeGame}
            />
          ) : (
            ''
          )}

          <div className={`poker-table ${winner ? 'winner-show' : ''}`}>
            {(players && players.find((ele) => ele.id === userId)) ||
            (roomData &&
              roomData.players.find((ele) => ele.userid === userId)) ||
            isWatcher ? (
              <div
                className={`poker-table-bg wow animate__animated animate__fadeIn count-${players?.length}`}>
                <TableLogo />
                <div className='start-game-btn'>
                  {isAdmin && roomData && !roomData.gamestart ? (
                    <>
                      <p>Click to start game</p>
                      {/* disabled={players && players.length <2} */}
                      <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                        {players && players.length >= 2 && (
                          <Button
                            onClick={() => {
                              setStart(true);
                              startGame();
                            }}
                            disabled={start}>
                            Start Game
                          </Button>
                        )}
                        {players && players.length < 2 && (
                          <OverlayTrigger
                            placement='bottom'
                            overlay={
                              <Tooltip id='tooltip-disabled'>
                                Please wait for the other friends to join
                              </Tooltip>
                            }>
                            <Button className='not-allowed'>Start Game</Button>
                          </OverlayTrigger>
                        )}
                      </div>
                    </>
                  ) : newUser ? (
                    <>
                      <p>Join table</p>
                      <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                        <Button onClick={() => joinGame()}>Join Game</Button>
                      </div>
                    </>
                  ) : allowWatcher ? (
                    <>
                      <p>Join as</p>
                      <div className='d-flex'>
                        <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                          <Button onClick={() => joinGame()}>Player</Button>
                        </div>
                        <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                          <Button onClick={() => joinWatcher()}>Watcher</Button>
                        </div>
                      </div>
                    </>
                  ) : onlywatcher ? (
                    <>
                      <p>Game started, Join as -</p>
                      <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                        <Button onClick={() => joinWatcher()}>Watcher</Button>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                  {roomData &&
                    roomData.runninground === 0 &&
                    !roomData.gamestart &&
                    !isAdmin && (
                      <p>Please wait for the Admin to "Start the game"</p>
                    )}
                  {roomData &&
                  roomData.handWinner.length === 0 &&
                  !roomData?.gamestart ? (
                    <p className='joined-player'>
                      Invited Players joined -{' '}
                      {roomData.players.filter((ele) =>
                        roomData.invPlayers.includes(ele.userid)
                      ).length + 1}
                      /{roomData.invPlayers.length + 1}
                    </p>
                  ) : (
                    ''
                  )}
                </div>
                {tablePot ? <TablePotMoney tablePot={tablePot} /> : ''}
                <GameMessage winnerText={winnerText} />

                <TableCard
                  winner={winner}
                  communityCards={communityCards}
                  matchCards={matchCards}
                />

                {!isWatcher &&
                  roomData &&
                  userId &&
                  players.map((player, i) => (
                    <Players
                      key={`item-${player.userid ? player.userid : player.id}`}
                      followingList={followingList}
                      friendList={friendList}
                      systemplayer={i === 0 ? true : false}
                      playerclass={`player${
                        player.availablePosition + 1
                      } wow animate__animated animate__zoomIn animate__delay-01s`}
                      playerData={player}
                      timer={timer}
                      action={action}
                      actionText={actionText}
                      remainingTime={remainingTime}
                      currentPlayer={currentPlayer}
                      winner={winner}
                      handMatch={handMatch}
                      message={message}
                      messageBy={messageBy}
                      betOn={betOn}
                      betWin={betWin}
                      tableId={tableId}
                      sitout={sitout}
                      sitin={sitin}
                      gameCollection={gameCollection}
                      showCoin={showCoin}
                      setShowCoin={setShowCoin}
                      setBuyinPopup={setBuyinPopup}
                      handleShowStore={handleShowStore}
                      winAnimationType={winAnimationType}
                      setShowFollowMe={setShowFollowMe}
                      setFriendList={setFriendList}
                      setFollowingList={setFollowingList}
                    />
                  ))}
              </div>
            ) : (
              <div className='poker-table-bg wow animate__animated animate__fadeIn'>
                <TableLogo />
                <div className='start-game-btn'>
                  {roomData ? (
                    !roomData.gamestart ? (
                      newUser ? (
                        <>
                          <p>Join table</p>
                          <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                            <Button onClick={() => joinGame()}>
                              Join Game
                            </Button>
                          </div>
                        </>
                      ) : allowWatcher ? (
                        <>
                          <p>Join as</p>
                          <div className='d-flex'>
                            <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                              <Button onClick={() => joinGame()}>Player</Button>
                            </div>
                            <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                              <Button onClick={() => joinWatcher()}>
                                Watcher
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : onlywatcher ? (
                        <>
                          <p>Game started, Join as -</p>
                          <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                            <Button onClick={() => joinWatcher()}>
                              Watcher
                            </Button>
                          </div>
                        </>
                      ) : (
                        ''
                      )
                    ) : gameCollection !== '' &&
                      gameCollection !== 'poker1vs1_Tables' &&
                      players.length < 10 &&
                      roomData &&
                      roomData.public ? (
                      <>
                        <p>Join as</p>
                        <div className='d-flex'>
                          <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                            <Button onClick={() => joinGame()}>Player</Button>
                          </div>
                          <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                            <Button onClick={() => joinWatcher()}>
                              Watcher
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : roomData &&
                      roomData.allowWatcher &&
                      roomData.gamestart ? (
                      <>
                        <p>Game started, Join as -</p>
                        <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                          <Button
                            onClick={() => {
                              joinWatcher();
                            }}>
                            Watcher
                          </Button>
                        </div>
                      </>
                    ) : (
                      ''
                    )
                  ) : newUser ? (
                    <>
                      <p>Join table</p>
                      <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                        <Button
                          onClick={() => {
                            joinGame();
                          }}>
                          Join Game
                        </Button>
                      </div>
                    </>
                  ) : allowWatcher ? (
                    <>
                      <p>Join as</p>
                      <div className='d-flex'>
                        <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                          <Button
                            onClick={() => {
                              joinGame();
                            }}>
                            Player
                          </Button>
                        </div>
                        <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                          <Button
                            onClick={() => {
                              joinWatcher();
                            }}>
                            Watcher
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : onlywatcher ? (
                    <>
                      <p>Game started, Join as -</p>
                      <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                        <Button onClick={() => joinWatcher()}>Watcher</Button>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            )}
          </div>
          <FooterButton
            bet={bet}
            setBet={setBet}
            raise={raise}
            setRaise={setRaise}
            isAdmin={isAdmin}
            startGame={startGame}
            betAction={betAction}
            callAction={callAction}
            foldAction={foldAction}
            raiseAction={raiseAction}
            checkAction={checkAction}
            allinAction={allinAction}
            joinGame={joinGame}
            newUser={newUser}
            currentPlayer={currentPlayer}
            action={action}
            openAction={openAction}
          />
        </div>
      </div>
      <div className='btn-toggler' onClick={handleBtnClick} role='presentation'>
        <img src={btntoggle} alt='' />
      </div>
      {((players &&
        players.length > 0 &&
        players.find((ele) => ele.id === userId)) ||
        isWatcher) &&
        btnToggle && (
          <ul className='btn-list'>
            <li>
              <span
                className='close-icon'
                onClick={() => handleBtnClick()}
                role='presentation'>
                <i className='fa fa-close' />
              </span>
            </li>
            <li>
              <OverlayTrigger
                placement='left'
                overlay={<Tooltip id='tooltip-disabled'>Leave</Tooltip>}>
                <button onClick={() => setLeaveConfirm(true)}>
                  <i class='fa fa-sign-out' aria-hidden='true' />
                </button>
              </OverlayTrigger>
            </li>
            {players &&
              players.length > 0 &&
              players.find((ele) => ele.id === userId) && (
                <li className=''>
                  <OverlayTrigger
                    placement='left'
                    overlay={<Tooltip id='tooltip-disabled'>Chat</Tooltip>}>
                    <button
                      onClick={() => {
                        handleClick(!open);
                        setBtnToggle(!btnToggle);
                      }}>
                      <i className='fa fa-comment' aria-hidden='true' />
                    </button>
                  </OverlayTrigger>
                </li>
              )}
            {isWatcher ? (
              ''
            ) : players &&
              players.length &&
              players.find((ele) => (ele.id ? ele.id : ele.userid) === userId)
                .playing ? (
              <li>
                <OverlayTrigger
                  placement='left'
                  overlay={<Tooltip id='tooltip-disabled'>Sit out</Tooltip>}>
                  <button onClick={() => sitout()}>
                    <img src={situp} alt='sit-in' />
                  </button>
                </OverlayTrigger>
              </li>
            ) : (
              <li>
                <OverlayTrigger
                  placement='left'
                  overlay={<Tooltip id='tooltip-disabled'>Sit in</Tooltip>}>
                  <button onClick={() => sitin()}>
                    <img src={sitdown} alt='sit-out' />
                  </button>
                </OverlayTrigger>
              </li>
            )}
            {gameCollection !== 'pokerTournament_Tables' && (
              <li>
                <OverlayTrigger
                  placement='left'
                  overlay={<Tooltip id='tooltip-disabled'>Add coins</Tooltip>}>
                  <button onClick={() => setShowCoin(true)}>
                    <img src={addcoin} alt='Add-coin' />
                  </button>
                </OverlayTrigger>
              </li>
            )}
            {((roomData && roomData.public) ||
              (isAdmin && roomData.gameType !== 'poker1vs1_Tables')) && (
              <li>
                <OverlayTrigger
                  placement='left'
                  overlay={
                    <Tooltip id='tooltip-disabled'>Invite Friends</Tooltip>
                  }>
                  <button onClick={() => setShowInvite(true)}>
                    {/* <img src={addcoin} alt="Invite friend" /> */}
                    <i className='fa fa-envelope'></i>
                  </button>
                </OverlayTrigger>
              </li>
            )}
          </ul>
        )}
      <Chat
        handleClick={handleClick}
        open={open}
        userId={userId}
        tableId={tableId}
      />
      {/* <div className="play-pause-button leave-btn"><div className="pause-btn"><Button >Leave</Button> </div></div> */}
      {isWatcher && (
        <div className='bet-button'>
          <span onClick={() => handleBetClick(!view)} role='presentation'>
            {' '}
            Place Bet <img src={arrow} alt='arrow' />
          </span>
        </div>
      )}

      <Bet
        handleBetClick={handleBetClick}
        view={view}
        setView={setView}
        players={players}
        watchers={watchers}
        roomData={roomData}
        userId={userId}
      />

      <LogoImage />
      <audio className='audio-winner'>
        <source src={winnerSound}></source>
      </audio>
      <audio className='audio-bet'>
        <source src={call}></source>
      </audio>
      <audio className='audio-turn'>
        <source src={myTurn}></source>
      </audio>
      <audio className='audio-bet'>
        <source src={fold}></source>
      </audio>
      <audio className='audio-collect'>
        <source src={collect}></source>
      </audio>
      <audio className='audio-check'>
        <source src={check}></source>
      </audio>
      <audio className='audio-chat'>
        <source src={chatBubble}></source>
      </audio>
      <StatsPopup
        modalShow={modalShow}
        setModalShow={setModalShow}
        handWinner={handWinner}
      />
      <LeaveConfirmPopup
        setLeaveConfirm={setLeaveConfirm}
        leaveConfirmShow={leaveConfirmShow}
        leaveTable={leaveTable}
        joinWatcher={leaveAndJoinAsWatcher}
        isWatcher={isWatcher}
        joinGame={leaveWatcherJoinPlayer}
        allowWatcher={allowWatcher}
      />
      {/* <NewBuyInPopup
        setBuyinPopup={setBuyinPopup}
        buyinPopup={buyinPopup}
        setModalShow={setShowCoin}
        leaveTable={leaveTable}
      /> */}
      <BuyInPopup
        setModalShow={setShowCoin}
        setBuyinPopup={setBuyinPopup}
        modalShow={showCoin}
        userId={userId}
        tableId={tableId}
        setNewJoinLowBalance={setNewJoinLowBalance}
        newJoinlowBalance={newJoinlowBalance}
        gameType={gameCollection}
        exchangeRate={exchangeRate}
      />
      <InviteFriend
        setShowInvite={setShowInvite}
        showInvite={showInvite}
        userId={userId}
        tableId={tableId}
        gameCollection={gameCollection}
        roomData={roomData}
      />
      <MarketStore
        showStore={showStore}
        setShowStore={setShowStore}
        userid={selectedUser}
        tableId={tableId}
      />
    </div>
  );
};

export default PokerTable;

const Players = ({
  winner,
  setBuyinPopup,
  playerclass,
  betOn,
  betWin,
  handMatch,
  message,
  messageBy,
  action,
  currentPlayer,
  playerData,
  actionText,
  timer,
  remainingTime,
  handleShowStore,
  winAnimationType,
  friendList,
  followingList,
  setFriendList,
  setFollowingList,
}) => {
  const [newPurchase, setNewPurchase] = useState(false);
  const [showFollowMe, setShowFollowMe] = useState(false);
  const [followClick, setFollowClick] = useState('');
  const target = useRef(null);
  useEffect(() => {
    const showBuyIn = () => {
      if (
        playerData &&
        playerData.id === userId &&
        playerData.wallet === 0 &&
        roomData &&
        roomData.runninground === 0 &&
        !roomData.buyin.find(
          (ele) => ele.userid === userId && ele.redeem === 0
        ) &&
        roomData.gameType !== 'pokerTournament_Tables'
      ) {
        setBuyinPopup(true);
      } else {
        setBuyinPopup(false);
      }
      if (
        playerData &&
        playerData.id === userId &&
        roomData &&
        roomData.buyin.find(
          (ele) => ele.userid === userId && ele.redeem === 0
        ) &&
        roomData.gameType !== 'pokerTournament_Tables'
      ) {
        setBuyinPopup(false);
        setNewPurchase(true);
      }
    };
    if (playerData && playerData.wallet === 0) {
      showBuyIn();
    }
    if (roomData && roomData.runninground === 0) {
      setNewPurchase(false);
    }
  }, [playerData, setBuyinPopup]);
  const { name, photoURI: playerImage } = playerData;

  const handleFollow = async (followerId, nickname) => {
    const Uid = followerId;
    toast.success('Following..', {
      id: 'please-wait',
      icon: '♠️',
      style: {
        borderRadius: '5px',
        background: '#333',
        color: '#fff',
      },
    });

    axios
      .get('https://follow-t3e66zpola-lz.a.run.app', {
        params: { frId: Uid },
        headers: { idtoken: idToken },
      })
      .then((response) => {
        setFollowClick('');
        if (response.data) {
          if (
            response.data.error === 'no error' &&
            response.data.success === true
          ) {
            setFollowingList((old) => [...old, followerId]);
            toast.success('You are now following @' + nickname, {
              id: 'follow-request',
              icon: '✔️',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }

          if (
            response.data.error === 'no error' &&
            response.data.success === true &&
            response.data.special ===
              'You have removed this follower in the past'
          ) {
            toast.success(
              'You are now following @' +
                nickname +
                ', notice that you removed him from following you',
              {
                id: 'follow-request',
                icon: '✔️',
                style: {
                  borderRadius: '5px',
                  background: '#333',
                  color: '#fff',
                },
              }
            );
          }

          if (response.data.error === 'already following him') {
            toast.success('You are aleady following @' + nickname, {
              id: 'follow-aleady',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }

          if (response.data.error === 'You are rejected follower') {
            toast.success('Request rejected by @' + nickname, {
              id: 'follow-rejected',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }

          if (response.data.error === 'You are rejected follower') {
            toast.success('You rejected @' + nickname + 'from following', {
              id: 'follow-aleady',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }

          if (response.data.error === 'you can not follow yourself') {
            toast.success('You can not follow yourself', {
              id: 'follow-yourself',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          } else if (response.data.error !== 'no error') {
            toast.success(response.data.eror, {
              duration: 6000,
              id: 'frined-already-sent',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }
        } else {
          console.log('backend response failed: ', response.statusText);
        }
      })
      .catch((error) => {
        console.log('Error req', error);
      });
  };
  const handleConnect = async (friendId, nickname) => {
    toast.success('Send friend request..', {
      id: 'please-wait',
      icon: '♠️',
      style: {
        borderRadius: '5px',
        background: '#333',
        color: '#fff',
      },
    });
    const FUid = friendId;
    const Fname = nickname;

    const IdTokenConst = idToken;
    const Uid = userId;
    axios
      .get('https://friend-reqest-t3e66zpola-uc.a.run.app', {
        params: { usid: Uid, frId: FUid },
        headers: { idtoken: IdTokenConst },
      })
      .then((response) => {
        console.log('Executing friend-request:');
        if (response.data) {
          if (response.data.error === 'already sent friend request') {
            toast.success(
              'Friend request already sent to @' +
                Fname +
                ' please wait ' +
                response.data.hours +
                ' hours before you can try again.',
              {
                duration: 6000,
                id: 'frined-already-sent',
                icon: '❌',
                style: {
                  borderRadius: '5px',
                  background: '#333',
                  color: '#fff',
                },
              }
            );
          }
          if (response.data.error === 'already friends') {
            toast.success('You and @' + Fname + ' already friends', {
              duration: 4000,
              id: 'frined-already-sent',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }
          if (
            response.data.error === 'no error' &&
            response.data.success === true
          ) {
            setFriendList((old) => [...old, friendId]);
            toast.success('Friend request successfully sent to @' + Fname, {
              duration: 4000,
              id: 'frined-request',
              icon: '✔️',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          } else if (response.data.error !== 'no error') {
            toast.success(response.data.eror, {
              duration: 6000,
              id: 'frined-already-sent',
              icon: '❌',
              style: {
                borderRadius: '5px',
                background: '#333',
                color: '#fff',
              },
            });
          }
          setFollowClick('');
        } else {
          console.log('Backend response failed: ', response.statusText);
        }
      })
      .catch((error) => {
        console.log('Error req', error);
      });
    console.log('It works my friend-request!!!');
  };

  return (
    <>
      <div
        onClick={() => {
          if (playerData?.id !== userId) {
            setShowFollowMe(!showFollowMe);
          }
        }}
        ref={target}
        key={playerData?.id}
        className={`players ${playerclass} ${
          winner && playerData && winner.id === playerData.id
            ? `winner-player`
            : ``
        } ${playerData && playerData.playing ? '' : 'not-playing'}`}>
        {/* start win or lose animation */}
        {/* {winner &&
      playerData &&
      winner.id !== playerData.id &&
      winAnimationType.activeWinAnimation.win !== "notFound" &&
      winAnimationType.level ? (
        <div className="win-animation"> */}
        {/* loser div */}
        {/* {`${winAnimationType.activeWinAnimation.type}-${
            winAnimationType.level
          } ${
            playerData.items.level > winAnimationType.level &&
            playerData.items["defence"][
              winAnimationType.activeWinAnimation.type
            ]
              ? "<"
              : ">"
          } ${
            winAnimationType.activeWinAnimation.type === "fart"
              ? "gas-mask"
              : winAnimationType.activeWinAnimation.type === "gun"
              ? "shield"
              : winAnimationType.activeWinAnimation.type === "dick"
              ? "umbrella"
              : ""
          }-${playerData.items.level}`}
          <span> */}
        {/* <img
                src={require(`../../assets/${
                  playerData.items.level > winAnimationType.level &&
                  playerData.items["defence"][
                    winAnimationType.activeWinAnimation.type
                  ]
                    ? playerData.items["defence"][
                        winAnimationType.activeWinAnimation.type
                      ] + playerData.items.level
                    : winAnimationType.activeWinAnimation.type +
                      winAnimationType.level
                }.gif`)}
                alt="animation effect"
              /> */}
        {/* </span>
        </div>
      ) : (
        ""
      )} */}

        {/* end of win or lose animation */}
        {currentPlayer &&
          playerData &&
          currentPlayer.id === playerData.id &&
          action && <span className='player-action'>{actionText}</span>}
        {/* {playerData.id !== userId && (
        <>
          <div className="store-btn">
            <Button onClick={() => handleShowStore(playerData.id)}>
              store
            </Button>
          </div>
        </>
      )} */}
        <div id={`store-item-${playerData.id}`}></div>
        <div className='player-box'>
          {winner && playerData && winner.id === playerData.id && (
            <div className='pyro'>
              <div className='before'></div>
              <div className='after'></div>
              <Lottie options={winImageanim} width={600} height={500} />
            </div>
          )}
          {playerData && (playerData.fold || !playerData.playing) ? (
            ''
          ) : roomData && roomData.runninground === 5 ? (
            <ShowCard
              cards={playerData.cards ? playerData.cards : []}
              handMatch={handMatch}
            />
          ) : roomData &&
            roomData.runninground >= 1 &&
            playerData.id === userId ? (
            <ShowCard
              cards={playerData.cards ? playerData.cards : []}
              handMatch={handMatch}
            />
          ) : roomData && roomData.runninground === 0 ? (
            ''
          ) : (
            <HideCard />
          )}
          <div
            className='player-pic'
            style={{
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}>
            {currentPlayer &&
              playerData &&
              currentPlayer.id === playerData.id && (
                <TimerSeparator time={timer} remainingTime={remainingTime} />
              )}
            <img src={playerData?.photoURI} alt='' />
          </div>

          <div className='player-info'>
            <h4>
              {playerData && playerData.name.length > 8
                ? playerData.name.substring(0, 8) + '..'
                : playerData.name}
            </h4>
            <p>
              {newPurchase
                ? 'Purchase'
                : numFormatter(playerData && playerData.wallet)}
            </p>
            {/* {userId === playerData.id && gameCollection !== 'pokerTournament_Tables' && } */}
          </div>
          {roomData &&
            roomData.runninground !== 0 &&
            playerData &&
            (playerData.isBigBlind ||
              playerData.isSmallBlind ||
              playerData.isDealer) && (
              <div className='player-badge'>
                {playerData.isSmallBlind
                  ? 'S'
                  : playerData.isBigBlind
                  ? 'B'
                  : playerData.isDealer
                  ? 'D'
                  : ''}
              </div>
            )}
          {playerData && playerData.pot > 0 && playerData !== undefined ? (
            <div className='player-chip'>
              <span>{numFormatter(playerData && playerData.pot)}</span>
            </div>
          ) : (
            ''
          )}

          {betOn && playerData && betOn === playerData.id ? (
            <WatcherResult betWin={betWin} />
          ) : (
            ''
          )}

          {betOn && playerData && betOn === playerData.id ? (
            <WatcherResult betWin={betWin} />
          ) : (
            ''
          )}
        </div>
        {playerData && playerData.id === messageBy && (
          <BubbleMessage message={message} />
        )}
      </div>
      {/* <Overlay
        target={target.current}
        show={showFollowMe}
        placement='right'
        rootClose={true}
        onHide={() => setShowFollowMe(false)}>
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            id='button-tooltip'
            className='tootltip player-tooltip'
            {...props}>
            <div className='tooltip-box'>
              <h5>
                {name}{' '}
                <img
                  className='country-flag'
                  src={
                    countryCode
                      ? `https://countryflagsapi.com/png/${countryCode}`
                      : 'https://countryflagsapi.com/png/us'
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultFlag;
                  }}
                  alt='country-flag'
                />
              </h5>
              <div className='tooltip-content'>
                <img src={playerImage} alt='las-vegas-player' />
                <div className='player-details-content'>
                  <p>
                    Level - <span>{Level}</span>
                  </p>
                  <p>
                    Win - <span>{total.win}</span>
                  </p>
                  <p>
                    Win ratio - <span>{total.wl_ratio.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <p>
                Win coins - <span>{max.winCoins}</span>
              </p>
              <p>
                Game played - <span>{total.games}</span>
              </p>
              <div className='action-tooltip'>
                <Button
                  className='btn-gold'
                  disabled={
                    followingList.find((ele) => ele === playerData.id) ||
                    followClick
                  }
                  onClick={() => {
                    setFollowClick('follow');
                    handleFollow(playerData.id, playerData.name);
                  }}>
                  {followClick === 'follow' ? (
                    <Spinner animation='border' />
                  ) : (
                    'Follow'
                  )}
                </Button>
                <Button
                  className='btn-dark'
                  onClick={() => {
                    setFollowClick('friend');
                    handleConnect(playerData.id, playerData.name);
                  }}
                  disabled={
                    friendList.find((ele) => ele === playerData.id) ||
                    followClick
                  }>
                  {followClick === 'friend' ? (
                    <Spinner animation='border' />
                  ) : (
                    'Add Friend'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Overlay> */}
    </>
  );
};

const TableCard = ({ winner, communityCards, matchCards }) => {
  return (
    <div className={`table-card ${winner ? 'winner-show' : ''}`}>
      {communityCards &&
        communityCards.map((card, i) => (
          <img
            key={`item-${i}`}
            src={
              require(`../../assets/cards/${card.toUpperCase()}.svg`).default
            }
            alt='card'
            className={`${
              winner && matchCards.findIndex((ele) => ele === i) !== -1
                ? `winner-card`
                : ``
            } flip-vertical-left duration-${i}`}
          />
        ))}
    </div>
  );
};

const TablePotMoney = ({ tablePot }) => {
  return (
    <div className='total-pot-money wow animate__animated animate__fadeInDown  animate__delay-02s'>
      <span>{numFormatter(tablePot && tablePot)}</span>
    </div>
  );
};

const TableLogo = () => {
  return (
    <div className='poker-logo'>
      <img
        src={logo}
        alt='logo'
        className='wow animate__animated animate__pulse'
      />
    </div>
  );
};

const FooterButton = ({
  bet,
  setBet,
  openAction,
  raise,
  currentPlayer,
  setRaise,
  betAction,
  callAction,
  foldAction,
  allinAction,
  raiseAction,
  checkAction,
}) => {
  return (
    <div className='footer-button'>
      <div className='container'>
        <div className='footer-container'>
          {currentPlayer && currentPlayer.id === userId ? (
            <>
              {openAction.fold && (
                <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                  <Button onClick={() => foldAction()}>Fold</Button>
                </div>
              )}
              {openAction.call && (
                <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                  <Button onClick={() => callAction()}>Call</Button>
                </div>
              )}

              {openAction.bet && (
                <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                  {bet && (
                    <BetView
                      currentPlayer={currentPlayer}
                      setBet={setBet}
                      betAction={betAction}
                      allinAction={allinAction}
                    />
                  )}
                  <Button
                    onClick={() => {
                      setBet(true);
                      setRaise(false);
                    }}>
                    Bet
                  </Button>
                </div>
              )}
              {openAction.allin && (
                <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                  <Button onClick={() => allinAction()}>All In</Button>
                </div>
              )}
              {openAction.raise && (
                <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                  {raise && (
                    <RaiseView
                      currentPlayer={currentPlayer}
                      setRaise={setRaise}
                      raiseAction={raiseAction}
                      allinAction={allinAction}
                    />
                  )}
                  <Button
                    onClick={() => {
                      setBet(false);
                      setRaise(true);
                    }}>
                    Raise
                  </Button>
                </div>
              )}
              {openAction.check && (
                <div className='footer-btn wow animate__animated animate__zoomIn animate__delay-01s'>
                  <Button onClick={() => checkAction()}>Check</Button>
                </div>
              )}
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

const BetView = ({ currentPlayer, setBet, betAction, allinAction }) => {
  return (
    <div className='bet-view'>
      {roomData &&
        currentPlayer &&
        roomData.raiseAmount <= currentPlayer.wallet && (
          <span
            onClick={() => {
              betAction(1);
              setBet(false);
            }}>
            1x
          </span>
        )}
      {roomData &&
        currentPlayer &&
        roomData.raiseAmount * 2 <= currentPlayer.wallet && (
          <span
            onClick={() => {
              betAction(2);
              setBet(false);
            }}>
            2x
          </span>
        )}
      {roomData &&
        currentPlayer &&
        roomData.raiseAmount * 4 <= currentPlayer.wallet && (
          <span
            onClick={() => {
              betAction(4);
              setBet(false);
            }}>
            4x
          </span>
        )}
      {roomData &&
        currentPlayer &&
        roomData.raiseAmount * 6 <= currentPlayer.wallet && (
          <span
            onClick={() => {
              betAction(6);
              setBet(false);
            }}>
            6x
          </span>
        )}
      <span
        onClick={() => {
          allinAction();
          setBet(false);
        }}>
        All in
      </span>
      <div
        className='close-bet'
        role='presentation'
        onClick={() => setBet(false)}>
        x
      </div>
    </div>
  );
};

const RaiseView = ({ currentPlayer, setRaise, raiseAction, allinAction }) => {
  return (
    <div className='bet-view'>
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >= roomData.raiseAmount * 2 && (
          <span
            onClick={() => {
              raiseAction(2);
              setRaise(false);
            }}>
            2x
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >= roomData.raiseAmount * 4 && (
          <span
            onClick={() => {
              raiseAction(4);
              setRaise(false);
            }}>
            4x
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >= roomData.raiseAmount * 6 && (
          <span
            onClick={() => {
              raiseAction(6);
              setRaise(false);
            }}>
            6x
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >= roomData.raiseAmount * 8 && (
          <span
            onClick={() => {
              raiseAction(8);
              setRaise(false);
            }}>
            8x
          </span>
        )}
      <span
        onClick={() => {
          allinAction();
          setRaise(false);
        }}>
        All in
      </span>
      <div
        className='close-bet'
        role='presentation'
        onClick={() => setRaise(false)}>
        x
      </div>
    </div>
  );
};

const PlayPauseBtn = ({ pauseGame, resumeGame, finishGame }) => {
  const [isFinishClick, setisFinishClick] = useState(false);
  return (
    <div className='play-pause-button'>
      {roomData && roomData.autoNextHand ? (
        roomData.pause ? (
          <div className='play-btn wow animate__animated animate__zoomIn animate__delay-3-1s'>
            <Button onClick={() => resumeGame()}>Resume</Button>
          </div>
        ) : (
          <div className='play-btn wow animate__animated animate__zoomIn animate__delay-3-1s'>
            <Button onClick={() => pauseGame()}>Pause</Button>
          </div>
        )
      ) : (
        ''
      )}

      {!showFinish && (
        <div className='pause-btn wow animate__animated animate__zoomIn animate__delay-1s'>
          <Button
            onClick={() => {
              finishGame();
              setisFinishClick(true);
            }}
            disabled={isFinishClick}>
            Finish
          </Button>
        </div>
      )}
    </div>
  );
};

const HideCard = () => {
  return (
    <div className='player-card'>
      <img src={front} alt='card' />
      <img src={back} alt='card' />
    </div>
  );
};

const ShowCard = ({ cards, handMatch }) => {
  return (
    <div className='show-card'>
      {cards &&
        cards.map((card, i) => (
          <img
            key={`item-${card}`}
            src={
              require(`../../assets/cards/${card.toUpperCase()}.svg`).default
            }
            alt='card'
            className={`${
              handMatch.findIndex((ele) => ele === i) !== -1
                ? ``
                : `winner-card`
            } wow animate__animated animate__zoomIn animate__delay-02s`}
          />
        ))}
    </div>
  );
};

const GameMessage = ({ winnerText }) => {
  return (
    <div className='game-msg'>
      <p className={winnerText !== '' ? 'winner-text' : ''}>{winnerText}</p>
    </div>
  );
};

// const Timer = ({ systemplayer, timer, remainingTime }) => {
//   return (
//     <div className="player-timer">
//       {!systemplayer && timer !== 0 ?
//         <CountdownCircleTimer
//           isPlaying
//           size={120}
//           duration={timer}
//           strokeWidth={6}
//           trailColor="transparent"
//           colors={[
//             ['#ff0000'],
//           ]}
//         >
//           {() => remainingTime}
//         </CountdownCircleTimer>

//         : timer !== 0 ?
//           <CountdownCircleTimer
//             isPlaying
//             size={140}
//             duration={timer}
//             strokeWidth={6}
//             trailColor="transparent"
//             colors={[
//               ['#ff0000'],
//             ]}
//           >
//             {() => remainingTime}
//           </CountdownCircleTimer> : ''
//       }
//     </div>
//   )
// }

const BubbleMessage = ({ message }) => {
  return (
    <div className='bubble-msg'>
      <div className='triangle-isosceles left'>{message}</div>
    </div>
  );
};

const LogoImage = () => {
  return (
    <div className='logo--bottom-image'>
      <img src={footerlogo} alt='footer-logo' />
    </div>
  );
};

const RenderTooltip = ({ playerData }) => {
  const {
    name,
    photoURI: playerImage,
    stats: { total, max, Level },
  } = playerData;

  return (
    <div id='button-tooltip' className='tootltip player-tooltip'>
      <div className='tooltip-box'>
        <h5>{name}</h5>
        <div className='tooltip-content'>
          <img src={playerImage} alt='las-vegas-player' />
          <div className='player-details-content'>
            <p>
              Level - <span>{Level}</span>
            </p>
            <p>
              Win - <span>{total.win}</span>
            </p>
            <p>
              Win ratio - <span>{total.wl_ratio.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <p>
          Win coins - <span>{max.winCoins}</span>
        </p>
        <p>
          Game played - <span>{total.games}</span>
        </p>
      </div>
    </div>
  );
};

const WatcherCount = ({ count }) => {
  return (
    <OverlayTrigger
      placement='right'
      delay={{ show: 250, hide: 200 }}
      overlay={WatcherTooltip(
        roomData && roomData.watchers && roomData.watchers.length
      )}>
      <div className='watcher-count'>
        <div className='watcher-icon'>
          <svg width='25' height='25' viewBox='0 0 30 30' version='1.1'>
            <defs>
              <path
                d='M0,15.089434 C0,16.3335929 5.13666091,24.1788679 14.9348958,24.1788679 C24.7325019,24.1788679 29.8697917,16.3335929 29.8697917,15.089434 C29.8697917,13.8456167 24.7325019,6 14.9348958,6 C5.13666091,6 0,13.8456167 0,15.089434 Z'
                id='outline'></path>
              <mask id='mask'>
                <rect width='100%' height='100%' fill='#000000'></rect>
                <use id='lid' fill='black' />
              </mask>
            </defs>
            <g id='eye'>
              <path
                d='M0,15.089434 C0,16.3335929 5.13666091,24.1788679 14.9348958,24.1788679 C24.7325019,24.1788679 29.8697917,16.3335929 29.8697917,15.089434 C29.8697917,13.8456167 24.7325019,6 14.9348958,6 C5.13666091,6 0,13.8456167 0,15.089434 Z M14.9348958,22.081464 C11.2690863,22.081464 8.29688487,18.9510766 8.29688487,15.089434 C8.29688487,11.2277914 11.2690863,8.09740397 14.9348958,8.09740397 C18.6007053,8.09740397 21.5725924,11.2277914 21.5725924,15.089434 C21.5725924,18.9510766 18.6007053,22.081464 14.9348958,22.081464 L14.9348958,22.081464 Z M18.2535869,15.089434 C18.2535869,17.0200844 16.7673289,18.5857907 14.9348958,18.5857907 C13.1018339,18.5857907 11.6162048,17.0200844 11.6162048,15.089434 C11.6162048,13.1587835 13.1018339,11.593419 14.9348958,11.593419 C15.9253152,11.593419 14.3271242,14.3639878 14.9348958,15.089434 C15.451486,15.7055336 18.2535869,14.2027016 18.2535869,15.089434 L18.2535869,15.089434 Z'
                fill='#000000'></path>
              <use mask='url(#mask)' fill='#000000' />
            </g>
          </svg>
        </div>
        <span>{count}</span>
      </div>
    </OverlayTrigger>
  );
};

const WatcherTooltip = (props) => {
  return (
    <Tooltip id='button-tooltip' className='tootltip player-tooltip' {...props}>
      <div className='tooltip-box'>
        <p>{props} watchers</p>
      </div>
    </Tooltip>
  );
};

const WatcherResult = ({ betWin }) => {
  return (
    <div className='watcher-results'>
      {betWin ? (
        <div className='watcher-win showing'>
          <img src={winnericon} alt='' />
        </div>
      ) : (
        <div className='watcher-loss showing'>
          <img src={loseicon} alt='' />
        </div>
      )}
    </div>
  );
};

const TimerSeparator = ({ time, remainingTime }) => {
  const [activeTime, setActiveTime] = useState(100);
  useEffect(() => {
    if (remainingTime && time) {
      let percent = (remainingTime / time) * 100;
      setActiveTime(parseInt(percent));
    }
  }, [remainingTime]);
  return (
    <div class='battery'>
      <CircularProgressbar
        counterClockwise
        value={activeTime}
        strokeWidth={50}
        styles={buildStyles({
          strokeLinecap: 'butt',
        })}
      />
    </div>
  );
};
