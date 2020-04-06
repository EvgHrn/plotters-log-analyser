export class Parser {

	static getHeads = (str) => {
		const headRegExp = new RegExp("StartDate.*\\s\\s" +
			"StartTime.*\\s\\s" +
			"Printer.*\\s\\s" +
			"Halftone.*\\s\\s" +
			"Copies.*\\s\\s" +
			"Mirror.*\\s\\s" +
			"Sharpen.*\\s\\s" +
			"InkLimit.*\\s\\s" +
			"Density.*\\s\\s" +
			"PrinterProfile.*\\s", "gm"
		);
		return str.match(headRegExp);
	};

	static getBodies = (str, heads, footers) => {
		let bodies = [];

		for(let i = 0; i < heads.length; i++) {
			const bodyStartIndex = str.indexOf(heads[i]) + heads[i].length;
			const bodyEndIndex = str.indexOf(footers[i]);
			bodies.push(str.slice(bodyStartIndex, bodyEndIndex));
		}

		return bodies;
	};

	static getFooters = (str) => {
		const footerRegExp = new RegExp("ConsumedCm.*\\s\\s" +
			"InkCyan.*\\s\\s" +
			"InkMagenta.*\\s\\s" +
			"InkYellow.*\\s\\s" +
			"InkBlack.*\\s\\s" +
			"InkLC.*\\s\\s" +
			"InkLM.*\\s\\s" +
			"PrintEnd.*\\s\\s" +
			"MinutesTotal.*\\s" +
			"(\\sAborted.*\\s)?", "gm"
		);
		return str.match(footerRegExp);
	};

	static getImages = (body) => {
		return body.trim().split("\n\r");
	};

	static headParse = (headStr) => {

		const startDate = headStr.match(/(?<=StartDate)\s+.+/)[0].trim();
		const startTime = headStr.match(/(?<=StartTime)\s+.+/)[0].trim();
		const printer = headStr.match(/(?<=Printer)\s+.+/)[0].trim();
		const halftone = headStr.match(/(?<=Halftone)\s+.+/)[0].trim();
		const copies = headStr.match(/(?<=Copies)\s+.+/)[0].trim();
		const mirror = headStr.match(/(?<=Mirror)\s+.+/)[0].trim();
		const density = headStr.match(/(?<=Density)\s+.+/)[0].trim();
		const printerProfile = headStr.match(/(?<=PrinterProfile)\s+.+/)[0].trim();

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

	/**
	 *
	 * @param imageStr
	 * @returns {{imgName: string, inputProfile: string, widthCm: string, heightCm: string, rotated: number, areaCm2: string}}
	 */
	static imageParse = (imageStr) => {

		const imgName = imageStr.match(/(?<=ImgName)\s+.+/)[0].trim();
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

	static footerParse = (footerStr) => {

		const consumedCm = footerStr.match(/(?<=ConsumedCm)\s+.+/)[0].trim();
		const inkCyan = footerStr.match(/(?<=InkCyan)\s+.+/)[0].trim();
		const inkMagenta = footerStr.match(/(?<=InkMagenta)\s+.+/)[0].trim();
		const inkYellow = footerStr.match(/(?<=InkYellow)\s+.+/)[0].trim();
		const inkBlack = footerStr.match(/(?<=InkBlack)\s+.+/)[0].trim();
		const inkLC = footerStr.match(/(?<=InkLC)\s+.+/)[0].trim();
		const inkLM = footerStr.match(/(?<=InkLM)\s+.+/)[0].trim();
		const printEnd = footerStr.match(/(?<=PrintEnd)\s+.+/)[0].trim();
		const minutesTotal = footerStr.match(/(?<=MinutesTotal)\s+.+/)[0].trim();

		let aborted = "0";

		try {
			aborted = footerStr.match(/(?<=Aborted)\s+.+/)[0].trim();
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

	static parse = (str) => {

		const heads = this.getHeads(str);
		console.log('heads: ', heads);

		const footers = this.getFooters(str);
		console.log('footers: ', footers);

		if(heads.length !== footers.length) {
			throw new Error("Parsing error");
		}

		const bodies = this.getBodies(str, heads, footers);
		console.log('bodies: ', bodies);

		let result = [];

		for (let i = 0; i < heads.length; i++) {

			const imagesStrArr = this.getImages(bodies[i]);

			const imageObjectsArr = imagesStrArr.map((imageStr) => this.imageParse(imageStr));

			result.push({
				...this.headParse(heads[i]),
				...this.footerParse(footers[i]),
				images: imageObjectsArr
			});

		}

		console.log("result: ", result);

		return result;
	}
}