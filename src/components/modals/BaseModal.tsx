import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React from "react";

interface BaseModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  backdrop?: "static" | true | false;
  keyboard?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  show,
  onClose,
  title,
  children,
  footer,
  backdrop = true,
  keyboard = true,
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop={backdrop}
      keyboard={keyboard}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {footer ? (
          footer
        ) : (
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BaseModal;
