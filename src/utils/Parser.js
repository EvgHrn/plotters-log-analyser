export class Parser {

	static getJobs = (str) => {
		const jobsArr = str.match(/(?<=StartDate)[\s\S]+?(?=(StartDate|$))/g).map((jobStr) => "StartDate" + jobStr);
		if(jobsArr.length === 0) {
			return false;
		} else {
			return jobsArr;
		}
	};

	static getHeadObjFromJobStr = (jobStr) => {
		const startDate = jobStr.match(/(?<=StartDate)\s+.+/)[0].trim();
		const startTime = jobStr.match(/(?<=StartTime)\s+.+/)[0].trim();
		const printer = jobStr.match(/(?<=Printer)\s+.+/)[0].trim();
		const halftone = jobStr.match(/(?<=Halftone)\s+.+/)[0].trim();
		const copies = jobStr.match(/(?<=Copies)\s+.+/)[0].trim();
		const mirror = jobStr.match(/(?<=Mirror)\s+.+/)[0].trim();
		const density = jobStr.match(/(?<=Density)\s+.+/)[0].trim();
		const printerProfile = jobStr.match(/(?<=PrinterProfile)\s+.+/)[0].trim();

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

		const consumedCm = jobStr.match(/(?<=ConsumedCm)\s+.+/)[0].trim();
		const inkCyan = jobStr.match(/(?<=InkCyan)\s+.+/)[0].trim();
		const inkMagenta = jobStr.match(/(?<=InkMagenta)\s+.+/)[0].trim();
		const inkYellow = jobStr.match(/(?<=InkYellow)\s+.+/)[0].trim();
		const inkBlack = jobStr.match(/(?<=InkBlack)\s+.+/)[0].trim();
		const inkLC = jobStr.match(/(?<=InkLC)\s+.+/)[0].trim();
		const inkLM = jobStr.match(/(?<=InkLM)\s+.+/)[0].trim();
		const printEnd = jobStr.match(/(?<=PrintEnd)\s+.+/)[0].trim();
		const minutesTotal = jobStr.match(/(?<=MinutesTotal)\s+.+/)[0].trim();

		let aborted = "0";

		try {
			aborted = jobStr.match(/(?<=Aborted)\s+.+/)[0].trim();
		} catch (e) {
			;
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
		const bodyStr = "ImgName" + jobStr.match(/(?<=ImgName)[\s|\S]+?(?=(ConsumedCm|$))/g)[0];
		const imagesStrArr = bodyStr.trim().split("\n\r").map(str => str.trim());
		return imagesStrArr.map((imageStr) => this.imageParse(imageStr));
	};

	static imageParse = (imageStr) => {
		console.log("imageStr: ", imageStr);
		const imgName = imageStr.match(/(?<=ImgName)\s+.+/)[0].trim();
		// RipStart
		const widthCm = imageStr.match(/(?<=WidthCm)\s+.+/)[0].trim();
		const heightCm = imageStr.match(/(?<=HeightCm)\s+.+/)[0].trim();
		const areaCm2 = imageStr.match(/(?<=AreaCm2)\s+.+/)[0].trim();
		const inputProfile = imageStr.match(/(?<=InputProfile)\s+.+/)[0].trim();
		let rotated = 0;

		try {
			rotated = imageStr.match(/(?<=Rotated)\s+.+/)[0].trim();
		} catch (e) {
			// rotated = 0;
		}

		return {
			imgName,
			widthCm,
			heightCm,
			areaCm2,
			inputProfile,
			rotated
		};

	};

	static jobParse = (jobStr) => {
		const headObj = this.getHeadObjFromJobStr(jobStr);
		const imagesObjectsArr = this.getImagesObjectsArrFromJobStr(jobStr);
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

	static parse = (str) => {
		let result = [];
		const jobsStrArr = this.getJobs(str);
		for(let i = 0; i < jobsStrArr.length; i++) {
			result.push(this.jobParse(jobsStrArr[i]));
		}
		console.log("result: ", result);
	};
}