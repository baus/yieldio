import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import App from './reactapp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
