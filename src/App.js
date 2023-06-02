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
import { landingClient } from "./config/keys";

const App = () => {
  const [userInAnyGame, setUserInAnyGame] = useState({});
  const [customToast, setCustomToast] = useState(false);
  const [user, setUser] = useState();
  const [mode, setMode] = useState("");
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

  useEffect(() => {
    socket.on("tournamentStart", (data) => {
      setCustomToast(true);
      console.log("tournamentStart socket listen");
      data.rooms.forEach((room) => {
        if (room.players.find((player) => player?.id === user?.id)) {
          toast(
            (t) => (
              <div className='toaster-join'>
                <span>
                  "Tournament will start in 10 seconds, please join the table"
                </span>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    window.open(
                      `${landingClient}table?gamecollection=poker&tableid=${room?._id}`, //
                      "__self"
                    );
                  }}>
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

  return (
    <div className='App'>
      <UserContext.Provider
        value={{
          userInAnyGame,
          setUserInAnyGame,
          user,
          setUser,
          mode,
          setMode,
        }}>
        <Router>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route exact path='/leaderboard'>
              <LeaderBoard />
            </Route>
            <Route exact path='/table'>
              <PokerTable />
            </Route>
            <Route path='*'>
              <Error404 />
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
      <div className='abc'>
        <Toaster
          position='top-right'
          reverseOrder={false}
          toastOptions={{
            className: `custom-toast ${customToast ? "cus-toastify" : ""}`,
          }}
        />
      </div>
    </div>
  );
};

export default App;
