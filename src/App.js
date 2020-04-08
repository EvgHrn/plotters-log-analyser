import React, { useState, useEffect } from 'react';
import './App.css';
import LogsInput from './components/LogsInput';
import AccessInput from './components/AccessInput';
import Parser from './utils/Parser';
import ResultsTable from './components/ResultsTable';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  app: {
    textAlign: "center",
    // maxHeight: `400px`,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function App() {

  const classes = useStyles();

  const [isBackdropOpen, setBackdrop] = useState(false);

  const [log1Orders, setLog1Orders] = useState([]);
  const [log2Orders, setLog2Orders] = useState([]);
  const [log3Orders, setLog3Orders] = useState([]);
  const [log4Orders, setLog4Orders] = useState([]);
  const [log5Orders, setLog5Orders] = useState([]);
  const [log6Orders, setLog6Orders] = useState([]);
  const [log7Orders, setLog7Orders] = useState([]);
  const [logDefOrders, setLogDefOrders] = useState([]);

  const [accessOrders, setAccessOrders] = useState([]);

  const [results, setResults] = useState([]);

  const logHandle = (text, plotterNumber) => {
    console.log("Plotter number: ", plotterNumber);
    if(! plotterNumber) {
      plotterNumber = "?";
    }
    const newJobOrders = Parser.parse(text, plotterNumber);
    switch(plotterNumber) {
      case "1": {
        setLog1Orders(newJobOrders);
        break;
      }
      case "2": {
        setLog2Orders(newJobOrders);
        break;
      }
      case "3": {
        setLog3Orders(newJobOrders);
        break;
      }
      case "4": {
        setLog4Orders(newJobOrders);
        break;
      }
      case "5": {
        setLog5Orders(newJobOrders);
        break;
      }
      case "6": {
        setLog6Orders(newJobOrders);
        break;
      }
      case "7": {
        setLog7Orders(newJobOrders);
        break;
      }
      default: {
        setLogDefOrders(newJobOrders);
        break;
      }
    }
  };

  const accessHandle = (dataJson) => {
    console.log("dataJson: ", dataJson);
    setAccessOrders(dataJson);
  };

  const getFilesList = (jobsArr) => {

    const logFileNames = jobsArr.reduce((acc, orderObj) => {
      const orderImagesNamesArr = orderObj.images.reduce((acc, imageObj) => {
        if(! imageObj.imgNumber) {
          acc.push(imageObj.imgName);
        } else {
          acc.push(imageObj.imgNumber);
        }
        return acc;
      }, []);
      return acc.concat(orderImagesNamesArr);
    }, []);

    return [ ...new Set(logFileNames) ];
  };

  const calculateResults = (jobsArr, accessArr) => {

    /*
    {
      logOrderNumber,
      product,
      jobs: [
        {
          date,
          plotter,
          minutesTotal,
          count | ?
        }
      ],
      logOrder count,
      accessOrder count
    }
    */

    // get list of all files paths
    const ordersNumbers = getFilesList(jobsArr);
    console.log("Files: ", ordersNumbers);

    let result = ordersNumbers.map(logOrderNumber => {

      let jobs = jobsArr.filter(jobObj => {
        const fileForSearch = logOrderNumber;
        const imgObjArr = jobObj.images;
        return imgObjArr.some(imgObj => imgObj.imgNumber === fileForSearch);
      });

      jobs = jobs.map(jobObj => {
        const startDateTime = jobObj.startDate + " " + jobObj.startTime.slice(0, 5);
        const plotter = jobObj.plotter;
        let count = "?";
        if(! jobObj.aborted) {
          count = jobObj.images.reduce((acc, imageObj) => {
            if(imageObj.imgNumber === logOrderNumber || imageObj.imgName === logOrderNumber) {
              acc++;
            }
            return acc;
          }, 0);
        }
        let minutesTotal = "?";
        if("minutesTotal" in jobObj) {
          minutesTotal = jobObj.minutesTotal;
        }
        return {
          startDateTime,
          plotter,
          minutesTotal,
          count
        }
      });

      const logOrderCount = jobs.reduce((acc, jobObj) => {
        if(jobObj.count !== "?") {
          acc += jobObj.count;
        }
        return acc;
      }, 0);

      let accessOrderCount = 0;
      let product = "?";
      const accessOrderObj = accessArr.find(accessObj => accessObj["Номер"].toString() === logOrderNumber.toString());
      if(accessOrderObj) {
        accessOrderCount = accessOrderObj["Тираж"];
        product = accessOrderObj["Название"];
      }

      return {
        logOrderNumber,
        product,
        jobs,
        logOrderCount,
        accessOrderCount
      };
    });

    result.sort((a, b) => a.logOrderNumber - b.logOrderNumber);

    console.log("Results: ", result);

    return result;
  };

  useEffect(() => {
    console.log("Backdrop: ", isBackdropOpen);
  }, [isBackdropOpen]);

  useEffect(() => {
    const allLogOrders = [
      ...log1Orders,
      ...log2Orders,
      ...log3Orders,
      ...log4Orders,
      ...log5Orders,
      ...log6Orders,
      ...log7Orders,
      ...logDefOrders
    ];
    const newResults = calculateResults(allLogOrders, accessOrders);
    setResults(newResults);
  }, [log1Orders, log2Orders, log3Orders, log4Orders, log5Orders, log6Orders, log7Orders, logDefOrders, accessOrders]);

  return (
    <Container className={classes.app}>
      <ResultsTable data={results}/>
      <LogsInput setText={logHandle} setBackdrop={setBackdrop}/>
      <AccessInput setText={accessHandle} setBackdrop={setBackdrop}/>
      <Backdrop className={classes.backdrop} open={isBackdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container >
  );
}

export default App;

/*
 fail: true
  in job object if no footer,

 imgNumber: false
  if no order number in file name

 ignore images with errors
*/