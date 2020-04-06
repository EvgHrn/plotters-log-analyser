export class Parser {

	static parse = (str) => {

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

		const heads = str.match(headRegExp);
		console.log('jobs: ', heads);

		const footers = str.match(footerRegExp);
		console.log('footers: ', footers);

		if(heads.length !== footers.length) {
			throw new Error("Parsing error");
		}

		let bodes = [];

		for(let i = 0; i < heads.length; i++) {
			const bodyStartIndex = str.indexOf(heads[i]) + heads[i].length;
			const bodyEndIndex = str.indexOf(footers[i]);
			bodes.push(str.slice(bodyStartIndex, bodyEndIndex));
		}

		console.log('bodes: ', bodes);
	}
}