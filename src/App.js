import React, {useState} from 'react';
import './App.css';
import Dropzone from './components/Dropzone';
import Parser from './utils/Parser';
import Search from './components/Search';
import ResultsTable from './components/ResultsTable';

function App() {

  const [jobs, setJobs] = useState([]);

  const [jobsCount, setJobsCount] = useState(0);

  const [results, setResults] = useState([]);

  const logHandle = (text) => {
    const jobsArr = jobs.concat(Parser.parse(text));
    setJobs(jobsArr);
    setJobsCount(jobsArr.length);
  };

  const searchHandle = (orderNumber) => {

    const jobsFiltered = jobs.filter((jobObj => {
      return jobObj.images.some((imageObj) => imageObj.imgName.includes(orderNumber));
    }));

    const results = jobsFiltered.reduce((acc, jobObj) => {
      let imagesCount = 0;
      if(jobObj.fail) {
        imagesCount = "Fail";
      } else {
        imagesCount = jobObj.images.reduce((count, imageObj) => {
          if(imageObj.imgName.includes(orderNumber))
            count++;
          return count;
        }, 0);
      }
      acc.push({
        dateTime: jobObj.startDate + " " + jobObj.startTime,
        imagesCount,
        orderNumber
      });
      return acc;
    }, []);

    console.log("Search results: ", results);

    setJobsCount(jobsFiltered.length);
    setResults(results);
  };

  return (
    <div className="App">
      <Search searchHandle={searchHandle}/>
      {/*<p>{jobsCount}</p>*/}
      <ResultsTable data={results}/>
      <Dropzone setText={logHandle}/>
    </div>
  );
}

export default App;
