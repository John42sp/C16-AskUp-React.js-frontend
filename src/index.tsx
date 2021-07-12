import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//chamar arquivo services pra importar configs do firebase que criei, auto inicializar conexão com firebase
import './services/firebase'; 

import './styles/global.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


