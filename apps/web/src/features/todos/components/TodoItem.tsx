import {
  Card,
  CardContent,
  Checkbox,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
} from '@mui/material'
import { Edit, Delete, Schedule, CalendarToday } from '@mui/icons-material'

import type { Todo } from '@todo-app/contracts'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}

// Format time in 12-hour format
const formatTime = (date: Date): string => {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const amPm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`
}

// Format date nicely (e.g., "Dec 14" or "Dec 14, 2025" if different year)
const formatDate = (date: Date): string => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric'
  }
  return date.toLocaleDateString('en-US', options)
}

// Format createdAt as MM/DD/YYYY HH:MM AM/PM
const formatCreatedAt = (dateString: string): string => {
  const date = new Date(dateString)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()
  const time = formatTime(date)
  return `${month}/${day}/${year} ${time}`
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const dueDateTime = todo.dueDate ? new Date(todo.dueDate) : null
  const isOverdue = dueDateTime && !todo.completed && dueDateTime < new Date()

  // Check if time is set (not midnight/default)
  const hasTime = dueDateTime && (dueDateTime.getHours() !== 0 || dueDateTime.getMinutes() !== 0)

  return (
    <Card sx={{ mb: 1, position: 'relative' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', py: 1, '&:last-child': { pb: 1 } }}>
        {/* Created at timestamp - positioned absolute top right */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            position: 'absolute',
            top: 8,
            right: 12,
            fontSize: '0.7rem',
          }}
        >
          Created: {formatCreatedAt(todo.createdAt)}
        </Typography>

        {/* Main content */}
        <Checkbox checked={todo.completed} onChange={(e) => onToggle(todo.id, e.target.checked)} />
        <Box sx={{ flexGrow: 1, ml: 1 }}>
          <Typography
            variant="body1"
            sx={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? 'text.secondary' : 'text.primary',
            }}
          >
            {todo.title}
          </Typography>
          {todo.description && (
            <Typography variant="body2" color="text.secondary">
              {todo.description}
            </Typography>
          )}
          {dueDateTime && (
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} alignItems="center">
              {/* Date chip */}
              <Chip
                icon={<CalendarToday sx={{ fontSize: 14 }} />}
                label={formatDate(dueDateTime)}
                size="small"
                color={isOverdue ? 'error' : 'default'}
                variant={isOverdue ? 'filled' : 'outlined'}
                sx={{
                  height: 24,
                  '& .MuiChip-label': { px: 1 },
                  '& .MuiChip-icon': { ml: 0.5 },
                }}
              />
              {/* Time chip - only show if time was set */}
              {hasTime && (
                <Chip
                  icon={<Schedule sx={{ fontSize: 14 }} />}
                  label={formatTime(dueDateTime)}
                  size="small"
                  color={isOverdue ? 'error' : 'default'}
                  variant={isOverdue ? 'filled' : 'outlined'}
                  sx={{
                    height: 24,
                    '& .MuiChip-label': { px: 1 },
                    '& .MuiChip-icon': { ml: 0.5 },
                  }}
                />
              )}
            </Stack>
          )}
        </Box>
        <IconButton onClick={() => onEdit(todo)} size="small">
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(todo.id)} size="small">
          <Delete />
        </IconButton>
      </CardContent>
    </Card>
  )
}
