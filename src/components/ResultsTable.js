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
	warningRow: {
		backgroundColor: '#ffbdce',
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
						{/*<TableCell>Время</TableCell>*/}
						<TableCell align="center">Номер</TableCell>
						<TableCell align="center">Кол-во</TableCell>
						<TableCell align="center">Тираж</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.order} className={(row.logCount > row.accessCount) ? classes.warningRow : null}>
							<TableCell component="th" scope="row" align="center">
								{row.order}
							</TableCell>
							<TableCell align="center">{row.logCount}</TableCell>
							<TableCell align="center">{row.accessCount}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
};

export default ResultsTable;