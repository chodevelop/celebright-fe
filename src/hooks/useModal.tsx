import { useMemo } from 'react';
import { useOverlay } from './useOverlay';
import { Modal as MUIModal, Box } from '@mui/material';


export interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * @refer https://github.com/toss/slash/blob/main/packages/react/use-overlay/src/useOverlay.ko.md
 */
export function useModal<T extends ModalProps>(Modal: React.ComponentType<T>) {
  const overlay = useOverlay();

  return useMemo(
    () => ({
      open: function (props?: Omit<T, 'open' | 'onClose' | 'onConfirm'>) {
        return new Promise<boolean>((resolve) => {
          overlay.open(({ isOpen, close, exit }) => (
            <MUIModal
              open={isOpen}
              onClose={() => {
                resolve(false);
                exit();
              }}
              closeAfterTransition
              BackdropProps={{
                timeout: 500,
                sx: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
              }}
            >

              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60%',

                  boxShadow: 24,
                  borderRadius: 1,
                  outline: 'none',
                }}
              >
                <Modal
                  {...(props as T)}
                  open={isOpen}
                  onClose={() => {
                    resolve(false);
                    exit();
                  }}
                  onConfirm={() => {
                    resolve(true);
                    exit();
                  }}
                />
              </Box>

            </MUIModal>
          ));
        });
      },
      close: overlay.close,
    }),
    [Modal, overlay]
  );
}
