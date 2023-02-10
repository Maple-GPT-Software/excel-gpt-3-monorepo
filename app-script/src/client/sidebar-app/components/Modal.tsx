import React, { ReactNode } from 'react';
import {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
} from '@radix-ui/react-dialog';

import './Modal.style.css';

interface ModalProps {
  open?: boolean;
  setOpen: (o: boolean) => void;
  trigger?: ReactNode;
  title: string;
  triggerButtonText?: string;
  children: ReactNode;
}

function Modal(props: ModalProps) {
  const { open, setOpen, trigger, title, triggerButtonText, children } = props;
  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>{!triggerButtonText && trigger}</Trigger>
      <Portal>
        <Overlay className="modal-overlay" />
        <Content className="modal-content">
          <Title className="modal-title">{title}</Title>
          <Description className="modal-description" />
          {children}
          <Close className="modal-close" asChild>
            <button
              className="icon-button"
              aria-label="close"
              onClick={() => setOpen(false)}
            >
              X
            </button>
          </Close>
        </Content>
      </Portal>
    </Root>
  );
}

export default Modal;
