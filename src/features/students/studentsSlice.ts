import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { 
  fetchStudents, 
  fetchStudentById, 
  addStudentAsync, 
  updateStudentAsync, 
  deleteStudentAsync 
} from './studentsThunk';
import type { Student } from './model';

interface StudentsState {
  students: Student[];
  currentStudent: Student | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  currentStudent: null,
  loading: false,
  error: null,
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentStudent(state) {
      state.currentStudent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch students';
      })

      // Fetch student by ID
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false;
        state.currentStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch student';
      })

      // Add student
      .addCase(addStudentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudentAsync.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(addStudentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add student';
      })

      // Update student
      .addCase(updateStudentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentAsync.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false;
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        state.currentStudent = action.payload;
      })
      .addCase(updateStudentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update student';
      })

      // Delete student
      .addCase(deleteStudentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudentAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.students = state.students.filter(s => s.id !== action.payload);
      })
      .addCase(deleteStudentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete student';
      });
  }
});

export const { clearError, clearCurrentStudent } = studentsSlice.actions;
export default studentsSlice.reducer;