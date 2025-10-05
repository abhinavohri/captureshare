import React from "react";
import BaseModal from "./BaseModal";

interface DownloadModalProps {
  show: boolean;
  handleClose: () => void;
  videoUrl: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  show,
  handleClose,
  videoUrl,
}) => {

  const downloadButton = <button>
    <a href={videoUrl} download={`recording-${Date.now()}.webm`}>
      Download Video
    </a>
  </button>;

  return (
    <BaseModal
      show={show}
      onClose={handleClose}
      title="Recording Complete"
      backdrop="static"
      keyboard={false}
      footer={downloadButton}
    >
      <video className="download-preview" src={videoUrl} controls />
    </BaseModal>
  );
};

export default DownloadModal;
