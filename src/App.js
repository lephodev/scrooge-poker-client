import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
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

const App = () => {
  const [userInAnyGame, setUserInAnyGame] = useState()
  useEffect(() => {
    if (window.width < window.height) {
      let w = window.width;
      window.width = window.height;
      window.height = w;
    }
  }, []);
  
  return (
    <div className='App'>
      <UserContext.Provider
        value={{
          userInAnyGame,
          setUserInAnyGame
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
