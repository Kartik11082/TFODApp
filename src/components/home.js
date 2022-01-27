import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
// e.g. import * as tfmodel from "@tensorflow-models/tfmodel";
import Webcam from "react-webcam";
// 2. TODO - Import drawing utility here
import { drawRect } from "../utilities";

const Home = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    // e.g. const net = await cocossd.load();
    //https://hsrmodel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json
    const net = await tf.loadGraphModel(
      "https://hsrmodel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
    );

    //  Loop and detect hands
    // A function to be executed every delay milliseconds. The first execution happens after delay milliseconds. 16.7
    setInterval(() => {
      detect(net);
    }, 16.7);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);

      const boxes = await obj[2].array();
      const classes = await obj[1].array();
      const scores = await obj[3].array();
      const guesstext = null;

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)
      drawRect(
        boxes[0],
        classes[0],
        scores[0],
        0.9,
        videoWidth,
        videoHeight,
        ctx,
        guesstext
      );

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    runCoco();
  });

  return (
    <div className="App">
      <header className="App-header">
        {/* <div
		  style={{
			background: "#333843",
		  }}
		> */}
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            borderRadius: 7,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            borderRadius: 7,
          }}
        />
        <p
          id="p1"
          style={{
            position: "relative",
            top: "265px",
            marginLeft: "auto",
            marginRight: "auto",
            width: 640,
            height: 40,
            background: "#121517",
            // zindex: 10,
            borderRadius: 5,
          }}
        ></p>
        {/* </div> */}
      </header>
    </div>
  );
};

export default Home;
