import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
// e.g. import * as tfmodel from "@tensorflow-models/tfmodel";
import Webcam from "react-webcam";
// 2. TODO - Import drawing utility here
import { drawRect, AddPreChar, BackSpace, Space, Clear } from "../utilities";
// import { button } from
import "./home.css";

const Home = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    // e.g. const net = await cocossd.load();
    //https://hsrmodel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json
    // const net = await tf.loadGraphModel(
    //   "https://hsrmodel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
    // );
    const net = await tf.loadGraphModel(
      "https://hsrmodelv2.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
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
      const classes = await obj[3].array();
      const scores = await obj[4].array();
      const guesstext = null;
      // console.log(scores);
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
        <h1
          style={{
            position: "absolute",
            top: "15px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          Hand Sign Recognition System
        </h1>

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

        <button
          onClick={AddPreChar}
          className="button-84"
          style={{
            position: "absolute",
            top: "150px",
            left: 120,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Repeat
        </button>

        <button
          onClick={Space}
          className="button-84"
          style={{
            position: "absolute",
            top: "250px",
            left: 120,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Space
        </button>

        <button
          onClick={BackSpace}
          className="button-84"
          style={{
            position: "absolute",
            top: "350px",
            left: 120,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          BackSpace
        </button>

        <button
          onClick={Clear}
          className="button-84"
          style={{
            position: "absolute",
            top: "450px",
            left: 120,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Clear
        </button>

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
            top: "270px",
            marginLeft: "auto",
            marginRight: "auto",
            width: 640,
            height: 40,
            // background: "#121517",
            backgroundImage: `linear-gradient(#282828, #141414)`,
            // zindex: 10,
            borderRadius: 7,
          }}
        ></p>
      </header>
    </div>
  );
};

export default Home;
