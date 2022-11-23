import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  HashRouter,
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import PokerTable from './components/pokertable/table';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './page/home/Home';
import CONSTANTS from './config/contants';

const App = () => {
  useEffect(() => {
    if (window.width < window.height) {
      let w = window.width;
      window.width = window.height;
      window.height = w;
    }
  }, []);
  console.log('PROJECT CONSTANTS ', { CONSTANSTS: CONSTANTS });

  return (
    <div className='App'>
      <Router>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/table'>
          <PokerTable />
        </Route>
      </Router>

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
