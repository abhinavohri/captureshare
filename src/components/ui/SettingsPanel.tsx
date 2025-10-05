import React from "react";
import Form from 'react-bootstrap/Form';

interface SettingsPanelProps {
    cameraFrame: 'rectangle' | 'circle';
    handleCameraFrameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    blurCamera: boolean;
    toggleBlurCamera: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ cameraFrame, handleCameraFrameChange, blurCamera, toggleBlurCamera }) => {
  return (
    <>
    <fieldset className="settings-group">
        <legend className="settings-legend">Camera Shape</legend>
        <div className="radio-option">
            <input
            type="radio"
            id="shape-rectangle"
            name="cameraFrame"
            value="rectangle"
            checked={cameraFrame === 'rectangle'}
            onChange={handleCameraFrameChange}
            />
            <label htmlFor="shape-rectangle">Rectangle</label>
        </div>
        <div className="radio-option">
            <input
            type="radio"
            id="shape-circle"
            name="cameraFrame"
            value="circle"
            checked={cameraFrame === 'circle'}
            onChange={handleCameraFrameChange}
            />
            <label htmlFor="shape-circle">Circle</label>
        </div>
    </fieldset>
     <fieldset className="settings-group">
            <legend className="settings-legend">Camera Effects</legend>
            <Form.Check 
                type="switch"
                id="blur-camera-switch"
                label="Blur Camera"
                checked={blurCamera}
                onChange={toggleBlurCamera}
            />
        </fieldset>
    </>
  );
};

export default SettingsPanel;