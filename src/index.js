import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './index.css';
import App from './App';
import Nokia from "./routes/nokia/nokia";
import SwitchIE2000 from './routes/switchCT/IE2000/switch';
import SwitchSAS7210 from './routes/switchCT/SAS7210/switch';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='/nokia' element={<Nokia />} />
        <Route path='/switch-CT-IE2000' element={<SwitchIE2000 />} />
        <Route path='/switch-CT-SAS7210' element={<SwitchSAS7210 />} />
      </Route>
    </Routes>
  </BrowserRouter>
);