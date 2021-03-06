import parse from 'date-fns/parse';
import differenceInDays from 'date-fns/differenceInDays';

class Parser {

	static getJobs = (str) => {
		const jobsArr = str.match(/(?<=StartDate)[\s\S]+?(?=(StartDate|$))/g).map((jobStr) => "StartDate" + jobStr);
		if(jobsArr.length === 0) {
			return false;
		} else {
			return jobsArr;
		}
	};

	static getHeadObjFromJobStr = (jobStr) => {
		const startDate = jobStr.match(/(?<=StartDate)\s{1,20}.+/)[0].trim();
		const startTime = jobStr.match(/(?<=StartTime)\s{1,20}.+/)[0].trim();
		const printer = jobStr.match(/(?<=Printer)\s{1,20}.+/)[0].trim();
		const halftone = jobStr.match(/(?<=Halftone)\s{1,20}.+/)[0].trim();
		const copies = jobStr.match(/(?<=Copies)\s{1,20}.+/)[0].trim();
		const mirror = jobStr.match(/(?<=Mirror)\s{1,20}.+/)[0].trim();
		const density = jobStr.match(/(?<=Density)\s{1,20}.+/)[0].trim();
		const printerProfile = jobStr.match(/(?<=PrinterProfile)\s{1,20}.+/)[0].trim();

		return {
			startDate,
			startTime,
			printer,
			halftone,
			copies,
			mirror,
			density,
			printerProfile
		};
	};

	static getFooterObjFromJobStr = (jobStr) => {

		if(! jobStr.match(/(?<=ConsumedCm)\s+.+/)) {
			return false;
		}

		const consumedCm = jobStr.match(/(?<=ConsumedCm)\s{1,20}.+/)[0].trim();
		const inkCyan = jobStr.match(/(?<=InkCyan)\s{1,20}.+/)[0].trim();
		const inkMagenta = jobStr.match(/(?<=InkMagenta)\s{1,20}.+/)[0].trim();
		const inkYellow = jobStr.match(/(?<=InkYellow)\s{1,20}.+/)[0].trim();
		const inkBlack = jobStr.match(/(?<=InkBlack)\s{1,20}.+/)[0].trim();
		const inkLC = jobStr.match(/(?<=InkLC)\s{1,20}.+/)[0].trim();
		const inkLM = jobStr.match(/(?<=InkLM)\s{1,20}.+/)[0].trim();
		const printEnd = jobStr.match(/(?<=PrintEnd)\s{1,20}.+/)[0].trim();
		const minutesTotal = jobStr.match(/(?<=MinutesTotal)\s{1,20}.+/)[0].trim();

		let aborted = jobStr.match(/(?<=Aborted)\s+.+/);
		if(! aborted) {
			aborted = false;
		} else {
			aborted = true;
		}

		return {
			consumedCm,
			inkCyan,
			inkMagenta,
			inkYellow,
			inkBlack,
			inkLC,
			inkLM,
			printEnd,
			minutesTotal,
			aborted
		};
	};

	static getImagesObjectsArrFromJobStr = (jobStr) => {
		// console.log("jobStr: ", jobStr);

		let bodyStr = "";

		try {
			bodyStr = "ImgName" + jobStr.match(/(?<=ImgName)[\s\S]+?(?=(ConsumedCm|$))/g)[0];
		} catch (e) {
			bodyStr = "";
			return [];
		}

		const imagesStrArr = bodyStr.trim().split("\n\r").map(str => str.trim());

		return imagesStrArr.reduce((acc, imageStr) => {
			const imageObj = this.imageParse(imageStr);
			if(imageObj) {
				acc.push(imageObj);
			}
			return acc;
		}, []);
	};

	static imageParse = (imageStr) => {
		let imgFullPath = imageStr.match(/(?<=ImgName)\s{1,20}.+/);
		if(! imgFullPath) {
			console.log("Image ImgName parsing error with: ", imageStr);
			return false;
		}
		imgFullPath = imgFullPath[0].trim();

		const imgName = imgFullPath.split("\\").pop();

		let imgNumber = imgName.match(/\d{6}/);
		if(! imgNumber) {
			imgNumber = false;
		}
		imgNumber = imgNumber[0];

		if(imageStr.includes("RipStart")) {
			console.log("Image parsing error with: ", imageStr);
			return false;
		}

		let widthCm = imageStr.match(/(?<=WidthCm)\s{1,20}.+/);
		if(! widthCm) {
			console.log("Image WidthCm parsing error with: ", imageStr);
			return false;
		}
		widthCm = widthCm[0].trim();

		let heightCm = imageStr.match(/(?<=HeightCm)\s{1,20}.+/);
		if(! heightCm) {
			console.log("Image HeightCm parsing error with: ", imageStr);
			return false;
		}
		heightCm = heightCm[0].trim();

		let areaCm2 = imageStr.match(/(?<=AreaCm2)\s{1,20}.+/);
		if(! areaCm2) {
			console.log("Image AreaCm2 parsing error with: ", imageStr);
			return false;
		}
		areaCm2 = areaCm2[0].trim();

		let inputProfile = imageStr.match(/(?<=InputProfile)\s{1,20}.+/);
		if(! inputProfile) {
			console.log("Image InputProfile parsing error with: ", imageStr);
			inputProfile = "";
		} else {
			inputProfile = inputProfile[0].trim();
		}

		let rotated = imageStr.match(/(?<=Rotated)\s{1,20}.+/);
		if(! rotated) {
			rotated = 0;
		} else {
			rotated = rotated[0].trim();
		}

		return {
			imgFullPath,
			imgName,
			imgNumber,
			widthCm,
			heightCm,
			areaCm2,
			inputProfile,
			rotated
		};

	};

	static jobParse = (jobStr) => {

		const headObj = this.getHeadObjFromJobStr(jobStr);

		const nowDate = new Date();

		const jobStartDate = parse(headObj.startDate, 'dd.MM.yyyy', new Date());

		if(differenceInDays(nowDate, jobStartDate) > 30) {
			return false;
		}

		let imagesObjectsArr = this.getImagesObjectsArrFromJobStr(jobStr);

		let footerObj = this.getFooterObjFromJobStr(jobStr);
		if(! footerObj) {
			footerObj = { fail: true };
		}

		return {
			...headObj,
			...footerObj,
			images: imagesObjectsArr
		}
	};

	static parse = (str, plotter) => {
		let result = [];
		const jobsStrArr = this.getJobs(str);
		for(let i = 0; i < jobsStrArr.length; i++) {
			const jobObj = this.jobParse(jobsStrArr[i]);
			if(jobObj) {
				result.push(jobObj);
			}
		}
		result = result.map( jobObj => {
			return {
				...jobObj,
				plotter
			}
		});
		console.log("Parse result: ", result);
		return result;
	};
}

export default Parser;

// parse -> jobParse -> get Head Obj From JobStr -> get Images Objects Arr From JobStr -> get Footer Obj From JobStr