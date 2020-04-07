import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const ResultsTable = (props) => {

	const classes = useStyles();

	const rows = props.data;

	console.log("Rows: ", rows);

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Time</TableCell>
						<TableCell align="center">Number</TableCell>
						<TableCell align="right">Count</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.dateTime}>
							<TableCell component="th" scope="row">
								{row.dateTime}
							</TableCell>
							<TableCell align="center">{row.orderNumber}</TableCell>
							<TableCell align="right">{row.imagesCount}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
};

export default ResultsTable;