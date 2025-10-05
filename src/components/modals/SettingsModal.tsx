// src/components/ui/modal/SettingsModal.tsx
import React from "react";
import BaseModal from "./BaseModal";
import SettingsPanel from "../ui/SettingsPanel";

interface SettingsModalProps {
  show: boolean;
  handleClose: () => void;
  cameraFrame: "rectangle" | "circle";
  handleCameraFrameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  show,
  handleClose,
  cameraFrame,
  handleCameraFrameChange,
}) => {
  return (
    <BaseModal
      show={show}
      onClose={handleClose}
      title="Settings"
      footer={
        <button className="btn btn-primary" onClick={handleClose}>
          Done
        </button>
      }
    >
      <SettingsPanel
        cameraFrame={cameraFrame}
        handleCameraFrameChange={handleCameraFrameChange}
      />
    </BaseModal>
  );
};

export default SettingsModal;
