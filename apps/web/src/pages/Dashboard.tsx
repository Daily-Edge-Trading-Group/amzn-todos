import { useEffect, useState } from 'react'
import { Box, Container, Grid, Paper, Typography, Button, Alert, Snackbar } from '@mui/material'
import { Add } from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  fetchCategories,
  selectCategories,
  selectCategoriesError,
  clearError as clearCategoriesError,
} from '../features/categories/categoriesSlice'
import {
  fetchTodos,
  selectTodosGroupedByCategory,
  selectTodosFilters,
  selectTodosError,
  clearError as clearTodosError,
} from '../features/todos/todosSlice'
import { CategoryList } from '../features/categories/components/CategoryList'
import { TodoList } from '../features/todos/components/TodoList'
import { TodoFilters } from '../features/todos/components/TodoFilters'
import { TodoFormDialog } from '../features/todos/components/TodoFormDialog'
import { CategoryFormDialog } from '../features/categories/components/CategoryFormDialog'

export function Dashboard() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const groupedTodos = useAppSelector(selectTodosGroupedByCategory)
  const filters = useAppSelector(selectTodosFilters)
  const categoriesError = useAppSelector(selectCategoriesError)
  const todosError = useAppSelector(selectTodosError)

  const [todoDialogOpen, setTodoDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchTodos(filters))
  }, [dispatch, filters])

  useEffect(() => {
    if (categoriesError || todosError) {
      setSnackbarMessage(categoriesError?.message || todosError?.message || 'An error occurred')
      setSnackbarOpen(true)
    }
  }, [categoriesError, todosError])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    dispatch(clearCategoriesError())
    dispatch(clearTodosError())
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        📋 Todo App
      </Typography>

      <Grid container spacing={3}>
        {/* Categories Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6">Categories</Typography>
              <Button size="small" startIcon={<Add />} onClick={() => setCategoryDialogOpen(true)}>
                Add
              </Button>
            </Box>
            <CategoryList />
          </Paper>
        </Grid>

        {/* Main Todo Area */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h5">My Todos</Typography>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => setTodoDialogOpen(true)}
                disabled={categories.length === 0}
              >
                Add
              </Button>
            </Box>
            <TodoFilters />

            {categories.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Create a category first to start adding todos!
              </Alert>
            ) : (
              categories.map((category) => (
                <Box key={category.id} sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {category.name}
                  </Typography>
                  <TodoList todos={groupedTodos[category.id] || []} />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <TodoFormDialog open={todoDialogOpen} onClose={() => setTodoDialogOpen(false)} />
      <CategoryFormDialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} />

      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}
