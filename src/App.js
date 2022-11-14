import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { HashRouter } from 'react-router-dom';
import PokerTable from './components/pokertable/table';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  useEffect(() => {
    if (window.width < window.height) {
      let w = window.width;
      window.width = window.height;
      window.height = w;
    }
  }, []);

  return (
    <div className='App'>
      <HashRouter>
        <PokerTable />
      </HashRouter>
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
