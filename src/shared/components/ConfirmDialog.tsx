import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'error' | 'primary' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open, title, message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmColor = 'error',
  onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon color={confirmColor} />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined" size="small">{cancelLabel}</Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor} size="small">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
