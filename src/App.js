import React, {useState} from 'react';
import './App.css';
import Dropzone from './components/Dropzone';
import Parser from './utils/Parser';
import Search from './components/Search';

function App() {

  const [jobs, setJobs] = useState([]);

  const [jobsCount, setJobsCount] = useState(0);

  const logHandle = (text) => {
    const jobsArr = jobs.concat(Parser.parse(text));
    setJobs(jobsArr);
    setJobsCount(jobsArr.length);
  };

  const searchHandle = (orderNumber) => {
    const jobsFiltered = jobs.filter((jobObj) => {
      jobObj.images.some((imageObj) => imageObj.imgName.includes(orderNumber));
    });
    setJobsCount(jobsFiltered.length);
  };

  return (
    <div className="App">
      <Search searchHandle={searchHandle}/>
      <p>{jobsCount}</p>
      <Dropzone setText={logHandle}/>
    </div>
  );
}

export default App;
