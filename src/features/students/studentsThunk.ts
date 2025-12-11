import { createAsyncThunk } from '@reduxjs/toolkit';
import { studentsRepository } from './studentsRepository';
import type { Student } from './model';


export const fetchStudents = createAsyncThunk<Student[]>(
  'students/fetchStudents',
  async () => {
    return await studentsRepository.getStudents();
  }
);

export const fetchStudentById = createAsyncThunk<Student, number>(
  'students/fetchStudentById',
  async (id) => {
    return await studentsRepository.getStudentById(id);
  }
);

export const addStudentAsync = createAsyncThunk<Student, Omit<Student, 'id' | 'joinedDate'>>(
  'students/addStudent',
  async (student) => {
    return await studentsRepository.addStudent(student);
  }
);

export const updateStudentAsync = createAsyncThunk<Student, { id: number; student: Partial<Student> }>(
  'students/updateStudent',
  async ({ id, student }) => {
    return await studentsRepository.updateStudent(id, student);
  }
);

export const deleteStudentAsync = createAsyncThunk<number, number>(
  'students/deleteStudent',
  async (id) => {
    await studentsRepository.deleteStudent(id);
    return id;
  }
);