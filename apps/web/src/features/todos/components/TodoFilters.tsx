import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material'
import { ArrowUpward, ArrowDownward } from '@mui/icons-material'

import type { TodoStatus, TodoSortField } from '@todo-app/contracts'

import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import {
  setStatusFilter,
  setSortField,
  setSortOrder,
  setCategoryFilter,
  selectTodosFilters,
} from '../todosSlice'
import { selectCategories } from '../../categories/categoriesSlice'

export function TodoFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectTodosFilters)
  const categories = useAppSelector(selectCategories)

  const handleStatusChange = (
    _: React.MouseEvent<HTMLElement>,
    newStatus: TodoStatus | null
  ) => {
    if (newStatus) {
      dispatch(setStatusFilter(newStatus))
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <ToggleButtonGroup
        value={filters.status}
        exclusive
        onChange={handleStatusChange}
        size="small"
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="active">Active</ToggleButton>
        <ToggleButton value="completed">Completed</ToggleButton>
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sort}
          label="Sort By"
          onChange={(e) => dispatch(setSortField(e.target.value as TodoSortField))}
        >
          <MenuItem value="createdAt">Created Date</MenuItem>
          <MenuItem value="dueDate">Due Date</MenuItem>
        </Select>
      </FormControl>

      <IconButton
        onClick={() => dispatch(setSortOrder(filters.order === 'asc' ? 'desc' : 'asc'))}
        size="small"
      >
        {filters.order === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
      </IconButton>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.categoryId || ''}
          label="Category"
          onChange={(e) => dispatch(setCategoryFilter(e.target.value || undefined))}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
