import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

import type { Todo } from '@todo-app/contracts'

import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { createTodo, updateTodo } from '../todosSlice'
import { selectCategories } from '../../categories/categoriesSlice'

interface TodoFormDialogProps {
  open: boolean
  onClose: () => void
  todo?: Todo | null // If provided, we're in edit mode
}

// Generate hour options (01-12)
const hourOptions = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 1
  return { value: hour.toString(), label: hour.toString().padStart(2, '0') }
})

// Generate minute options (00-59)
const minuteOptions = Array.from({ length: 60 }, (_, i) => {
  return { value: i.toString(), label: i.toString().padStart(2, '0') }
})

// Convert 24-hour to 12-hour format
const to12Hour = (hour24: number): { hour: string; amPm: 'AM' | 'PM' } => {
  const amPm: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM'
  let hour12 = hour24 % 12
  if (hour12 === 0) hour12 = 12
  return { hour: hour12.toString(), amPm }
}

export function TodoFormDialog({ open, onClose, todo }: TodoFormDialogProps) {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)

  const isEditMode = !!todo

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<Dayjs | null>(null)
  const [hour, setHour] = useState('12')
  const [minute, setMinute] = useState('0')
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('AM')
  const [categoryId, setCategoryId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-fill form when editing
  useEffect(() => {
    if (todo) {
      setTitle(todo.title)
      setDescription(todo.description || '')
      setCategoryId(todo.categoryId)
      if (todo.dueDate) {
        const dueDateObj = dayjs(todo.dueDate)
        setDueDate(dueDateObj)
        const { hour: h, amPm: ap } = to12Hour(dueDateObj.hour())
        setHour(h)
        setMinute(dueDateObj.minute().toString())
        setAmPm(ap)
      } else {
        setDueDate(null)
        setHour('12')
        setMinute('0')
        setAmPm('AM')
      }
    } else {
      // Reset for create mode
      setTitle('')
      setDescription('')
      setDueDate(null)
      setHour('12')
      setMinute('0')
      setAmPm('AM')
      setCategoryId('')
    }
  }, [todo, open])

  const handleAmPmChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAmPm: 'AM' | 'PM' | null
  ) => {
    if (newAmPm !== null) {
      setAmPm(newAmPm)
    }
  }

  const buildDateTime = (): string | undefined => {
    if (!dueDate) return undefined

    let hours = parseInt(hour, 10) || 12
    const minutes = parseInt(minute, 10) || 0

    // Convert 12-hour to 24-hour format
    if (amPm === 'PM' && hours !== 12) {
      hours += 12
    } else if (amPm === 'AM' && hours === 12) {
      hours = 0
    }

    return dueDate
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toISOString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      if (isEditMode && todo) {
        await dispatch(
          updateTodo({
            id: todo.id,
            data: {
              title: title.trim(),
              description: description.trim() || undefined,
              dueDate: buildDateTime(),
              categoryId,
            },
          })
        ).unwrap()
      } else {
        await dispatch(
          createTodo({
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate: buildDateTime(),
            categoryId,
          })
        ).unwrap()
      }
      handleClose()
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrors({ submit: error.message || `Failed to ${isEditMode ? 'update' : 'create'} todo` })
    }
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setDueDate(null)
    setHour('12')
    setMinute('0')
    setAmPm('AM')
    setCategoryId('')
    setErrors({})
    onClose()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{isEditMode ? 'Edit Todo' : 'Create Todo'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Date Picker */}
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'dense',
                },
              }}
            />

            {/* Time Selection with Scrollable Dropdowns */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              {/* Hour Select */}
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel>HH</InputLabel>
                <Select
                  value={hour}
                  label="HH"
                  onChange={(e) => setHour(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {hourOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>:</span>

              {/* Minute Select */}
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel>MM</InputLabel>
                <Select
                  value={minute}
                  label="MM"
                  onChange={(e) => setMinute(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {minuteOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* AM/PM Toggle */}
              <ToggleButtonGroup
                value={amPm}
                exclusive
                onChange={handleAmPmChange}
                size="small"
                sx={{ ml: 1 }}
              >
                <ToggleButton value="AM" sx={{ px: 2 }}>
                  AM
                </ToggleButton>
                <ToggleButton value="PM" sx={{ px: 2 }}>
                  PM
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <FormControl fullWidth margin="dense" error={!!errors.categoryId} sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.submit && (
              <TextField
                margin="dense"
                value={errors.submit}
                error
                disabled
                fullWidth
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  )
}
