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

      if (
        guesstext !==
        document
          .getElementById("p1")
          .innerHTML.charAt(document.getElementById("p1").innerHTML.length - 1)
      ) {
        let recognizedStrings;
        recognizedStrings = document.getElementById("p1").innerHTML + guesstext;
        // console.log("Document Get element: ", document.getElementById("p1").innerHTML)

        document.getElementById("p1").innerHTML =
          outputQueue(recognizedStrings);
        if (guesstext === "j") {
          window.open("https://www.dailymoth.com/blog?category=TOP%20STORIES");
        }
      }
    }
  }
};

const outputQueue = (recognizedStrings) => {
  let maxLength = 20;
  let recognizedList = recognizedStrings.split("");
  if (recognizedList.length > maxLength) {
    recognizedList.shift();
    return recognizedList.join("");
  }
  return recognizedStrings;
};

export const AddPreChar = () => {
  let x = document.getElementById("p1").innerHTML;
  x = x + x.charAt(x.length - 1);
  document.getElementById("p1").innerHTML = outputQueue(x);
};

export const BackSpace = () => {
  document.getElementById("p1").innerHTML = document
    .getElementById("p1")
    .innerHTML.slice(0, -1);
};

export const Space = () => {
  let x = document.getElementById("p1").innerHTML + " ";
  document.getElementById("p1").innerHTML = outputQueue(x);
};

export const Clear = () => {
  document.getElementById("p1").innerHTML = "";
};
