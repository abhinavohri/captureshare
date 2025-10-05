import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import SettingsPanel from "../components/ui/SettingsPanel";

interface SettingsModalProps {
    showSettingsModal: boolean;
    handleCloseSettings: () => void;
    cameraFrame: 'rectangle' | 'circle';
    handleCameraFrameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    toggleBlurCamera: () => void;
    blurCamera: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ showSettingsModal, handleCloseSettings, cameraFrame, handleCameraFrameChange, toggleBlurCamera, blurCamera }) => (
    <Modal show={showSettingsModal} onHide={handleCloseSettings} centered>
        <Modal.Header closeButton>
            <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <SettingsPanel
                cameraFrame={cameraFrame}
                handleCameraFrameChange={handleCameraFrameChange}
                toggleBlurCamera={toggleBlurCamera}
                blurCamera={blurCamera}
            />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleCloseSettings}>
                Done
            </Button>
        </Modal.Footer>
    </Modal>
);

export default SettingsModal;