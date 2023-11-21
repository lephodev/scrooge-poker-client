import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  // HashRouter,
  BrowserRouter as Router,
  // Switch,
  Route,
  Switch,
} from "react-router-dom";
import PokerTable from "./components/pokertable/table";
import "animate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./page/home/Home";
import UserContext from "./context/UserContext";
import LeaderBoard from "./page/home/leaderBoard";
import Error404 from "./page/Error404/Error404";
import userUtils from "./utils/user";
import { socket } from "./config/socketConnection";
import { pokerClient } from "./config/keys";
import vpnbanner from "./assets/vpn-banner.webp";
import notaccess from "./assets/not-access.webp";

import Spectate from "./page/home/spectate";
import { authInstance } from "./utils/axios.config";
import axios from "axios";

const App = () => {
  const [userInAnyGame, setUserInAnyGame] = useState({});
  const [customToast, setCustomToast] = useState(false);
  const [user, setUser] = useState();
  const [mode, setMode] = useState("");
  const [isVPNEnable, setIsVPNEnable] = useState(false);
  const [stateBlock, setStateBlock] = useState(false);
  const getUser = async () => {
    let res = await userUtils.getAuthUserData();
    setUser(res?.data?.user);
  };
  useEffect(() => {
    if (window.width < window.height) {
      let w = window.width;
      window.width = window.height;
      window.height = w;
    }
    getUser();
  }, []);

  // console.log(
  //   "tournamentStart socket listen",
  //   window.location.pathname,
  //   window.location
  // );

  useEffect(() => {
    socket.on("tournamentStart", (data) => {
      setCustomToast(true);
      // console.log(
      //   "tournamentStart socket listen",
      //   window.location.pathname,
      //   window.location
      // );
      data.rooms.forEach((room) => {
        if (
          room.players.find((player) => player?.id === user?.id) &&
          !window.location.pathname.includes("/table")
        ) {
          toast(
            (t) => (
              <div className="toaster-join">
                <span>
                  "Tournament will start in 10 seconds, please join the table"
                </span>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    window.open(
                      `${pokerClient}table?gamecollection=poker&tableid=${room?._id}`, //
                      "__self"
                    );
                  }}
                >
                  Join
                </button>
              </div>
            ),
            {
              toastId: "test",
            }
          );
        }
      });
      setTimeout(() => {
        setCustomToast(false);
      }, 1000);
    });
    return () => {
      socket.off("tournamentStart");
    };
  }, [user]); //user

  const checkVPN = async () => {
    try {
      const res = await fetch("https://geolocation-db.com/json/").then(
        (response) => response.json()
      );
      const CurrentIp = res?.IPv4;
      // const apiUrl = `http://api.vpnblocker.net/v2/json/${CurrentIp}`;
      const serverUrl = `/validate_VPN?ip=${CurrentIp}&timezone=${null}`;
      const checkVPNRes = await authInstance().get(serverUrl);
      setIsVPNEnable(checkVPNRes?.data?.vpnStatus);

      console.log("checkVPNRes", checkVPNRes);
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await axios.get("https://geolocation-db.com/json/");
      const CurrentIp = res?.data?.IPv4;
      // eslint-disable-next-line no-console
      // console.log("CurrentIpAddress", CurrentIp);

      const res1 = await axios.get(`https://ipapi.co/${CurrentIp}/city`);
      // eslint-disable-next-line no-console
      // console.log("city", res1?.data);
      const CurrentCity = res1?.data;
      // eslint-disable-next-line no-constant-condition
      if (
        CurrentCity.toString() === "Washington" ||
        CurrentCity.toString() === "Quebec" ||
        CurrentCity.toString() === "Mumbai" ||
        CurrentCity.toString() === "Idaho"
      ) {
        setStateBlock(true);
        // navigates("/CountryBlockblock");
      }
      await checkVPN();
    })();
  }, []);

  return (
    <div className="App">
      {stateBlock || isVPNEnable ? (
        <div className="ip-block-content">
          <div className="container">
            <div className="ip-block-grid">
              {isVPNEnable ? (
                <img
                  src={vpnbanner}
                  alt="Scrooge VPN"
                  loading="lazy"
                  className="img-fluid maintance-img"
                />
              ) : (
                <img
                  src={notaccess}
                  alt="Scrooge Access"
                  loading="lazy"
                  className="img-fluid maintance-img"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <UserContext.Provider
            value={{
              userInAnyGame,
              setUserInAnyGame,
              user,
              setUser,
              mode,
              setMode,
            }}
          >
            <Router>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/leaderboard">
                  <LeaderBoard />
                </Route>
                <Route exact path="/spectate">
                  <Spectate />
                </Route>
                <Route exact path="/table">
                  <PokerTable />
                </Route>
                <Route path="*">
                  <Error404 />
                </Route>
              </Switch>
            </Router>
          </UserContext.Provider>
          <div className="abc">
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                className: `custom-toast ${customToast ? "cus-toastify" : ""}`,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
