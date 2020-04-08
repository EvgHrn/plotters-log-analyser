import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Search from './Search';

const windowHeight = window.innerHeight - 150;

const useStyles = makeStyles({
	root: {
		width: '100%',
	},
	container: {
		maxHeight: `${windowHeight}px`,
	},
	table: {
		minWidth: 650,
	},
	warningRow: {
		backgroundColor: '#ffe1eb',
	},
	attentionRow: {
		backgroundColor: '#f8738f',
	},
});

const ResultsTable = (props) => {

	const [data, setData] = React.useState([]);
	const [dataForSearch, setDataForSearch] = React.useState("");

	React.useEffect(() => {
		if(dataForSearch.length === 0) {
			console.log("Show all data");
			setData(props.data);
		} else {
			console.log("Gonna filter table data");
			const newDataArr = props.data.filter(obj => obj.logOrderNumber.toString().includes(dataForSearch.toString()) );
			console.log("New table Data Arr: ", newDataArr);
			setData(newDataArr);
		}
	}, [props.data, dataForSearch]);

	const classes = useStyles();

	return (
		<Paper className={classes.root}>
			<Search searchHandle={setDataForSearch}/>
			<TableContainer className={classes.container}>
			<Table className={classes.table} aria-label="simple table" stickyHeader={true} >
				<TableHead>
					<TableRow>
						<TableCell align="center">Номер</TableCell>
						<TableCell align="center">Название</TableCell>
						<TableCell align="center">Дата</TableCell>
						<TableCell align="center">Плоттер</TableCell>
						<TableCell align="center">Кол-во в задании</TableCell>
						<TableCell align="center">Минут печати</TableCell>
						<TableCell align="center">Общее кол-во</TableCell>
						<TableCell align="center">Тираж</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						data.map((orderObj, index) => {
							const jobsCount = orderObj.jobs.length;
							return orderObj.jobs.map((jobObj, index) =>
						    (
									<TableRow key={index} className={(orderObj.logOrderCount > orderObj.accessOrderCount) ? (orderObj.accessOrderCount === 0 ? classes.attentionRow : classes.warningRow) : null}>
										{
											(index === 0) ? <TableCell component="th" scope="row" align="center" rowSpan={jobsCount}>{orderObj.logOrderNumber}</TableCell> : null
										}
										{
											(index === 0) ? <TableCell align="center" rowSpan={jobsCount}>{orderObj.product}</TableCell> : null
										}

										<TableCell align="center">{jobObj.startDateTime}</TableCell>
										<TableCell align="center">пл. {jobObj.plotter}</TableCell>
										<TableCell align="center">{jobObj.count}</TableCell>
										<TableCell align="center">{jobObj.minutesTotal} мин</TableCell>
										{
											(index === 0) ? <TableCell align="center" rowSpan={jobsCount}>{orderObj.logOrderCount}</TableCell> : null
										}
										{
											(index === 0) ? <TableCell align="center" rowSpan={jobsCount}>{orderObj.accessOrderCount}</TableCell> : null
										}
									</TableRow>
								)
							)
						}
					)}
				</TableBody>
			</Table>
		</TableContainer>
		</Paper>
	)
};

export default ResultsTable;