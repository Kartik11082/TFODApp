// Define our labelmap
const labelMap = {
	1: { name: "a", color: "red" },
	2: { name: "b", color: "yellow" },
	3: { name: "c", color: "lime" },
	4: { name: "d", color: "blue" },
	5: { name: "e", color: "green" },
	6: { name: "f", color: "pink" },
	7: { name: "g", color: "white" },
	8: { name: "h", color: "teal" },
	9: { name: "i", color: "brown" },
	10: { name: "j", color: "black" },
};

// Define a drawing function
export const drawRect = (
	boxes,
	classes,
	scores,
	threshold,
	imgWidth,
	imgHeight,
	ctx,
	guesstext
) => {
	for (let i = 0; i <= boxes.length; i++) {
		if (boxes[i] && classes[i] && scores[i] > threshold) {
			// console.log(scores[i][1])
			// console.log('go')
			// Extract variables
			const [y, x, height, width] = boxes[i];
			const text = classes[i];

			// Set styling
			ctx.strokeStyle = labelMap[text]["color"];
			ctx.lineWidth = 5;
			ctx.fillStyle = labelMap[text]["color"];
			ctx.font = "28px Arial";

			// DRAW!!
			ctx.beginPath();
			ctx.fillText(
				labelMap[text]["name"] + " - " + Math.round(scores[i] * 100) / 100,
				x * imgWidth,
				y * imgHeight - 10
			);
			ctx.rect(
				x * imgWidth,
				y * imgHeight,
				(width * imgWidth) / 2,
				(height * imgHeight) / 1.5
			);
			ctx.stroke();

			guesstext = labelMap[text]["name"];
			console.log(guesstext);

			// Queue Logic
			let recognizedStrings
			recognizedStrings = document.getElementById("p1").innerHTML + guesstext;
			// console.log("Document Get element: ", document.getElementById("p1").innerHTML)

			document.getElementById("p1").innerHTML = outputQueue(recognizedStrings);;
		}
	}
};


const outputQueue = (recognizedStrings) => {
	let maxLength = 20
	let recognizedList = recognizedStrings.split("")
	if (recognizedList.length > maxLength) {
		recognizedList.shift()
		return recognizedList.join("")

	}
	return recognizedStrings
}