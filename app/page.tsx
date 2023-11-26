'use client';

import { useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';
import Webcam from 'react-webcam';

const WebcamFaceColorSegmentation: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<any>(null);

  const runBodysegment = async () => {
    const net = await bodyPix.load();
    console.log('BodyPix model loaded.');

    setInterval(() => {
      detect(net);
    }, 2000);
  };

  const detect = async (net: any) => {
    // Check data is available
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
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

      const person = await net.segmentPersonParts(video);
      console.log(person);

      const coloredPartImage = bodyPix.toColoredPartMask(person);
      const opacity = 0.7;
      const flipHorizontal = false;
      const maskBlurAmount = 0;
      const canvas = canvasRef.current;

      bodyPix.drawMask(
        canvas,
        video,
        coloredPartImage,
        opacity,
        maskBlurAmount,
        flipHorizontal
      );
    }
  };

  runBodysegment();

  return (
    <div>
      <h4>Webcam Face Color Segmentation</h4>
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
          width: 640,
          height: 480,
        }}
      />
    </div>
  );
};

export default WebcamFaceColorSegmentation;
