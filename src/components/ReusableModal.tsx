// ReusableModal.tsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  handleSubmit: () => void;
  children?: React.ReactNode;
}

export const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  handleSubmit,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {children} {/* This is where the form will be injected */}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
