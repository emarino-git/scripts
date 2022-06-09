import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './index.css';
import App from './App';
import Nokia from "./routes/nokia";
import Switch from "./routes/switch";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='/nokia' element={<Nokia />} />
        <Route path='/switch' element={<Switch />} />
      </Route>
    </Routes>
  </BrowserRouter>
);