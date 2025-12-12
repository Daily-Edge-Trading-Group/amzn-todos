import { useState } from 'react'
import { Typography } from '@mui/material'

import type { Todo } from '@todo-app/contracts'

import { useAppDispatch } from '../../../store/hooks'
import { toggleTodoCompleted, deleteTodo } from '../todosSlice'
import { TodoItem } from './TodoItem'
import { TodoFormDialog } from './TodoFormDialog'

interface TodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  const dispatch = useAppDispatch()
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const handleToggle = (id: string, completed: boolean) => {
    // Optimistic update - UI updates immediately, API syncs in background
    dispatch(toggleTodoCompleted({ id, completed }))
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
  }

  const handleCloseEditDialog = () => {
    setEditingTodo(null)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      dispatch(deleteTodo(id))
    }
  }

  if (todos.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2" sx={{ py: 1 }}>
        No todos in this category
      </Typography>
    )
  }

  return (
    <>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {/* Edit Todo Dialog */}
      <TodoFormDialog open={!!editingTodo} onClose={handleCloseEditDialog} todo={editingTodo} />
    </>
  )
}
