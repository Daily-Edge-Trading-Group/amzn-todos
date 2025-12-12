import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiError,
} from '@todo-app/contracts'

import { categoriesApi } from '../../api/categories.api'

interface CategoriesState {
  items: Category[]
  loading: boolean
  error: ApiError | null
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await categoriesApi.getAll()
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/create',
  async (data: CreateCategoryRequest, { rejectWithValue }) => {
    try {
      return await categoriesApi.create(data)
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }: { id: string; data: UpdateCategoryRequest }, { rejectWithValue }) => {
    try {
      return await categoriesApi.update(id, data)
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async ({ id, cascade = false }: { id: string; cascade?: boolean }, { rejectWithValue }) => {
    try {
      await categoriesApi.delete(id, cascade)
      return id
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as ApiError
      })
      // Create
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload as ApiError
      })
      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload as ApiError
      })
      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload)
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload as ApiError
      })
  },
})

export const { clearError } = categoriesSlice.actions
export const categoriesReducer = categoriesSlice.reducer

// Selectors
export const selectCategories = (state: { categories: CategoriesState }) => state.categories.items
export const selectCategoriesLoading = (state: { categories: CategoriesState }) =>
  state.categories.loading
export const selectCategoriesError = (state: { categories: CategoriesState }) =>
  state.categories.error
