import { StartIcon } from "../components/icons/StartIcon";
import { StopIcon } from "../components/icons/StopIcon";
import { SettingsIcon } from "../components/icons/SettingsIcon";
import { useState, useRef, useEffect } from "react";
import MIC from "../assets/MicOn.svg";
import MICOFF from "../assets/MicOff.svg";
import SCREENSHAREON from "../assets/ScreenShareOn.svg";
import SCREENSHAREOFF from "../assets/ScreenShareOff.svg";
import VIDEOON from "../assets/VideocamOn.svg";
import VIDEOOFF from "../assets/VideocamOff.svg";

import { shortcutConfig } from "../components/ui/ShortcutConfig.tsx";
import { useHotkeys } from "../components/ui/useHotkeys.tsx";
import SettingsModal from "./SettingsModal.tsx";
import DownloadModal from "./DownloadModal.tsx";


export const RecordPage = () => {
  const [screenShare, setScreenShare] = useState<MediaStream | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>()
  const [cameraStream, setCameraStream] = useState<MediaStream | null>()
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const recordedChunksRef = useRef<Blob[]>([]);
  const [cameraFrame, setCameraFrame] = useState<'rectangle' | 'circle'>('rectangle')
  const [blurCamera, setBlurCamera] = useState<boolean>(false)

  const toggleBlurCamera = () => {
    setBlurCamera(!blurCamera)
  }

  const handleCameraFrameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCameraFrame(event.target.value as 'rectangle' | 'circle');
  }

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const handleOpenSettings = () => setShowSettingsModal(true);
  const handleCloseSettings = () => setShowSettingsModal(false);

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
      stopAllStreams();
    }
  };

  useHotkeys(shortcutConfig, {
    isRecording,
    startRecording,
    stopRecording,
    toggleScreenCapture,
    toggleCamera,
    toggleAudio
  });

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
            <div className={`camera-container ${screenShare ? 'pip' : 'full-screen'} ${cameraFrame === 'circle' ? 'camera-frame-circle' : 'camera-frame-rectangle'}`}>
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
          <button className={screenShare ? 'is-active' : ''} aria-label="Screenshare" onClick={toggleScreenCapture}>
            <img src={screenShare ? SCREENSHAREON : SCREENSHAREOFF} alt={screenShare ? "Stop Recording" : "Start Recording"} />
          </button>
          <button className={cameraStream ? 'is-active' : ''} aria-label="Virtual Camera" onClick={toggleCamera}>
            <img src={cameraStream ? VIDEOON : VIDEOOFF} alt="Virtual Camera" />
          </button>
          <button className={audioStream ? 'is-active' : ''} aria-label="Microphone" onClick={toggleAudio}>
            <img src={audioStream ? MIC : MICOFF} alt={audioStream ? "Microphone On" : "Microphone Off"} />
          </button>
          <div>
            {!isRecording ? (
              <button className='record-btn' onClick={startRecording} disabled={!screenShare && !cameraStream && !audioStream}>
                <StartIcon />
              </button>
            ) : (
              <button onClick={stopRecording}>
                <StopIcon />
              </button>
            )}
          </div>
          <button aria-label="Settings" onClick={handleOpenSettings}>
              <SettingsIcon />
          </button>
        </div>
      </div>
      <DownloadModal show={show} handleClose={handleClose} videoUrl={videoUrl} />
      <SettingsModal 
        showSettingsModal={showSettingsModal}
        handleCloseSettings={handleCloseSettings}
        cameraFrame={cameraFrame}
        handleCameraFrameChange={handleCameraFrameChange}
        toggleBlurCamera={toggleBlurCamera}
        blurCamera={blurCamera}
      />
    </>
  );
};
