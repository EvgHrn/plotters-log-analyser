import React, {useState, useEffect} from 'react';
import './App.css';
import LogsInput from './components/LogsInput';
import AccessInput from './components/AccessInput';
import Parser from './utils/Parser';
import Search from './components/Search';
import ResultsTable from './components/ResultsTable';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function App() {

  const classes = useStyles();

  const [backdropOpen, setBackdrop] = useState(false);

  const [logOrders, setLogOrders] = useState([]);

  const [accessOrders, setAccessOrders] = useState([]);

  const [results, setResults] = useState([]);

  const logHandle = (text, plotterNumber) => {
    console.log("Plotter number: ", plotterNumber);
    if(! plotterNumber) {
      plotterNumber = "?";
    }
    setBackdrop(true);
    const jobsArr = logOrders.concat(Parser.parse(text, plotterNumber));
    setLogOrders(jobsArr);
  };

  const accessHandle = (dataJson) => {
    console.log("dataJson: ", dataJson);
    setAccessOrders(dataJson);
  };

  const calculateResults = (jobsArr, accessArr) => {

    /*
    {
      logOrder,
      logOrder count,
      accessOrder count
    }
    */

    setBackdrop(true);

    console.log("jobsArr: ", jobsArr);

    // get list of all files paths
    const logFileNames = jobsArr.reduce((acc, orderObj) => {
      if(orderObj.aborted === "1") {
        return acc;
      }
      const orderImagesNamesArr = orderObj.images.reduce((acc, imageObj) => {
        const imageFullPath = imageObj["imgName"];
        const imageName = imageFullPath.split("\\").pop();
        acc.push(imageName);
        return acc;
      }, []);
      return acc.concat(orderImagesNamesArr);
    }, []);

    const orderNumbers = logFileNames.map(fileName => {
      let number = fileName.match(/\d{6}/);
      if(!number) {
        number = fileName;
      } else {
        number = number[0];
      }
      return number;
    });

    console.log("orders numbers: ", orderNumbers);

    const orderNumbersUnique = [ ...new Set(orderNumbers) ];

    console.log("Unique orders numbers: ", orderNumbersUnique);

    const numberAndCountsObjArr = orderNumbersUnique.map(number => {
      const count = orderNumbers.reduce((acc, orderNumber) => {
        if(number === orderNumber) {
          acc++;
        }
        return acc;
      }, 0);
      return { number, count };
    });

    console.log("number And Counts Obj Arr: ", numberAndCountsObjArr);

    console.log("Access array: ", accessArr);

    const result = numberAndCountsObjArr.map(numberAndCountsObj => {
      let accessCount = accessArr.find(accessObj => accessObj["Номер"].toString() === numberAndCountsObj.number.toString());
      if(accessCount) {
        accessCount = accessCount["Тираж"];
      } else {
        accessCount = 0;
      }
      return {
        order: numberAndCountsObj.number,
        logCount: numberAndCountsObj.count,
        accessCount
      };
    });

    result.sort((a, b) => a.order - b.order);

    console.log("Results: ", results);

    setResults(result);
    setBackdrop(false);
  };

  useEffect(() => {

  }, [backdropOpen]);

  useEffect(() => {
    calculateResults(logOrders, accessOrders);
  }, [logOrders, accessOrders]);

  return (
    <div className="App">
      {/*<Search searchHandle={searchHandle}/>*/}
      <ResultsTable data={results}/>
      <LogsInput setText={logHandle}/>
      <AccessInput setText={accessHandle}/>
      <Backdrop className={classes.backdrop} open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default App;
