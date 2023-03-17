import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  // HashRouter,
  BrowserRouter as Router,
  // Switch,
  Route,
} from 'react-router-dom';
import PokerTable from './components/pokertable/table';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './page/home/Home';
import axios from 'axios';
import { getCookie } from "./utils/cookieUtil";
import CONSTANTS from "./config/contants";
import UserContext from './context/UserContext';
const App = () => {
  const [userInAnyGame,setUserInAnyGame]=useState()
  useEffect(() => {
    if (window.width < window.height) {
      let w = window.width;
      window.width = window.height;
      window.height = w;
    }
  }, []);
  const checkUserInGame=async()=>{
    let userData = await axios({
      method: "get",
      url: `${CONSTANTS.landingServerUrl}/users/checkUserInGame`,
      headers: { authorization: `Bearer ${getCookie("token")}` },
    });
    if(userData?.data){
      setUserInAnyGame(userData.data)
    }
  }
useEffect(()=>{
  checkUserInGame()
},[])
  return (
    <div className='App'>
      <UserContext.Provider
        value={{
          userInAnyGame,
          setUserInAnyGame
        }}
      >
      <Router>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/table'>
          <PokerTable />
        </Route>
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
