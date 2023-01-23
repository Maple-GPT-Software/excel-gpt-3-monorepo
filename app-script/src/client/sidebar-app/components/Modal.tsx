import React, { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {/* {triggerButtonText && <button>{triggerButtonText}</button>} */}
        {!triggerButtonText && trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <Dialog.Title className="modal-title">{title}</Dialog.Title>
          <Dialog.Description className="modal-description" />
          {children}
          <Dialog.Close className="modal-close" asChild>
            <button
              className="icon-button"
              aria-label="close"
              onClick={() => setOpen(false)}
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
