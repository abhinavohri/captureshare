import START from "../assets/start.svg";
import STOP from "../assets/stop.svg";
import { useState, useRef } from "react";
import CAMERA from "../assets/camera.svg";
import MIC from "../assets/mic_on.svg";
import MICOFF from "../assets/mic_off.svg";

export const RecordPage = () => {
  const [screenShare, setScreenShare] = useState<MediaStream | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>()
  const [cameraStream, setCameraStream] = useState<MediaStream | null>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const cameraRef = useRef<HTMLVideoElement>(null)

  const displayMediaOptions = {
    video: {
      displaySurface: "window",
    },
    audio: false,
  };

  const toggleScreenCapture = async () => {
    if (screenShare) {
      screenShare.getTracks().forEach(track => track.stop())
      setScreenShare(null);
    } else {
      try {
        const captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        if (videoRef.current) {
          videoRef.current.srcObject = captureStream;
        }
        setScreenShare(captureStream)
      } catch (err) {
        console.log(`Err: ${err}`)
      }
    }
  }

  const toggleCamera = async () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    } else {
      try {
        // not fetching audio and video together because it would only show 1 prompt
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
        }
        setCameraStream(stream);
      } catch (err) {
        console.log(err)
      }
    }
  }

  const toggleAudio = async () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null)
      alert('sound off')
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        setAudioStream(stream);
      } catch (err) {
        console.log(err)
      }
    }
  }

  const stopAllStreams = async () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    if (screenShare) {
      screenShare.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }  
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
  }
  return (
    <>
      <div>Record Page</div>
      <video
        ref={videoRef}
        height='500px'
        width='500px'
        autoPlay
        playsInline
        muted // to prevent audio feedback
        className="live-preview-video"
      />
      <video
        ref={cameraRef}
        className="camera-preview"
        autoPlay
        playsInline
        muted // to prevent audio feedback
      />
      <div className="button-tray">
        <button aria-label="Start Recording" onClick={toggleScreenCapture}>
          <img src={screenShare ? STOP : START} alt={screenShare ? "Stop Recording" : "Start Recording"} />
        </button>
        <button aria-label="Virtual Camera" onClick={toggleCamera}>
          <img src={CAMERA} alt="Virtual Camera" />
        </button>
        <button aria-label="Microphone" onClick={toggleAudio}>
          <img src={audioStream ? MIC : MICOFF} alt={audioStream ? "Microphone On" : "Microphone Off"} />
        </button>
        <button onClick={stopAllStreams}>STOP ALL</button>
      </div>
    </>
  );
};
