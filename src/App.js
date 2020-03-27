import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Dropzone from './components/Dropzone';
import {Parser} from './utils/Parser';

function App() {

  // const [text, setText] = useState("");

  const logHandle = (text) => {
    Parser.parse(text);
  };

  return (
    <div className="App">
      <Dropzone setText={logHandle}/>
    </div>
  );
}

export default App;
