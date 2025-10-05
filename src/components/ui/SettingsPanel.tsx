import React from "react";

interface SettingsPanelProps {
    cameraFrame: 'rectangle' | 'circle';
    handleCameraFrameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ cameraFrame, handleCameraFrameChange }) => {
  return (
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
  );
};

export default SettingsPanel;