import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  // HashRouter,
  BrowserRouter as Router,
  // Switch,
  Route,
  Switch,
} from 'react-router-dom';
import PokerTable from './components/pokertable/table';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './page/home/Home';
import UserContext from './context/UserContext';
import LeaderBoard from './page/home/leaderBoard';
import Error404 from './page/Error404/Error404';
import userUtils from './utils/user';
import { socket } from './config/socketConnection';
import { landingClient } from './config/keys';

const App = () => {
  const [userInAnyGame, setUserInAnyGame] = useState({})
  const [user,setUser]=useState()
  const getUser = async () => {
    let res = await userUtils.getAuthUserData();
    setUser(res?.data?.user)
  };
  useEffect(() => {
    if (window.width < window.height) {
      let w = window.width;
      window.width = window.height;
      window.height = w;
    }
    getUser()
  }, []);

  useEffect(() => {
    socket.on("tournamentStart", (data) => {
      console.log("tournamentStart socket listen");
      data.rooms.forEach(room => {
        if(room.players.find(player => player.id === user.id)){
          toast((t) => (
            <span>
              "Tournament will start in 10 seconds, please join the table"
              <button onClick={() =>{ toast.dismiss(t.id)
              window.open(`${landingClient}/table?gamecollection=poker&tableid=${room._id}`, "__self")
              }}>
                Join
              </button>
            </span>
          ));
          toast.success("Tournament will start in 10 seconds, please join the table", { id: "tournamentStart"});
        }
      })

    })
    return () => {
      socket.off("tournamentStart")
    }
  }, [user])
  
  return (
    <div className='App'>
      <UserContext.Provider
        value={{
          userInAnyGame,
          setUserInAnyGame,
          user,
          setUser
        }}
      >
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
            <Route path="*">
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
            className: 'custom-toast',
          }}
        />
      </div>
    </div>
  );
};

export default App;
