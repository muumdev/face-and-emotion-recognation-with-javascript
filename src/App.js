import React, { useEffect } from "react";
import * as faceapi from "face-api.js";
import "./App.css";

function App() {
  const startCamera = () => {
    const video = document.getElementById("video");

    navigator.getUserMedia(
      {
        video: {},
      },
      (stream) => (video.srcObject = stream),
      (err) => console.log(err)
    );
  };

  useEffect(() => {
    const fetchModels = async () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]).then(startCamera());
    };

    fetchModels();
    const video = document.getElementById("video");

    video.addEventListener("play", () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);
      const boxSize = {
        width: video.width,
        height: video.height,
      };

      faceapi.matchDimensions(canvas, boxSize);

      setInterval(async () => {
        //async
        // await
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        const resizedDetections = faceapi.resizeResults(detections, boxSize);

        faceapi.draw.drawDetections(canvas, resizedDetections);

        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        // console.log(detections);
      }, 200);
    });
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <video id="video" width="720" height="540" autoPlay muted></video>
      </header>
    </div>
  );
}

export default App;
