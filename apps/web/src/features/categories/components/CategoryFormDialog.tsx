import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

import type { Category } from '@todo-app/contracts'

import { useAppDispatch } from '../../../store/hooks'
import { createCategory, updateCategory } from '../categoriesSlice'

interface CategoryFormDialogProps {
  open: boolean
  onClose: () => void
  category?: Category | null // If provided, we're in edit mode
}

export function CategoryFormDialog({ open, onClose, category }: CategoryFormDialogProps) {
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const isEditMode = !!category

  // Pre-fill form when editing
  useEffect(() => {
    if (category) {
      setName(category.name)
    } else {
      setName('')
    }
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    try {
      if (isEditMode && category) {
        await dispatch(updateCategory({ id: category.id, data: { name: name.trim() } })).unwrap()
      } else {
        await dispatch(createCategory({ name: name.trim() })).unwrap()
      }
      setName('')
      onClose()
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || `Failed to ${isEditMode ? 'update' : 'create'} category`)
    }
  }

  const handleClose = () => {
    setName('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? 'Edit Category' : 'Create Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
