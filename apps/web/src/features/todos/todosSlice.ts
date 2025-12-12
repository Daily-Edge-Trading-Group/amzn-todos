import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoQueryParams,
  TodoStatus,
  TodoSortField,
  SortOrder,
  ApiError,
} from '@todo-app/contracts'

import { todosApi } from '../../api/todos.api'

interface TodosState {
  items: Todo[]
  loading: boolean
  error: ApiError | null
  filters: TodoQueryParams
}

const initialState: TodosState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    sort: 'createdAt',
    order: 'desc',
  },
}

export const fetchTodos = createAsyncThunk(
  'todos/fetchAll',
  async (params: TodoQueryParams | undefined, { rejectWithValue }) => {
    try {
      return await todosApi.getAll(params)
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

export const createTodo = createAsyncThunk(
  'todos/create',
  async (data: CreateTodoRequest, { rejectWithValue }) => {
    try {
      return await todosApi.create(data)
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

export const updateTodo = createAsyncThunk(
  'todos/update',
  async ({ id, data }: { id: string; data: UpdateTodoRequest }, { rejectWithValue }) => {
    try {
      return await todosApi.update(id, data)
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

// Optimistic toggle - updates UI immediately, then syncs with API
export const toggleTodoCompleted = createAsyncThunk(
  'todos/toggleCompleted',
  async ({ id, completed }: { id: string; completed: boolean }, { dispatch, rejectWithValue }) => {
    // Optimistically update UI immediately
    dispatch(optimisticToggle({ id, completed }))

    try {
      // Sync with API in background
      const result = await todosApi.update(id, { completed })
      return result
    } catch (error) {
      // Rollback on failure
      dispatch(optimisticToggle({ id, completed: !completed }))
      return rejectWithValue(error as ApiError)
    }
  }
)

export const deleteTodo = createAsyncThunk(
  'todos/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await todosApi.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error as ApiError)
    }
  }
)

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<TodoStatus>) => {
      state.filters.status = action.payload
    },
    setSortField: (state, action: PayloadAction<TodoSortField>) => {
      state.filters.sort = action.payload
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.filters.order = action.payload
    },
    setCategoryFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.categoryId = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    // Optimistic toggle reducer - immediate UI update
    optimisticToggle: (state, action: PayloadAction<{ id: string; completed: boolean }>) => {
      const todo = state.items.find((t) => t.id === action.payload.id)
      if (todo) {
        todo.completed = action.payload.completed
        todo.updatedAt = new Date().toISOString()
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as ApiError
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.error = action.payload as ApiError
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload as ApiError
      })
      // toggleTodoCompleted - no need to handle fulfilled since optimistic update already done
      .addCase(toggleTodoCompleted.rejected, (state, action) => {
        state.error = action.payload as ApiError
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload)
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload as ApiError
      })
  },
})

export const {
  setStatusFilter,
  setSortField,
  setSortOrder,
  setCategoryFilter,
  clearError,
  optimisticToggle,
} = todosSlice.actions

export const todosReducer = todosSlice.reducer

// Selectors
export const selectTodos = (state: { todos: TodosState }) => state.todos.items
export const selectTodosLoading = (state: { todos: TodosState }) => state.todos.loading
export const selectTodosError = (state: { todos: TodosState }) => state.todos.error
export const selectTodosFilters = (state: { todos: TodosState }) => state.todos.filters

export const selectTodosGroupedByCategory = (state: { todos: TodosState }) => {
  return state.todos.items.reduce<Record<string, Todo[]>>((acc, todo) => {
    if (!acc[todo.categoryId]) {
      acc[todo.categoryId] = []
    }
    acc[todo.categoryId].push(todo)
    return acc
  }, {})
}
