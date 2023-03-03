/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import "animate.css";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import ProgressBar from "react-animated-progress-bar";
import ProgressBar from "react-bootstrap/ProgressBar";
import "react-circular-progressbar/dist/styles.css";
// import Lottie from "react-lottie";
import front from "../../assets/game/Black-Card.png";
import back from "../../assets/game/Black-Card.png";
import back2 from "../../assets/game/Black-Card2.png";
import { socket } from "../../config/socketConnection";
import accept from "../../assets/checked.png";
import reject from "../../assets/close.png";
import Chat from "../chat/chat";
import winnerSound from "../../assets/Poker Sfx/winSoundPoker.mp3";
import call from "../../assets/Poker Sfx/Chip Bet/bet.wav";
import collect from "../../assets/Poker Sfx/Collect Chips/collect.wav";
import check from "../../assets/Poker Sfx/Check/check.mp3";
import chatBubble from "../../assets/Poker Sfx/ChatBubble.wav";
import fold from "../../assets/Poker Sfx/Fold.mp3";
import myTurn from "../../assets/Poker Sfx/MyTurn.wav";
import arrow from "../../assets/left-arrow.png";
import Bet from "../bet/bet";
import "./table.css";
import footerlogo from "../../assets/game/logo-poker.png";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import winnericon from "../../assets/win-icon.png";
import loseicon from "../../assets/loss-icon.png";
import StatsPopup from "./statsPopup";
import BuyInPopup from "./buyInPopup";
import LeaveConfirmPopup from "./leaveConfirmPopup";
import "./tablepopup.css";
import btntoggle from "../../assets/btnmenu.png";
import sitdown from "../../assets/sit-in.png";
import situp from "../../assets/sit-out.png";
// import addcoin from "../../assets/add-coin.png";
import loaderImg from "../../assets/chat/loader1.webp";
import InviteFriend from "./InviteFriend";
import Helmet from "react-helmet";
import MarketStore from "../MarketPlace/marketStore";
import axios from "axios";
import winImage from "../../assets/animation/win.json";
import userUtils from "./../../utils/user";
import { useHistory } from "react-router-dom";
import CONSTANTS from "../../config/contants";
import { getCookie } from "../../utils/cookieUtil";
// import bluechip from "../../assets/chips/blue.png";
// import blackchip from "../../assets/chips/black.png";
// import redchip from "../../assets/chips/red.png";
import BetView from "../bet/betView";
import RaiseView from "../bet/raiseView";
import coinWinning from "../../assets/animation/22.gif";
import { pokerInstance } from "../../utils/axios.config";
import RaiseSlider from "../bet/raiseSlider";
import AdvanceActionBtn from "../bet/advanceActionBtns";
import ChatHistory from "../chat/chatHistory";
import UsersComments from "../../assets/comenting.svg";
import AddCoinIcon from "../SVGfiles/coinSVG";
import { MuteIcon, VolumeIcon } from "../SVGfiles/soundSVG";
import EnterAmountPopup from "./enterAmountPopup";
import { logDOM } from "@testing-library/react";

const getQueryParams = () => {
  const url = new URLSearchParams(window.location.search);
  return {
    tableid: url.get("tableid") || "",
    gameCollection: url.get("gameCollection") || url.get("gamecollection"),
  };
};
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
let interval;
let retryCount = 0;

const numFormatter = (num) => {
  if (num > 1 && num < 999) {
    return (num / 1)?.toFixed(0); // convert to K for number from > 1000 < 1 million
  } else if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(2) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
  } else if (num >= 100000000 && num < 1000000000000) {
    return (num / 100000000).toFixed(2) + "B";
  } else if (num >= 1000000000000)
    return (num / 1000000000000).toFixed(2) + "T";
  else return num; // if value < 1000, nothing to do
};

const PokerTable = (props) => {
  const [currentPlayer, setCurrentPlayer] = useState();
  const [action, setAction] = useState(false);
  const [actionText, setActionText] = useState("");
  const [winner, setWinner] = useState(false);
  const [bet, setBet] = useState();
  const [raise, setRaise] = useState();
  const [tableId, setTableId] = useState();
  const [players, setPlayers] = useState([]);
  const [tablePot, setTablePot] = useState("");
  const [isAdmin, setisAdmin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [communityCards, setCommunityCards] = useState([]);
  const [newUser, setNewUser] = useState(false);
  const [winnerText, setWinnerText] = useState("");
  const [remainingTime, setRemainingTime] = useState();
  const [handMatch, setHandMatch] = useState([]);
  const [matchCards, setMatchCards] = useState([]);
  const [messageBy, setMessageBy] = useState();
  const [message, setMessage] = useState("");
  const [allowWatcher, setAllowWatcher] = useState(false);
  const [watchers, setWatchers] = useState([]);
  const [betOn, setBetOn] = useState("");
  const [betWin, setBetWin] = useState(false);
  const [onlywatcher, setOnlywatcher] = useState(false);
  const [gameCollection, setGameCollection] = useState("");
  const [handWinner, setHandWinner] = useState([]);
  const [showCoin, setShowCoin] = useState(false);
  const [loader, setLoader] = useState(false);
  const [start, setStart] = useState(false);
  const [mergeAnimationState, setMergeAnimationState] = useState(false);
  const [newJoinlowBalance, setNewJoinLowBalance] = useState(false);
  const [volume, setVolume] = useState(true);
  const [userData, setUserData] = useState(null);
  const [playersLeft, setPlayerLeft] = useState([]);
  const [playersRight, setPlayersRight] = useState([]);
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
  const [refillSitInAmount, setRefillSitInAmount] = useState(false);
  const [showEnterAmountPopup, setShowEnterAmountPopup] = useState(false);
  const [leaveConfirmShow, setLeaveConfirm] = useState(false);
  const [buyinPopup, setBuyinPopup] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [tentativeAction, setTentativeAction] = useState();
  const handleClick = (e) => {
    setOpen(e);
  };
  const [view, setView] = useState();
  const [btnToggle, setBtnToggle] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [winAnimationType, setWinAnimationType] = useState("");
  const [showFollowMe, setShowFollowMe] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [noOfPrevMessages, setNoOfPrevMessages] = useState(0);
  const [unReadMessages, setUnReadMessages] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [openChatHistory, setOpenChatHistory] = useState(false);

  const handleBtnClick = () => {
    setBtnToggle(!btnToggle);
  };

  const handleBetClick = (e) => {
    setView(e);
  };

  const scrollDownRef = useRef(null);

  const scrollToBottom = () => {
    scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    setTableId(urlParams.get("tableid"));
    setGameCollection(
      urlParams.get("gameCollection") || urlParams.get("gamecollection")
    );
  }, []);

  useEffect(() => {
    const tryReconnect = () => {
      setTimeout(() => {
        socket.io.open((err) => {
          // console.log("Socket open");
          if (err) {
            console.log("reconnect err => ", err);
            tryReconnect();
          } else {
            let urlParams = new URLSearchParams(window.location.search);
            let table = urlParams.get("tableid");
            // console.log({ table });
            let type =
              urlParams.get("gameCollection") ||
              urlParams.get("gamecollection");
            socket.emit("checkTable", {
              gameId: table,
              userId,
              gameType: type,
              dataFrom: "reconnect",
            });
            setLoader(true);
          }
        });
      }, 2000);
    };
    socket.io.on("close", tryReconnect);
  }, []);

  useEffect(() => {
    const isLoggedIn = async () => {
      let urlParams = new URLSearchParams(window.location.search);
      let user;
      if (
        !localStorage.getItem("token") &&
        !urlParams.get("token") &&
        !getCookie("token")
      ) {
        return (window.location.href = `${CONSTANTS.landingClient}`);
      }

      user = await userUtils.getAuthUserData();

      if (!user.success) {
        return (window.location.href = `${CONSTANTS.landingClient}`);
      }
      userId = user?.data.user?.id;
      let table = urlParams.get("tableid");
      let type =
        urlParams.get("gameCollection") || urlParams.get("gamecollection");
      userId = user?.data.user?.id;
      setUserData(user.data.user);

      try {
        if (table) {
          const playerInTable = await pokerInstance().get(
            `/checkUserInTable/${table}`
          );

          console.log("RommData", roomData);
          if (playerInTable?.data?.players?.find((el) => el.id === userId)) {
            socket.emit("checkTable", {
              gameId: table,
              userId: user?.data.user?.id,
              gameType: type,
              sitInAmount: 0,
            });

            // setLoader(true);
            // Ask user to type wallet amount
          } else {
            // Enter sit in amount popup
            setShowEnterAmountPopup(true);
          }
        }
        // const checkIfAlreadyInTable = await pokerInstance().get('/checkUserInTable/' + table)
        // console.log({ checkIfAlreadyInTable: checkIfAlreadyInTable.data })
        // socket.emit("checkTable", {
        // socket.emit("checkTable", {
        //   gameId: table,
        //   userId: user?.data.user?.id,
        //   gameType: type,
        // });
        setLoader(true);
      } catch (error) {
        console.log("error", error);
      }
    };

    isLoggedIn();
  }, []);

  // Sometimes start game and other button was not showing
  // when creating a new game so checking on interval if user
  // player are on the table or not
  // if not for waiting a limited time
  // We should reload the page
  // useEffect(() => {
  //   if (!Array.isArray(players) || !players.length) {
  //     interval = setInterval(async () => {
  //       console.log({ retryCount });
  //       if (retryCount === 1) {
  //         window.location.reload();
  //         return;
  //       }

  //       retryCount = +1;
  //       let urlParams = new URLSearchParams(window.location.search);
  //       let user;
  //       if (
  //         !localStorage.getItem("token") &&
  //         !urlParams.get("token") &&
  //         !getCookie("token")
  //       ) {
  //         // return (window.location.href = `${CONSTANTS.landingClient}`);
  //       }

  //       user = await userUtils.getAuthUserData();
  //       console.log("USER DATA HERE -------", { user });

  //       if (!user.success) {
  //         // return (window.location.href = `${CONSTANTS.landingClient}`);
  //       }
  //       userId = user?.data.user?.id;
  //       let table = urlParams.get("tableid");
  //       let type =
  //         urlParams.get("gameCollection") || urlParams.get("gamecollection");
  //       console.log({ userId, table, type, socket });

  //       socket.emit("checkTable", {
  //         gameId: table,
  //         userId: user?.data.user?.id,
  //         gameType: type,
  //       });
  //       setLoader(true);
  //     }, 8000);
  //   } else if (interval) {
  //     clearInterval();
  //   }

  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [players]);

  useEffect(() => {
    socket.on("roomFull", () => {
      setLoader(false);
      toast.error("Room already full", { id: "full" });
      setTimeout(() => {
        window.location.href = window.location.origin + "/";
      }, 1000);
    });

    socket.on("notFound", (data) => {
      toast.error("Table not Found");
      if (
        data?.message === "Game not found. Either game is finished or not exist"
      ) {
        setTimeout(() => {
          window.location.href = window.location.origin;
        }, 500);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("userId", async (data) => {
      userId = data;
    });
    socket.on("newMessage", (data) => {
      playAudio("chat");
      setMessage(() => {
        return data.message;
      });
      setMessageBy(() => {
        return data.userId;
      });

      setTimeout(() => {
        setMessage("");
        setMessageBy(null);
      }, 10000);
    });
    socket.on("lowBalance", (data) => {
      setLoader(false);
      if (data.userid === userId) {
        toast(
          (toaster) => (
            <div className="custom-toaster low-balance">
              <p>Wallet has low balance, Unable to join</p>
            </div>
          ),
          { id: "A", duration: 2000 }
        );
        setNewJoinLowBalance(true);
        setBuyinPopup(true);
      }
    });

    socket.on("watcherbet", (data) => {
      setBetOn(data.player.id);
      setBetWin(data.betType);
    });

    socket.on("OnlyOne", (data) => {
      toast.error("Only One player, please wait for othe to join", { id: "A" });
      setStart(false);
      setTablePot(data.tablePot);

      updatePlayer(data.players);
      if (data.hostId === userId) {
        setisAdmin(true);
        admin = true;
      }
    });

    socket.on("newWatcherJoin", (data) => {
      setLoader(false);
      if (data.watcherId === userId) {
        toast.success("Joined as Watcher", { id: "A" });
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

    socket.on("actionError", (data) => {
      console.log("actionErroractionError", data);
    });
    socket.on("sitInOut", (data) => {
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
    socket.on("privateTable", () => {
      setLoader(false);
      toast.error("Unable to join Private table", { id: "A" });
    });
    socket.on("noAdmin", () => {
      setLoader(false);
      toast.error("Table host is not Available", { id: "A" });
    });
    socket.on("tableOwner", (data) => {
      setLoader(false);
      setisAdmin(true);
      admin = true;
      roomData = data;
    });

    socket.on("noTable", () => {
      toast.error("No such table found", { id: "A" });
      setLoader(false);
    });
    socket.on("alreadyStarted", () => {
      toast.error("Game already Started, Please comeback after some time", {
        id: "alreadyStarted",
      });
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
    });

    socket.on("newWatcher", () => {
      setLoader(false);
      setOnlywatcher(true);
    });

    socket.on("alreadyJoin", () => {
      toast.error("You are already in room", { id: "A", duration: 1000 });
    });
    socket.on("hostApproval", () => {
      toast.success("Request send for Approval", { id: "A", duration: 1000 });
    });

    socket.on("newUser", (data) => {
      setLoader(false);
      if (data.allowWatcher) {
        setAllowWatcher(true);
      } else setNewUser(true);
    });

    socket.on("playerleft", (data) => {
      toast.success(data.msg, { id: "A" });
    });

    socket.on("notAuthorized", () => {
      toast.error("Not Authorized", { id: "A" });
      setLoader(false);
    });

    socket.on("noUser", () => {
      toast.error("No user found", { id: "A" });
    });

    socket.on("joinrequest", (data) => {
      if (isAdmin) {
        toast(
          (toaster) => (
            <div className="custom-toaster">
              <p>{data.player.name} is want to join table</p>
              <Button
                onClick={() => {
                  approveRequest(data);
                  toast.dismiss(toaster.id);
                }}
              >
                <img src={accept} alt="accept" />
              </Button>
              <Button
                onClick={() => {
                  cancelRequest(data);
                  toast.dismiss(toaster.id);
                }}
                className="reject-btn"
              >
                <img src={reject} alt="reject" />
              </Button>
            </div>
          ),
          { id: data.player.userid, duration: 200000 }
        );
      }
    });

    socket.on("actionperformed", (data) => {
      setActionText(data.action);
      setAction(true);
      // setCurrentPlayer(false)
    });

    socket.on("notification", (data) => {
      let pl =
        roomData &&
        roomData.players.find(
          (ele) => (ele.id ? ele.id : ele.userid) === data.id
        );
      toast.success(`${pl.name} made ${data.action}`, { id: "info" });
    });

    socket.on("cancelJoinRequest", (data) => {
      // toast cancel join request
      // open join action panel
    });

    socket.on("approved", (data) => {
      if (data.playerid === userId) {
        toast.success("Join request is approved", { id: "A" });
        setNewUser(false);
      } else {
        toast.success(`${data.name} join the table`, { id: "B" });
      }
    });

    socket.on("rejected", (data) => {
      if (data.playerid === userId) {
        toast.error("Your join request is rejected", { id: "A" });
        if (data.allowWatcher) {
          setAllowWatcher(true);
        } else setNewUser(true);
      }
    });

    socket.on("notEnoughPlayer", (data) => {
      toast.error("Atleast 3 player required to start the game", { id: "A" });
    });

    socket.on("newhand", (data) => {
      roomData = data?.updatedRoom;      
      setStart(false);
      joinInRunningRound = false;
      setTablePot(roomData?.tablePot);
      updatePlayer(roomData?.players);
      setCommunityCards([]);
      setCurrentPlayer(false);
      setWinner(false);
      setWinnerText("");
      setAction(false);
      setActionText("");
      setHandMatch([]);
      if (roomData?.hostId === userId) {
        setisAdmin(true);
        admin = true;
      }
         if(roomData.eleminated.length >0){
          if(roomData.eleminated.find((el)=>el.userid.toString() ===userId.toString())){
            history.push('/')
           }
         }
    });

    socket.on("preflopround", (data) => {
      roomData = data;
      setTablePot(roomData.pot);
      setTimer(roomData.timer);

      updatePlayer(data.preflopround);
    });

    socket.on("flopround", (data) => {
      setMergeAnimationState(true);
      setTimeout(() => {
        setMergeAnimationState(false);
        playAudio("collect");
        roomData = data;
        setTablePot(roomData.pot);

        setCommunityCards(data?.communityCard);
        updatePlayer(data.flopround);
      }, 400);
    });

    socket.on("turnround", (data) => {
      setMergeAnimationState(true);
      setTimeout(() => {
        setMergeAnimationState(false);
        playAudio("collect");
        roomData = data;
        setCommunityCards(data?.communityCard);

        setTablePot(roomData.pot);
        updatePlayer(data.turnround);
      }, 400);
    });

    socket.on("riverround", (data) => {
      setMergeAnimationState(true);
      setTimeout(() => {
        setMergeAnimationState(false);
        playAudio("collect");
        roomData = data;
        setCommunityCards(data?.communityCard);

        setTablePot(roomData.pot);
        updatePlayer(data.riverround);
      }, 400);
    });

    socket.on("winner", (data) => {
      roomData = data.updatedRoom;
      updatePlayer(roomData.showdown);
      setCurrentPlayer(false);
      showWinner(roomData.winnerPlayer, roomData.players);
    });

    socket.on("gameStarted", () => {
      toast.error("Game already started", { id: "A" });
    });

    socket.on("gameFinished", () => {
      toast.error("Game already finished", { id: "A" });
      setLoader(false);
      socket.emit("clearData", {
        tableId,
        gameType: gameCollection,
      });
      setTimeout(() => {
        window.location.href = `${window.location.origin}`;
      }, 100);
    });

    socket.on("beingtimeout", (data) => {
      toast.error("being Timeout");
    });

    socket.on("automaticFold", (data) => {
      playAudio("fold");
      toast.error(data.msg, { id: "A" });
    });

    socket.on("raise", (data) => {
      playAudio("bet");
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

    socket.on("allin", (data) => {
      playAudio("bet");
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

    socket.on("bet", (data) => {
      playAudio("bet");
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

    socket.on("call", (data) => {
      playAudio("bet");
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

    socket.on("check", (data) => {
      playAudio("check");
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

    socket.on("fold", (data) => {
      playAudio("fold");
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

    socket.on("updateGame", (data) => {
      setLoader(false);
      roomData = data.game;
      setChatMessages(data.game.chats);
      // console.log("room =>", roomData);
      // console.log({ userId });
      if (
        roomData.players.find((ele) => ele.userid === userId) &&
        !roomData.preflopround.find((ele) => ele.id === userId) &&
        roomData.runninground !== 0
      ) {
        joinInRunningRound = true;
      }
      setCommunityCards(data?.communityCard);
      if (roomData.hostId === userId) {
        setisAdmin(true);
        admin = true;
      }
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
        setCommunityCards([]);
        setCurrentPlayer(false);
        setWinner(false);
        setWinnerText("");
        setAction(false);
        setActionText("");
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

    socket.on("roomPaused", () => {
      toast.success("Game is Pause for Next Hand", { id: "A" });
    });

    socket.on("roomFinished", (data) => {
      toast.success(data.msg, { id: "A" });
      if (data.roomdata.runninground === 0) {
        setHandWinner(data.roomdata.handWinner);
        setModalShow(true);
      }
    });

    socket.on("onlyOnePlayingPlayer", (data) => {
      roomData = data.roomdata;
      updatePlayer(roomData.players);
      setStart(false);
      toast.success(
        "Only one player is eligible to play and poker needs atleast two player to play",
        { id: "onlyOnePlayingPlayer" }
      );
    });
    socket.on("roomResume", () => {
      toast.success("Game is resumed for next hand", { id: "A" });
    });

    socket.on("joinAndLeave", () => {
      window.location.reload();
    });

    socket.on("adminLeave", (data) => {
      if (userId === data.userId) {
        toast.success("Admin left the game, Now you are the Game Admin", {
          id: "GameAdmin",
        });
      } else {
        toast.success(
          `Admin left the game, Now ${data.name} is the Game Admin`,
          { id: "GameAdmin" }
        );
      }
    });

    socket.on("notEnoughBalance", (data) => {
      toast.error(data.message);
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
    });

    socket.on("inOtherGame", (data) => {
      toast.error(data.message);
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
    });

    socket.on("joinInRunningGame", (data) => {
      setLoader(false);
      if (data.playerId === userId) {
        joinInRunningRound = true;
        roomData = data.updatedRoom;
        setCommunityCards(data?.communityCard);
        if (roomData.hostId === userId) {
          setisAdmin(true);
          admin = true;
        }
        if (roomData.runninground === 0) {
          updatePlayer(roomData.players);
          setCommunityCards([]);
          setCurrentPlayer(false);
          setWinner(false);
          setWinnerText("");
          setAction(false);
          setActionText("");
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

    socket.on("reload", () => {
      window.location.reload();
    });
  }, [isAdmin]);

  const handleTentativeActionAuto = (player) => {
    let event;
    const { tentativeAction } = player;
    if (player?.tentativeAction.includes(" ")) {
      const [event1] = tentativeAction.split(" ");
      event = event1;
    } else {
      event = tentativeAction;
    }
    switch (event) {
      case "check":
        socket.emit("docheck", { userid: player.id, roomid: tableId });
        break;
      case "fold":
        socket.emit("dofold", { userid: player.id, roomid: tableId });
        break;
      case "check/fold":
        if (
          roomData.lastAction === "check" ||
          roomData.raiseAmount === player.pot
        ) {
          socket.emit("docheck", { userid: player.id, roomid: tableId });
        } else {
          socket.emit("dofold", { userid: player.id, roomid: tableId });
        }
        break;
      case "call":
        if (
          roomData.lastAction === "check" ||
          roomData.raiseAmount === player.pot
        ) {
          socket.emit("docheck", { userid: player.id, roomid: tableId });
        } else {
          socket.emit("docall", {
            userid: player.id,
            roomid: tableId,
            amount: roomData.raiseAmount,
          });
        }
        break;
      case "callAny":
        if (
          roomData.lastAction === "check" ||
          roomData.raiseAmount === player.pot
        ) {
          socket.emit("docheck", { userid: player.id, roomid: tableId });
        } else {
          socket.emit("docall", {
            userid: player.id,
            roomid: tableId,
            amount: roomData.raiseAmount,
          });
        }

        break;
      case "allin":
        if (
          roomData?.lastAction === "check" ||
          roomData?.raiseAmount === player?.pot
        ) {
          socket.emit("docheck", { userid: player?.id, roomid: tableId });
        } else {
          socket.emit("doallin", {
            userid: player?.id,
            roomid: tableId,
            amount: player?.wallet,
          });
        }
        break;

      default:
        return "";
    }
  };

  useEffect(() => {
    setCommunityCards(roomData?.communityCard);
    socket.on("timer", (data) => {
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
  }, [players, currentPlayer]);

  useEffect(() => {
    if (currentPlayer && currentPlayer.id === userId) {
      playAudio("turn");
    }
  }, [currentPlayer]);

  useEffect(() => {
    socket.on("updateChat", (data) => {
      setChatMessages(data.chat);
      let nesMsgCount = 0;
      data.chat.forEach((chatObj, i) => {
        if (chatObj.seenBy.indexOf(userId) < 0 && chatObj.userId !== userId)
          nesMsgCount++;
      });
      if (openChatHistory) {
        socket.emit("updateChatIsReadWhileChatHistoryOpen", {
          userId,
          tableId,
          openChatHistory,
        });
        nesMsgCount = 0;
      }
      setUnReadMessages(nesMsgCount);
    });
  });

  const updatePlayer = (data) => {
    let availablePosition = [];
    const pl = [...data];
    let players = [...pl];
    const pRight = pl.slice(0, Math.ceil(pl.length / 2));
    const pleft = pl.slice(Math.ceil(pl.length / 2)).reverse();
    setPlayerLeft(pleft);
    setPlayersRight(pRight);

    switch (data.length) {
      case 1:
        availablePosition = [0];
        break;
      case 2:
        availablePosition = [0, 5];
        break;
      case 3:
        availablePosition = [0, 4, 5];
        break;
      case 4:
        availablePosition = [0, 2, 4, 7];
        break;
      case 5:
        availablePosition = [0, 2, 4, 5, 7];
        break;
      case 6:
        availablePosition = [0, 2, 3, 4, 6, 7];
        break;
      case 7:
        availablePosition = [0, 1, 2, 3, 6, 7, 8];
        break;
      case 8:
        availablePosition = [0, 1, 2, 3, 4, 6, 7, 8];
        break;
      case 9:
        availablePosition = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        break;
      // case 10:
      //   availablePosition = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      //   break;
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
        setWinAnimationType(type.items);
        setWinner(item);
        playAudio("winner");
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
    socket.emit("startPreflopRound", {
      tableId,
      userId,
    });
  };

  const joinGame = () => {
    socket.emit("joinGame", {
      tableId,
      userId,
      gameType: gameCollection,
    });
    setNewUser(false);
    setAllowWatcher(false);
  };

  const leaveWatcherJoinPlayer = () => {
    socket.emit("leaveWatcherJoinPlayer", {
      tableId,
      userId,
      gameType: gameCollection,
    });
    setNewUser(false);
    setAllowWatcher(false);
  };

  const joinWatcher = () => {
    socket.emit("joinWatcher", {
      tableId,
      userId,
      gameType: gameCollection,
    });
    setAllowWatcher(false);
    setNewUser(false);
    setOnlywatcher(false);
  };

  const approveRequest = (data) => {
    socket.emit("approveRequest", data);
    setNewUser(false);
  };

  const cancelRequest = (data) => {
    socket.emit("cancelRequest", data);
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
    socket.emit("docall", {
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
    socket.emit("doraise", {
      userid: userId,
      roomid: tableId,
      amount: x,
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
    socket.emit("docheck", {
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
    socket.emit("dobet", {
      userid: userId,
      roomid: tableId,
      amount: x,
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
    socket.emit("doallin", {
      userid: userId,
      roomid: tableId,
      amount: currentPlayer?.wallet,
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
    socket.emit("dofold", {
      userid: userId,
      roomid: tableId,
    });
    setTimer(0);
  };

  const finishGame = () => {
    socket.emit("dofinishgame", {
      userid: userId,
      roomid: tableId,
    });
  };

  const pauseGame = () => {
    socket.emit("dopausegame", {
      userid: userId,
      roomid: tableId,
    });
  };

  const resumeGame = () => {
    socket.emit("doresumegame", {
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
      if (lastAction === "check") {
        currentAction.check = true;
      }

      if (lastAction === "check") {
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
      if (lastAction !== "check" && pot !== raiseAmount) {
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
    if (type === "winner") {
      setTimeout(() => {
        setWinner(false);
      }, 10000);
    }
  };

  const sitout = () => {
    socket.emit("dositout", {
      tableId,
      userId,
      gameType: gameCollection,
    });
  };

  const sitin = () => {
    socket.emit("dositin", {
      tableId,
      userId,
      gameType: gameCollection,
    });
  };

  const leaveTable = () => {
    socket.emit("doleavetable", {
      tableId,
      userId,
      gameType: gameCollection,
      isWatcher: isWatcher,
      action: "Leave",
    });
    window.location.href = `${window.location.origin}`;
  };

  const leaveAndJoinAsWatcher = () => {
    socket.emit("leaveJoinWatcher", {
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
    socket.on("notInvited", () => {
      alert("This is a private table");
      history.push("/");
    });
    return () => {
      socket.off("notInvited");
    };
  }, [history]);

  useEffect(() => {
    socket.on("tablefull", (data) => {
      toast.error(data?.message);
      setTimeout(() => {
        history.push("/");
      }, 2000);
    });
    return () => {
      socket.off("tablefull");
    };
  }, [history]);
  useEffect(() => {
    socket.on("roomchanged", (data) => {
      const { newRoomId } = data;
      if (newRoomId) {
        history.push({
          pathname: "/table",
          search: "?gamecollection=poker&tableid=" + newRoomId,
        });
      }
    });
  }, [history]);
  useEffect(() => {
    socket.on("eleminated", (data) => {
      console.log("Eleminated detail--->", data);
      const { roomDetail } = data;
      if (roomDetail) {
        if(roomDetail?.players((el)=>el?.userid?.toString() !== userId?.toString())){
          history.push('/');
        }
      }
    });
  }, [history]);
  //   const toggleFullscreen = () => {
  //     let ele = document.getElementsByClassName("poker")[0]
  //     if (ele.requestFullscreen) {
  //       ele.requestFullscreen();
  //     } else if (ele.webkitRequestFullscreen) { /* Safari */
  //     ele.webkitRequestFullscreen();
  //     } else if (ele.msRequestFullscreen) { /* IE11 */
  //     ele.msRequestFullscreen();
  //     }
  //     // window?.requestFullscreen().then(console.log).catch(console.log);
  //    }

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       toggleFullscreen()
  //     }, 1000);
  //     return () => clearTimeout(timer);
  // }, []);

  const handleOpenChatHistory = () => {
    socket.emit("updateChatIsRead", { userId, tableId });
    setNoOfPrevMessages(chatMessages.length);
    setUnReadMessages(0);
    setOpenChatHistory(!openChatHistory);
  };

  const handleTentativeAction = (e) => {
    const {
      target: { value, checked },
    } = e;

    if (tentativeAction === value) {
      setTentativeAction("");
    } else {
      setTentativeAction(value);
    }
    socket.emit("playerTentativeAction", {
      gameId: tableId,
      userId,
      playerAction: checked ? value : null,
    });
  };

  useEffect(() => {
    // console.log("currentPlayer", currentPlayer);

    if (currentPlayer?.tentativeAction && currentPlayer?.id === userId) {
      handleTentativeActionAuto(currentPlayer);
    }
    // setTentativeAction("");
  }, [currentPlayer, userId]);

  const wrapperRef = useRef();

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setBtnToggle(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideAlerter(wrapperRef);

  const handleSitInAmount = async (amount) => {
    if (refillSitInAmount) {
      return handleReffill(amount);
    } else {
      handleSitin(amount);
    }
  };

  const handleSitin = (sitInAmount) => {
    let urlParams = getQueryParams();
    let table = urlParams["tableid"];
    let type = urlParams["gameCollection"] || urlParams["gamecollection"];

    if (!tableId) {
      setTableId(table);
    }

    if (!userData) {
      return (window.location.href = window.location.origin);
    }

    if (parseFloat(sitInAmount) > userData.wallet) {
      toast.error("You don't have enough balance.", {
        id: "notEnoughSitIn",
      });
      // setTimeout(() => {
      //   window.location.href = window.location.origin;
      // }, 1000);
      return;
    } else if (parseFloat(sitInAmount) < 0) {
      toast.error("Amount is not valid.", {
        id: "notEnoughSitIn",
      });
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
      return;
    } else if (/\d/.test(sitInAmount)) {
      socket.emit("checkTable", {
        gameId: table,
        userId: userId,
        gameType: type,
        sitInAmount: parseFloat(sitInAmount),
      });
      setShowEnterAmountPopup(false);
      // setRetryIfUserNotJoin(true);

      setLoader(true);
    } else {
      toast.error("Not valid amount.", {
        id: "notEnoughSitIn",
      });
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
      return;
    }
  };

  const handleReffill = async (amount) => {
    console.log("RefelAmount", userData.wallet);
    let user = await userUtils.getAuthUserData();

    try {
      if (parseFloat(amount) > user?.data?.user?.wallet) {
        toast.error("You don't have enough balance.", {
          id: "notEnoughSitIn",
        });
        return;
      } else {
        const data = await pokerInstance().post("/refillWallet", {
          tableId,
          amount,
        });
        toast.success(`Your wallet will update in next hand ${amount}`);
        setRefillSitInAmount(false);
        updatePlayer(data?.data?.roomData.players);

        return "success";
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data.msg || "Some error occured";
      }
      return "Failed to refill";
    }
  };

  const raiseInSliderAction = (x) => {
    if (x >= roomData?.raiseAmount) {
      setOpenAction({
        bet: false,
        call: false,
        raise: false,
        check: false,
        allin: false,
        fold: false,
      });

      socket.emit("doraise", {
        userid: userId,
        roomid: tableId,
        amount: x,
      });
    } else {
      toast.error(`Raise amount must be minimum ${roomData?.raiseAmount}`);
    }
  };
  const betInSliderAction = (x) => {
    // console.log("BetAmount", x);
    if (x >= roomData.raiseAmount) {
      setOpenAction({
        bet: false,
        call: false,
        raise: false,
        check: false,
        allin: false,
        fold: false,
      });

      socket.emit("dobet", {
        userid: userId,
        roomid: tableId,
        amount: x,
      });
    } else {
      toast.error(`Raise amount must be minimum ${roomData?.raiseAmount}`);
    }
  };

  return (
    <div className="poker" id={players.length}>
      <Helmet>
        <html
          className={`game-page ${
            !(players && players.find((ele) => ele.id === userId)) &&
            roomData &&
            roomData.players.find((ele) => ele.userid === userId)
              ? "game-started-join"
              : ""
          }`}
        />
      </Helmet>

      <div
        className={
          !(players && players.find((ele) => ele.id === userId)) &&
          roomData &&
          roomData.players.find((ele) => ele.userid === userId)
            ? "backToHome"
            : "notShow"
        }
      >
        <button onClick={() => setLeaveConfirm(true)}>
          <i class="fa fa-sign-out" aria-hidden="true" />
        </button>
      </div>
      <div className={`poker-bg ${loader ? "loaderactive" : ""} `}>
        {loader && (
          <div className="poker-loader">
            <img src={loaderImg} alt="loader-Las vegas" />{" "}
          </div>
        )}
        {roomData && roomData.watchers && roomData.watchers.length ? (
          <WatcherCount
            count={roomData && roomData.watchers && roomData.watchers.length}
          />
        ) : (
          ""
        )}

        <div className="container">
          {isAdmin && !roomData?.public ? (
            <PlayPauseBtn
              pauseGame={pauseGame}
              finishGame={finishGame}
              resumeGame={resumeGame}
            />
          ) : (
            ""
          )}
          <div className={`poker-table ${winner ? "winner-show" : ""}`}>
            <div className="containerFor-chatHistory">
              <div className="chatHistory-icon" onClick={handleOpenChatHistory}>
                {unReadMessages > 0 && (
                  <p className="ChatHistory-count">{unReadMessages}</p>
                )}
                <img src={UsersComments} alt="" />
              </div>
              <ChatHistory
                setOpenChatHistory={setOpenChatHistory}
                openChatHistory={openChatHistory}
                handleOpenChatHistory={handleOpenChatHistory}
                userId={userId}
                roomData={roomData}
                chatMessages={chatMessages}
                scrollToBottom={scrollToBottom}
                scrollDownRef={scrollDownRef}
              />
            </div>
            {(players && players.find((ele) => ele.id === userId)) ||
            (roomData &&
              roomData.players.find((ele) => ele.userid === userId)) ||
            isWatcher ? (
              <div
                className={`poker-table-bg wow animate__animated animate__fadeIn player-count-${players?.length}`}
              >
                {!roomData?.gamestart && !newUser && (
                  <div className="start-game">
                    <div className="start-game-btn">
                      {isAdmin && roomData && !roomData?.gamestart ? (
                        <>
                          <p>Click to start game</p>
                          {/* disabled={players && players.length <2} */}
                          <div className="footer-btn ">
                            {players && players.length >= 2 && (
                              <Button
                                onClick={() => {
                                  setStart(true);
                                  startGame();
                                }}
                                disabled={start}
                              >
                                Start Game
                              </Button>
                            )}
                            {players && players.length < 2 && (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="tooltip-disabled">
                                    Please wait for the other friends to join
                                  </Tooltip>
                                }
                              >
                                <Button className="not-allowed">
                                  Start Game
                                </Button>
                              </OverlayTrigger>
                            )}
                          </div>
                        </>
                      ) : newUser ? (
                        <>
                          <p>Join table</p>
                          <div className="footer-btn ">
                            <Button onClick={() => joinGame()}>
                              Join Game
                            </Button>
                          </div>
                        </>
                      ) : allowWatcher ? (
                        <>
                          <p>Join as</p>
                          <div className="d-flex">
                            <div className="footer-btn ">
                              <Button onClick={() => joinGame()}>Player</Button>
                            </div>
                            <div className="footer-btn ">
                              <Button onClick={() => joinWatcher()}>
                                Watcher
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : onlywatcher ? (
                        <>
                          <p>Game started, Join as -</p>
                          <div className="footer-btn ">
                            <Button onClick={() => joinWatcher()}>
                              Watcher
                            </Button>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {roomData &&
                        roomData?.runninground === 0 &&
                        !roomData?.gamestart &&
                        !isAdmin &&
                        !roomData?.tournament && (
                          <>
                            <p>Please wait for the Admin to Start the game</p>
                          </>
                        )}
                      {roomData &&
                      roomData.handWinner.length === 0 &&
                      !roomData?.gamestart ? (
                        <>
                          <p className="joined-player">
                            Invited Players joined -{" "}
                            {roomData.players.filter((ele) =>
                              roomData.invPlayers.includes(ele.userid)
                            ).length + 1}
                            /{roomData.invPlayers.length + 1}
                          </p>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
                {tablePot ? <TablePotMoney tablePot={tablePot} /> : ""}
                <GameMessage winnerText={winnerText} />

                <TableCard
                  winner={winner}
                  communityCards={communityCards}
                  matchCards={matchCards}
                  roomData={roomData}
                />

                {!isWatcher &&
                  roomData &&
                  userId &&
                  players.map((player, i) => (
                    <Players
                      mergeAnimationState={mergeAnimationState}
                      key={`item-${player.userid ? player.userid : player.id}`}
                      followingList={followingList}
                      friendList={friendList}
                      systemplayer={i === 0 ? true : false}
                      playerclass={`player${player.availablePosition + 1}`}
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
                      tablePot={tablePot}
                    />
                  ))}
              </div>
            ) : (
              <div className="poker-table-bg wow animate__animated animate__fadeIn">
                <div className="start-game-btn">
                  {roomData ? (
                    !roomData?.gamestart ? (
                      newUser ? (
                        <>
                          <p>Join table</p>
                          <div className="footer-btn">
                            <Button onClick={() => joinGame()}>
                              Join Game
                            </Button>
                          </div>
                        </>
                      ) : allowWatcher ? (
                        <>
                          <p>Join as</p>
                          <div className="d-flex">
                            <div className="footer-btn ">
                              <Button onClick={() => joinGame()}>Player</Button>
                            </div>
                            <div className="footer-btn ">
                              <Button onClick={() => joinWatcher()}>
                                Watcher
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : onlywatcher ? (
                        <>
                          <p>Game started, Join as -</p>
                          <div className="footer-btn ">
                            <Button onClick={() => joinWatcher()}>
                              Watcher
                            </Button>
                          </div>
                        </>
                      ) : (
                        ""
                      )
                    ) : gameCollection !== "" &&
                      gameCollection !== "poker1vs1_Tables" &&
                      players.length < 10 &&
                      roomData &&
                      roomData.public ? (
                      <>
                        <p>Join as</p>
                        <div className="d-flex">
                          <div className="footer-btn ">
                            <Button onClick={() => joinGame()}>Player</Button>
                          </div>
                          <div className="footer-btn ">
                            <Button onClick={() => joinWatcher()}>
                              Watcher
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : roomData &&
                      roomData.allowWatcher &&
                      roomData?.gamestart ? (
                      <>
                        <p>Game started, Join as -</p>
                        <div className="footer-btn ">
                          <Button
                            onClick={() => {
                              joinWatcher();
                            }}
                          >
                            Watcher
                          </Button>
                        </div>
                      </>
                    ) : (
                      ""
                    )
                  ) : newUser ? (
                    <>
                      <p>Join table</p>
                      <div className="footer-btn ">
                        <Button
                          onClick={() => {
                            joinGame();
                          }}
                        >
                          Join Game
                        </Button>
                      </div>
                    </>
                  ) : allowWatcher ? (
                    <>
                      <p>Join as</p>
                      <div className="d-flex">
                        <div className="footer-btn ">
                          <Button
                            onClick={() => {
                              joinGame();
                            }}
                          >
                            Player
                          </Button>
                        </div>
                        <div className="footer-btn ">
                          <Button
                            onClick={() => {
                              joinWatcher();
                            }}
                          >
                            Watcher
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : onlywatcher ? (
                    <>
                      <p>Game started, Join as -</p>
                      <div className="footer-btn ">
                        <Button onClick={() => joinWatcher()}>Watcher</Button>
                      </div>
                    </>
                  ) : (
                    ""
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
            roomData={roomData}
            handleTentativeAction={handleTentativeAction}
            tentativeAction={tentativeAction}
            setTentativeAction={setTentativeAction}
            loader={loader}
            raiseInSliderAction={raiseInSliderAction}
            betInSliderAction={betInSliderAction}
            playersRight={playersRight}
            playersLeft={playersLeft}
            players={players}
          />
        </div>
      </div>

      <div className="btn-toggler" onClick={handleBtnClick} role="presentation">
        <img src={btntoggle} alt="" />
      </div>
      {((players &&
        players.length > 0 &&
        players.find((ele) => ele.id === userId)) ||
        isWatcher) &&
        btnToggle && (
          <ul className="btn-list" ref={wrapperRef}>
            <li>
              <span
                className="close-icon"
                onClick={() => handleBtnClick()}
                role="presentation"
              >
                <i className="fa fa-close" />
              </span>
            </li>
            <li>
              <OverlayTrigger
                placement="left"
                overlay={<Tooltip id="tooltip-disabled">Leave</Tooltip>}
              >
                <button onClick={() => setLeaveConfirm(true)}>
                  <i class="fa fa-sign-out" aria-hidden="true" />
                </button>
              </OverlayTrigger>
            </li>
            {players &&
              players.length > 0 &&
              players.find((ele) => ele.id === userId) && (
                <li className="">
                  <OverlayTrigger
                    placement="left"
                    overlay={<Tooltip id="tooltip-disabled">Chat</Tooltip>}
                  >
                    <button
                      onClick={() => {
                        handleClick(!open);
                        setBtnToggle(!btnToggle);
                      }}
                    >
                      <i className="fa fa-comment" aria-hidden="true" />
                    </button>
                  </OverlayTrigger>
                </li>
              )}
            {isWatcher ? (
              ""
            ) : players &&
              players.length &&
              players.find((ele) => (ele.id ? ele.id : ele.userid) === userId)
                .playing ? (
              <li>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip id="tooltip-disabled">Stood up</Tooltip>}
                >
                  <button onClick={() => sitout()}>
                    <img src={situp} alt="sit-in" />
                  </button>
                </OverlayTrigger>
              </li>
            ) : (
              <li>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip id="tooltip-disabled">Sat down</Tooltip>}
                >
                  <button onClick={() => sitin()}>
                    <img src={sitdown} alt="sit-out" />
                  </button>
                </OverlayTrigger>
              </li>
            )}
            {((roomData && roomData.public) ||
              (isAdmin && roomData.gameType !== "poker1vs1_Tables")) && (
              <li>
                <OverlayTrigger
                  placement="left"
                  overlay={
                    <Tooltip id="tooltip-disabled">Invite Friends</Tooltip>
                  }
                >
                  <button onClick={() => setShowInvite(true)}>
                    {/* <img src={addcoin} alt="Invite friend" /> */}
                    <i className="fa fa-envelope"></i>
                  </button>
                </OverlayTrigger>
              </li>
            )}
            {roomData?.tournament ? (
              ""
            ) : (
              <li>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip id="tooltip-disabled">Fill Tokens</Tooltip>}
                >
                  <button onClick={() => setRefillSitInAmount(true)}>
                    <AddCoinIcon />
                  </button>
                </OverlayTrigger>
              </li>
            )}
            <li>
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip id="tooltip-disabled">
                    {volume ? "Mute" : "Speaker"}
                  </Tooltip>
                }
              >
                <button onClick={() => setVolume(!volume)}>
                  {volume ? <MuteIcon /> : <VolumeIcon />}
                </button>
              </OverlayTrigger>
            </li>
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
        <div className="bet-button">
          <span onClick={() => handleBetClick(!view)} role="presentation">
            Place Bet <img src={arrow} alt="arrow" />
          </span>
        </div>
      )}
      <EnterAmountPopup
        handleSitin={handleSitInAmount}
        showEnterAmountPopup={showEnterAmountPopup || refillSitInAmount}
        submitButtonText={refillSitInAmount ? "Refill Tokens" : "Join"}
        setShow={
          refillSitInAmount ? setRefillSitInAmount : setShowEnterAmountPopup
        }
      />
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
      <audio className="audio-winner" muted={!volume}>
        <source src={winnerSound}></source>
      </audio>
      <audio className="audio-bet" muted={!volume}>
        <source src={call}></source>
      </audio>
      <audio className="audio-turn" muted={!volume}>
        <source src={myTurn}></source>
      </audio>
      <audio className="audio-bet" muted={!volume}>
        <source src={fold}></source>
      </audio>
      <audio className="audio-collect" muted={!volume}>
        <source src={collect}></source>
      </audio>
      <audio className="audio-check" muted={!volume}>
        <source src={check}></source>
      </audio>
      <audio className="audio-chat" muted={!volume}>
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
  mergeAnimationState,
  followingList,
  setFriendList,
  setFollowingList,
  tablePot,
}) => {
  const [newPurchase, setNewPurchase] = useState(false);
  const [showFollowMe, setShowFollowMe] = useState(false);
  const [followClick, setFollowClick] = useState("");
  const [foldShowCard, setFoldShowCard] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const target = useRef(null);
  useEffect(() => {
    setShowCard(false);
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
        roomData.gameType !== "pokerTournament_Tables"
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
        roomData.gameType !== "pokerTournament_Tables"
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

  useEffect(() => {
    socket.on("showCard", (data) => {
      if (playerData.id === data.userId) {
        setShowCard(true);
      }
    });
    socket.on("hideCard", (data) => {
      if (playerData.id === data.userId) {
        setShowCard(false);
      }
    });
  }, []);
  const { name, photoURI: playerImage } = playerData;

  const handleFollow = async (followerId, nickname) => {
    const Uid = followerId;
    toast.success("Following..", {
      id: "please-wait",
      icon: "♠️",
      style: {
        borderRadius: "5px",
        background: "#333",
        color: "#fff",
      },
    });

    axios
      .get("https://follow-t3e66zpola-lz.a.run.app", {
        params: { frId: Uid },
        headers: { idtoken: idToken },
      })
      .then((response) => {
        setFollowClick("");
        if (response.data) {
          if (
            response.data.error === "no error" &&
            response.data.success === true
          ) {
            setFollowingList((old) => [...old, followerId]);
            toast.success("You are now following @" + nickname, {
              id: "follow-request",
              icon: "✔️",
              style: {
                borderRadius: "5px",
                background: "#333",
                color: "#fff",
              },
            });
          }

          if (
            response.data.error === "no error" &&
            response.data.success === true &&
            response.data.special ===
              "You have removed this follower in the past"
          ) {
            toast.success(
              "You are now following @" +
                nickname +
                ", notice that you removed him from following you",
              {
                id: "follow-request",
                icon: "✔️",
                style: {
                  borderRadius: "5px",
                  background: "#333",
                  color: "#fff",
                },
              }
            );
          }

          if (response.data.error === "already following him") {
            toast.success("You are aleady following @" + nickname, {
              id: "follow-aleady",
              icon: "❌",
              style: {
                borderRadius: "5px",
                background: "#333",
                color: "#fff",
              },
            });
          }

          if (response.data.error === "You are rejected follower") {
            toast.success("Request rejected by @" + nickname, {
              id: "follow-rejected",
              icon: "❌",
              style: {
                borderRadius: "5px",
                background: "#333",
                color: "#fff",
              },
            });
          }

          if (response.data.error === "You are rejected follower") {
            toast.success("You rejected @" + nickname + "from following", {
              id: "follow-aleady",
              icon: "❌",
              style: {
                borderRadius: "5px",
                background: "#333",
                color: "#fff",
              },
            });
          }

          if (response.data.error === "you can not follow yourself") {
            toast.success("You can not follow yourself", {
              id: "follow-yourself",
              icon: "❌",
              style: {
                borderRadius: "5px",
                background: "#333",
                color: "#fff",
              },
            });
          } else if (response.data.error !== "no error") {
            toast.success(response.data.eror, {
              duration: 6000,
              id: "frined-already-sent",
              icon: "❌",
              style: {
                borderRadius: "5px",
                background: "#333",
                color: "#fff",
              },
            });
          }
        } else {
          console.log("backend response failed: ", response.statusText);
        }
      })
      .catch((error) => {
        console.log("Error req", error);
      });
  };
  const handleConnect = async (friendId, nickname) => {
    toast.success("Send friend request..", {
      id: "please-wait",
      icon: "♠️",
      style: {
        borderRadius: "5px",
        background: "#333",
        color: "#fff",
      },
    });
    const FUid = friendId;
    const Fname = nickname;

    const IdTokenConst = idToken;
    const Uid = userId;
    axios
      .get("https://friend-reqest-t3e66zpola-uc.a.run.app", {
        params: { usid: Uid, frId: FUid },
        headers: { idtoken: IdTokenConst },
      })
      .then((response) => {
        // console.log("Executing friend-request:");
        if (response.data) {
          if (response.data.error === "already sent friend request") {
            toast.success(
              "Friend request already sent to @" +
                Fname +
                " please wait " +
                response.data.hours +
                " hours before you can try again.",
              {
                duration: 6000,
                id: "frined-already-sent",
                icon: "❌",
                style: {
                  borderRadius: "5px",
                  background: "#333",
                  color: "#fff",
                },
              }
            );
          }
          if (response.data.error === "already friends") {
            toast.success("You and @" + Fname + " already friends", {
              duration: 4000,
              id: "frined-already-sent",
              icon: "❌",
              style: {
                borderRadius: "5px",
                background: "#333",
                color: "#fff",
              },
            });
          }
          if (
            response.data.error === "no error" &&
            response.data.success === true
          ) {
            setFriendList((old) => [...old, friendId]);
            toast.success("Friend request successfully sent to @" + Fname, {
              duration: 4000,
              id: "frined-request",
              icon: "✔️",
              style: {
                borderRadius: "5px",
                background: "#333",
                color: "#fff",
              },
            });
          } else if (response.data.error !== "no error") {
            toast.success(response.data.eror, {
              duration: 6000,
              id: "frined-already-sent",
              icon: "❌",
              style: {
                borderRadius: "5px",
                background: "#333",
                color: "#fff",
              },
            });
          }
          setFollowClick("");
        } else {
          console.log("Backend response failed: ", response.statusText);
        }
      })
      .catch((error) => {
        console.log("Error req", error);
      });
    // console.log("It works my friend-request!!!");
  };

  const handleChangeFold = (e) => {
    setFoldShowCard(!foldShowCard);
    if (foldShowCard) {
      socket.emit("hideCard", {
        userId,
        gameId: roomData?._id,
      });
    } else {
      socket.emit("showCard", {
        userId,
        gameId: roomData?._id,
      });
    }
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
        } ${playerData && playerData.playing ? "" : "not-playing"} ${
          mergeAnimationState ? "animateMerge-chips" : ""
        }`}
      >
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
          action && <span className="player-action">{actionText}</span>}
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
        <div className="player-box">
          {winner && playerData && winner.id === playerData.id && (
            <img className="coinWinning-animation" src={coinWinning} alt="" />
            // <div className="pyro">
            //   <div className="before"></div>
            //   <div className="after"></div> */}
            //    <Lottie options={winImageanim} width={600} height={500} />
            // </div>
          )}
          {playerData?.availablePosition === 0 && playerData?.fold && (
            <div className="showCardIn-fold">
              <Form.Check
                inline
                label="Show your cards to opponents !"
                name="group1"
                type="checkbox"
                id="inlinecheckbox"
                onChange={handleChangeFold}
              />
            </div>
          )}

          {showCard ? (
            <ShowCard
              cards={playerData.cards ? playerData.cards : []}
              handMatch={handMatch}
            />
          ) : playerData && (playerData.fold || !playerData.playing) ? (
            ""
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
            ""
          ) : (
            <HideCard />
          )}
          {/************ player PIC avtaar  **********/}

          <div
            className="player-pic"
            style={{
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {currentPlayer &&
              playerData &&
              currentPlayer.id === playerData.id && (
                <TimerSeparator time={timer} remainingTime={remainingTime} />
              )}
            <img
              src={
                playerData?.photoURI ||
                "https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
              }
              alt=""
            />
            {/* <div
              className="comment-btn" 
             onClick={() => { 
               handleClick(!open);
                setBtnToggle(!btnToggle);
              }}
            >
           <i className="fa fa-commenting" aria-hidden="true" /> 
            </div> */}
          </div>
          <div
            className={`player-info ${
              currentPlayer && playerData && currentPlayer.id === playerData.id
                ? "progressActive"
                : ""
            } `}
          >
            <h4>
              {playerData && playerData?.name?.length > 8
                ? playerData?.name?.substring(0, 8) + ".."
                : playerData?.name}
            </h4>
            <p>
              {newPurchase
                ? "Purchase"
                : numFormatter(playerData && playerData.wallet)}
            </p>
            {/* {userId === playerData.id && gameCollection !== 'pokerTournament_Tables' && } */}
            {/* {currentPlayer &&
              playerData &&
              currentPlayer.id === playerData.id && (
                <TimerSeparator time={timer} remainingTime={remainingTime} />
              )} */}
          </div>
          {roomData &&
            roomData.runninground !== 0 &&
            playerData &&
            (playerData.isBigBlind || playerData.isSmallBlind) && (
              // || playerData.isDealer
              <div className="player-badge">
                {playerData.isSmallBlind
                  ? "S"
                  : playerData.isBigBlind
                  ? "B"
                  : // : playerData.isDealer
                    // ? "D"
                    ""}
              </div>
            )}

          {playerData && playerData.pot > 0 && playerData !== undefined ? (
            <div className="player-chip">
              <span>
                {numFormatter(playerData && playerData?.pot)}
                {/* <div className="chipNumber-img">
                  <p>{numFormatter(playerData && playerData.pot)}</p>

                  <div className="chips-images">
                    {playerData.pot > 0 && playerData.pot <= 2000 && (
                      <>
                        <img src={redchip} alt="chips" />
                      </>
                    )}
                    {playerData.pot > 2000 && playerData.pot <= 10000 && (
                      <>
                      <img src={bluechip} alt="chips" />
                      </>
                    )}
                    {playerData.pot > 10000 && (
                      <>
                        <img src={blackchip} alt="chips" />
                      </>
                    )}
                  </div>
                </div> */}
              </span>
            </div>
          ) : (
            ""
          )}

          {betOn && playerData && betOn === playerData.id ? (
            <WatcherResult betWin={betWin} />
          ) : (
            ""
          )}

          {betOn && playerData && betOn === playerData.id ? (
            <WatcherResult betWin={betWin} />
          ) : (
            ""
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

const TableCard = ({ winner, communityCards, matchCards, roomData }) => {
  return (
    <div className={`table-card ${winner ? "winner-show" : ""}`}>
      <h4 className="table-blindLevel">
        SB/BB : <span>{roomData?.smallBlind + "/" + roomData?.bigBlind}</span>
      </h4>
      {communityCards &&
        communityCards.map((card, i) => {
          // const cards = require(`../../assets/cards/${card.toUpperCase()}.svg`).default
          return (
            <div className={`card-animate active duration-${i}`}>
              <img
                key={`item-${i}`}
                // src={cards ? cards : back }
                src={`/cards/${card.toUpperCase()}.svg`}
                alt="card"
                className={`${
                  winner && matchCards.findIndex((ele) => ele === i) !== -1
                    ? `winner-card`
                    : ``
                } front-card duration-${i}`}
              />
              <img
                key={`item1-${i}`}
                src={back2}
                alt="back"
                className={`back-card duration-${i}`}
              />
            </div>
          );
        })}
    </div>
  );
};

const TablePotMoney = ({ tablePot }) => {
  return (
    <div className="total-pot-money animate__animated animate__fadeIn">
      <span>{numFormatter(tablePot && tablePot)}</span>
    </div>
  );
};

// const TableLogo = () => {
//   return (
//     <div className='poker-logo'>
//       <img
//         src={logo}
//         alt='logo'
//       />
//     </div>
//   );
// };

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
  roomData,
  handleTentativeAction,
  tentativeAction,
  setTentativeAction,
  loader,
  raiseInSliderAction,
  betInSliderAction,
  playersLeft,
  playersRight,
  players,
}) => {
  return (
    <div className="footer-button">
      <div className="container">
        <div className="footer-container">
          {currentPlayer && currentPlayer?.id === userId ? (
            <>
              {openAction.fold && (
                <div className="footer-btn ">
                  <Button onClick={() => foldAction()}> Fold</Button>
                  {/* <Form.Check
                    inline
                    label="Fold"
                    name="Fold"
                    type="checkbox"
                    id={"fold"}
                    onChange={() => handleCheck("Fold")}
                    checked={selectedbets === "Fold"}
                  /> */}
                </div>
              )}
              {openAction.check && (
                <div className="footer-btn ">
                  <Button onClick={() => checkAction()}>Check</Button>
                  {/* <Form.Check
                    inline
                    name="Check"
                    type="checkbox"
                    id={"Check"}
                    onChange={() => handleCheck("Check")}
                    checked={selectedbets === "Check"}
                  /> */}
                </div>
              )}
              {openAction.call && (
                <div className="footer-btn ">
                  <Button onClick={() => callAction()}>
                    Call{" "}
                    <span
                      className={
                        roomData.raiseAmount - currentPlayer?.pot > 0
                          ? "callBtn-amount"
                          : "callBtn-amount-none"
                      }
                    >
                      {console.log(
                        " roomData?.raiseAmount - currentPlayer?.pot",
                        roomData?.raiseAmount,
                        currentPlayer?.pot
                      )}
                      {/* roomData?.raiseAmount /* - currentPlayer?.pot */}(
                      {Math.round(roomData?.raiseAmount)?.toFixed(2)})
                    </span>
                  </Button>
                  {/* <Form.Check
                    inline
                    name="Call"
                    type="checkbox"
                    id={"Call"}
                    onChange={() => handleCheck("Call")}
                    checked={selectedbets === "Call"}
                  /> */}
                </div>
              )}

              {openAction.raise && (
                <div className="footer-btn ">
                  {raise && (
                    <div className="raiseBet-container">
                      <RaiseSlider
                        currentPlayer={currentPlayer}
                        SliderAction={raiseInSliderAction}
                        roomData={roomData}
                      />
                      <RaiseView
                        currentPlayer={currentPlayer}
                        setRaise={setRaise}
                        raiseAction={raiseAction}
                        allinAction={allinAction}
                        roomData={roomData}
                        players={players}
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      setBet(false);
                      setRaise(true);
                    }}
                  >
                    {/* <Form.Check
                      inline
                      label="Raise"
                      name="Raise"
                      type="checkbox"
                      id={"Raise"}
                      onChange={() => handleCheck("Raise")}
                      checked={selectedbets === "Raise"}
                    /> */}
                    Raise
                  </Button>
                </div>
              )}

              {openAction.bet && (
                <div className="footer-btn ">
                  {bet && (
                    <div className="raiseBet-container">
                      <RaiseSlider
                        currentPlayer={currentPlayer}
                        SliderAction={betInSliderAction}
                        roomData={roomData}
                      />
                      <BetView
                        currentPlayer={currentPlayer}
                        setBet={setBet}
                        betAction={betAction}
                        allinAction={allinAction}
                        roomData={roomData}
                        players={players}
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      setBet(true);
                      setRaise(false);
                    }}
                  >
                    {/* <Form.Check
                      inline
                      label="Bet"
                      name="Bet"
                      type="checkbox"
                      id={"Bet"}
                      onChange={() => handleCheck("Bet")}
                      checked={selectedbets === "Bet"}
                    /> */}
                    Bet
                  </Button>
                </div>
              )}
              {!openAction.raise && !openAction.bet && openAction.allin && (
                <div className="footer-btn ">
                  <Button onClick={() => allinAction()}>
                    {/* <Form.Check
                      inline
                      label="All In"
                      name="AllIn"
                      type="checkbox"
                      id={"AllIn"}
                      onChange={() => handleCheck("All In")}
                      checked={selectedbets === "All In"}
                    /> */}
                    All In
                  </Button>
                </div>
              )}
            </>
          ) : (
            // ""

            <>
              {roomData?.gamestart &&
                roomData.runninground >= 1 &&
                roomData.runninground < 5 &&
                playersLeft.concat(playersRight).find((el) => el.id === userId)
                  ?.cards?.length === 2 &&
                !playersLeft.concat(playersRight).find((el) => el.id === userId)
                  ?.fold &&
                !(
                  roomData.lastAction === "check" &&
                  playersLeft
                    .concat(playersRight)
                    .find((el) => el.id === userId)?.action === true
                ) &&
                playersLeft.concat(playersRight).find((el) => el.id === userId)
                  .actionType !== "all-in" && (
                  <AdvanceActionBtn
                    setTentativeAction={setTentativeAction}
                    tentativeAction={tentativeAction}
                    handleTentativeAction={handleTentativeAction}
                    roomData={roomData}
                    currentPlayer={currentPlayer}
                    player={playersLeft
                      .concat(playersRight)
                      .find((el) => el.id === userId)}
                  />
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// const BetView = ({ currentPlayer, setBet, betAction, allinAction }) => {
//   return (
//     <div className='bet-view'>
//       {roomData &&
//         currentPlayer &&
//         roomData.raiseAmount <= currentPlayer.wallet && (
//           <span
//             onClick={() => {
//               betAction(1);
//               setBet(false);
//             }}>
//             1x
//           </span>
//         )}
//       {roomData &&
//         currentPlayer &&
//         roomData.raiseAmount * 2 <= currentPlayer.wallet && (
//           <span
//             onClick={() => {
//               betAction(2);
//               setBet(false);
//             }}>
//             2x
//           </span>
//         )}
//       {roomData &&
//         currentPlayer &&
//         roomData.raiseAmount * 4 <= currentPlayer.wallet && (
//           <span
//             onClick={() => {
//               betAction(4);
//               setBet(false);
//             }}>
//             4x
//           </span>
//         )}
//       {roomData &&
//         currentPlayer &&
//         roomData.raiseAmount * 6 <= currentPlayer.wallet && (
//           <span
//             onClick={() => {
//               betAction(6);
//               setBet(false);
//             }}>
//             6x
//           </span>
//         )}
//       <span
//         onClick={() => {
//           allinAction();
//           setBet(false);
//         }}>
//         All in
//       </span>
//       <div
//         className='close-bet'
//         role='presentation'
//         onClick={() => setBet(false)}>
//         x
//       </div>
//     </div>
//   );
// };

// const RaiseView = ({ currentPlayer, setRaise, raiseAction, allinAction }) => {
//   return (
//     <div className='bet-view'>
//       {roomData &&
//         currentPlayer &&
//         currentPlayer.wallet >= roomData.raiseAmount * 2 && (
//           <span
//             onClick={() => {
//               raiseAction(2);
//               setRaise(false);
//             }}>
//             2x
//           </span>
//         )}
//       {roomData &&
//         currentPlayer &&
//         currentPlayer.wallet >= roomData.raiseAmount * 4 && (
//           <span
//             onClick={() => {
//               raiseAction(4);
//               setRaise(false);
//             }}>
//             4x
//           </span>
//         )}
//       {roomData &&
//         currentPlayer &&
//         currentPlayer.wallet >= roomData.raiseAmount * 6 && (
//           <span
//             onClick={() => {
//               raiseAction(6);
//               setRaise(false);
//             }}>
//             6x
//           </span>
//         )}
//       {roomData &&
//         currentPlayer &&
//         currentPlayer.wallet >= roomData.raiseAmount * 8 && (
//           <span
//             onClick={() => {
//               raiseAction(8);
//               setRaise(false);
//             }}>
//             8x
//           </span>
//         )}
//       <span
//         onClick={() => {
//           allinAction();
//           setRaise(false);
//         }}>
//         All in
//       </span>
//       <div
//         className='close-bet'
//         role='presentation'
//         onClick={() => setRaise(false)}>
//         x
//       </div>
//     </div>
//   );
// };

const PlayPauseBtn = ({ pauseGame, resumeGame, finishGame }) => {
  const [isFinishClick, setisFinishClick] = useState(false);
  return (
    <div className="play-pause-button">
      {roomData && roomData.autoNextHand ? (
        roomData.pause ? (
          <div className="play-btn">
            <Button onClick={() => resumeGame()}>Resume</Button>
          </div>
        ) : (
          <div className="play-btn">
            <Button onClick={() => pauseGame()}>Pause</Button>
          </div>
        )
      ) : (
        ""
      )}

      {!showFinish && (
        <div className="pause-btn">
          <Button
            onClick={() => {
              finishGame();
              setisFinishClick(true);
            }}
            disabled={isFinishClick}
          >
            Finish
          </Button>
        </div>
      )}
    </div>
  );
};

const HideCard = () => {
  return (
    <div className="player-card">
      <img
        src={front}
        alt="card"
        className="animate__animated animate__rollIn duration-0"
      />
      <img
        src={back}
        alt="card"
        className="animate__animated animate__rollIn duration-1"
      />
    </div>
  );
};

const ShowCard = ({ cards, handMatch }) => {
  return (
    <div className="show-card">
      {cards &&
        cards.map((card, i) => (
          <img
            key={`item-${card}`}
            // src={
            //   require(`../../assets/cards/${card.toUpperCase()}.svg`).default
            // }
            src={`/cards/${card.toUpperCase()}.svg`}
            alt="card"
            className={`animate__animated animate__rollIn duration-${i} ${
              handMatch.findIndex((ele) => ele === i) !== -1
                ? ``
                : `winner-card`
            } `}
          />
        ))}
    </div>
  );
};

const GameMessage = ({ winnerText }) => {
  return (
    <div className="game-msg">
      <p className={winnerText !== "" ? "winner-text" : ""}>{winnerText}</p>
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
    <div className="bubble-msg">
      <div className="triangle-isosceles left">{message}</div>
    </div>
  );
};

const LogoImage = () => {
  return (
    <div className="logo--bottom-image">
      <img src={footerlogo} alt="footer-logo" />
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
    <div id="button-tooltip" className="tootltip player-tooltip">
      <div className="tooltip-box">
        <h5>{name}</h5>
        <div className="tooltip-content">
          <img src={playerImage} alt="las-vegas-player" />
          <div className="player-details-content">
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
      placement="right"
      delay={{ show: 250, hide: 200 }}
      overlay={WatcherTooltip(
        roomData && roomData.watchers && roomData.watchers.length
      )}
    >
      <div className="watcher-count">
        <div className="watcher-icon">
          <svg width="25" height="25" viewBox="0 0 30 30" version="1.1">
            <defs>
              <path
                d="M0,15.089434 C0,16.3335929 5.13666091,24.1788679 14.9348958,24.1788679 C24.7325019,24.1788679 29.8697917,16.3335929 29.8697917,15.089434 C29.8697917,13.8456167 24.7325019,6 14.9348958,6 C5.13666091,6 0,13.8456167 0,15.089434 Z"
                id="outline"
              ></path>
              <mask id="mask">
                <rect width="100%" height="100%" fill="#000000"></rect>
                <use id="lid" fill="black" />
              </mask>
            </defs>
            <g id="eye">
              <path
                d="M0,15.089434 C0,16.3335929 5.13666091,24.1788679 14.9348958,24.1788679 C24.7325019,24.1788679 29.8697917,16.3335929 29.8697917,15.089434 C29.8697917,13.8456167 24.7325019,6 14.9348958,6 C5.13666091,6 0,13.8456167 0,15.089434 Z M14.9348958,22.081464 C11.2690863,22.081464 8.29688487,18.9510766 8.29688487,15.089434 C8.29688487,11.2277914 11.2690863,8.09740397 14.9348958,8.09740397 C18.6007053,8.09740397 21.5725924,11.2277914 21.5725924,15.089434 C21.5725924,18.9510766 18.6007053,22.081464 14.9348958,22.081464 L14.9348958,22.081464 Z M18.2535869,15.089434 C18.2535869,17.0200844 16.7673289,18.5857907 14.9348958,18.5857907 C13.1018339,18.5857907 11.6162048,17.0200844 11.6162048,15.089434 C11.6162048,13.1587835 13.1018339,11.593419 14.9348958,11.593419 C15.9253152,11.593419 14.3271242,14.3639878 14.9348958,15.089434 C15.451486,15.7055336 18.2535869,14.2027016 18.2535869,15.089434 L18.2535869,15.089434 Z"
                fill="#000000"
              ></path>
              <use mask="url(#mask)" fill="#000000" />
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
    <Tooltip id="button-tooltip" className="tootltip player-tooltip" {...props}>
      <div className="tooltip-box">
        <p>{props} watchers</p>
      </div>
    </Tooltip>
  );
};

const WatcherResult = ({ betWin }) => {
  return (
    <div className="watcher-results">
      {betWin ? (
        <div className="watcher-win showing">
          <img src={winnericon} alt="" />
        </div>
      ) : (
        <div className="watcher-loss showing">
          <img src={loseicon} alt="" />
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

  const handelColor = () => {
    if (activeTime > 67) {
      return "success";
    } else if (activeTime < 68 && activeTime > 33) {
      return "warning";
    } else {
      return "danger";
    }
  };

  return (
    // <div class="battery">
    //   <CircularProgressbar
    //     counterClockwise
    //     value={activeTime}
    //     strokeWidth={50}
    //     styles={buildStyles({
    //       strokeLinecap: "butt",
    //     })}
    //   />
    // </div>
    <ProgressBar animated variant={handelColor()} now={activeTime} />
    // <ProgressBar
    //   width="100%"
    //   height="100%"
    //   // height="80%"
    //   rect
    //   fontColor="gray"
    //   percentage={activeTime}
    //   rectPadding="1px"
    //   rectBorderRadius="20px"
    //   trackPathColor="transparent"
    //   bgColor="#333333"
    //   trackBorder5Color="grey"
    //   style={{ "--rectLevel": activeTime }}
    // />
  );
};
