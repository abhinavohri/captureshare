import START from "../assets/start.svg";
import STOP from "../assets/stop.svg";
import { useState, useRef, useEffect } from "react";
import CAMERA from "../assets/camera.svg";
import MIC from "../assets/mic_on.svg";
import MICOFF from "../assets/mic_off.svg";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const RecordPage = () => {
  const [screenShare, setScreenShare] = useState<MediaStream | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>()
  const [cameraStream, setCameraStream] = useState<MediaStream | null>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const cameraRef = useRef<HTMLVideoElement>(null)

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const recordedChunksRef = useRef<Blob[]>([]);

  // deal with misclicks
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isRecording || videoUrl) {
        event.preventDefault();
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRecording, videoUrl])

  // show the camera feed only when its on
  useEffect(() => {
    if (cameraStream && cameraRef.current) {
      cameraRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // modal
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setVideoUrl("");
  }

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
      setScreenShare(null);
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }

  const startRecording = () => {
    const tracks = [
      ...(screenShare?.getVideoTracks() || []),
      ...(cameraStream?.getVideoTracks() || []),
      ...(audioStream?.getAudioTracks() || []),
    ];

    if (tracks.length === 0) {
      alert("Please enable at least one source (screen, camera, or microphone).");
      return;
    }
    recordedChunksRef.current = [];

    const combinedStream = new MediaStream(tracks);
    const recorder = new MediaRecorder(combinedStream);

    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setShow(true)
      setIsRecording(false);
    };

    recorder.start();
    setIsRecording(true);
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  return (
    <>
      <div className="main-contianer">
        <div className='capture-container'>
          <video
            ref={videoRef}
            autoPlay
            playsInline

            muted // to prevent audio feedback
            id="screenshare-preview"
          />
          {cameraStream &&
            <div className={`camera-container ${screenShare ? 'pip' : 'full-screen'}`}>
              <video
                ref={cameraRef}
                id="camera-preview"
                autoPlay
                playsInline

                muted // to prevent audio feedback
              />
            </div>
          }
        </div>
        <div className="control-tray">
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
          <div>
            {!isRecording ? (
              <button onClick={startRecording} disabled={!screenShare && !cameraStream && !audioStream}>
                Record
              </button>
            ) : (
              <button onClick={stopRecording}>
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Recording Complete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <video className='download-preview' src={videoUrl} controls />
          <button>
            <a
            href={videoUrl}
            download={`recording-${Date.now()}.webm`}
          >
            Download Video
          </a>
          </button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
