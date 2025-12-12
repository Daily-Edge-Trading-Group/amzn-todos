import { useState } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'

import type { Category } from '@todo-app/contracts'

import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { selectCategories, selectCategoriesLoading, deleteCategory } from '../categoriesSlice'
import { selectTodos, fetchTodos } from '../../todos/todosSlice'
import { CategoryFormDialog } from './CategoryFormDialog'
import { DeleteCategoryDialog } from './DeleteCategoryDialog'

export function CategoryList() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const todos = useAppSelector(selectTodos)
  const loading = useAppSelector(selectCategoriesLoading)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
  }

  const handleCloseEditDialog = () => {
    setEditingCategory(null)
  }

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category)
  }

  const handleCancelDelete = () => {
    setDeletingCategory(null)
  }

  const handleConfirmDelete = async () => {
    if (deletingCategory) {
      const todoCount = todos.filter((t) => t.categoryId === deletingCategory.id).length
      await dispatch(deleteCategory({ id: deletingCategory.id, cascade: todoCount > 0 }))
      // Refresh todos if we cascade deleted any
      if (todoCount > 0) {
        dispatch(fetchTodos(undefined))
      }
      setDeletingCategory(null)
    }
  }

  const getTodoCountForCategory = (categoryId: string): number => {
    return todos.filter((t) => t.categoryId === categoryId).length
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (categories.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        No categories yet. Create one to get started!
      </Typography>
    )
  }

  return (
    <>
      <List dense>
        {categories.map((category) => (
          <ListItem
            key={category.id}
            sx={{ pr: 12 }}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton aria-label="edit" size="small" onClick={() => handleEdit(category)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => handleDeleteClick(category)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={category.name}
              secondary={`Created: ${new Date(category.createdAt).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Edit Category Dialog */}
      <CategoryFormDialog
        open={!!editingCategory}
        onClose={handleCloseEditDialog}
        category={editingCategory}
      />

      {/* Delete Category Confirmation Dialog */}
      <DeleteCategoryDialog
        open={!!deletingCategory}
        categoryName={deletingCategory?.name || ''}
        todoCount={deletingCategory ? getTodoCountForCategory(deletingCategory.id) : 0}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
