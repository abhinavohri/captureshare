import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface DownloadModalProps {
    show: boolean;
    handleClose: () => void;
    videoUrl: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({show, handleClose, videoUrl}) => (
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
)

export default DownloadModal;