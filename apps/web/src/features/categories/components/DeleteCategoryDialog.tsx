import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material'
import { Warning } from '@mui/icons-material'

interface DeleteCategoryDialogProps {
  open: boolean
  categoryName: string
  todoCount: number
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteCategoryDialog({
  open,
  categoryName,
  todoCount,
  onCancel,
  onConfirm,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="warning" />
        Delete Category
      </DialogTitle>
      <DialogContent>
        <DialogContentText component="div">
          <Typography paragraph>
            You are about to delete the category <strong>"{categoryName}"</strong>.
          </Typography>

          {todoCount > 0 ? (
            <Box
              sx={{
                bgcolor: 'error.lighter',
                border: 1,
                borderColor: 'error.main',
                borderRadius: 1,
                p: 2,
                mb: 2,
              }}
            >
              <Typography color="error.main" fontWeight="bold" gutterBottom>
                ⚠️ Warning: This will permanently delete {todoCount} todo
                {todoCount !== 1 ? 's' : ''}!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All todos associated with this category will be deleted along with the category.
                This action cannot be undone.
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              This category has no todos. It will be deleted immediately.
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus={todoCount === 0}>
          {todoCount > 0
            ? `Delete Category & ${todoCount} Todo${todoCount !== 1 ? 's' : ''}`
            : 'Delete Category'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
