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

	static parse = (str) => {

		const heads = this.getHeads(str);
		console.log('jobs: ', heads);

		const footers = this.getFooters(str);
		console.log('footers: ', footers);

		if(heads.length !== footers.length) {
			throw new Error("Parsing error");
		}

		const bodies = this.getBodies(str, heads, footers);
		console.log('bodies: ', bodies);
	}
}