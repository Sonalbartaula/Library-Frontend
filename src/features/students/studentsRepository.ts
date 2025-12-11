
import api from '../../api/authInstance';
import type { Student } from './model';

const BASE_URL = '/Student';

export const studentsRepository = {
  async getStudents(): Promise<Student[]> {
    const response = await api.get<Student[]>(`${BASE_URL}/GetAll`);
    return response.data;
  },

  async getStudentById(id: number): Promise<Student> {
    const response = await api.get<Student>(`${BASE_URL}/Get/${id}`);
    return response.data;
  },

  async addStudent(student: Omit<Student, 'id' | 'joinedDate'>): Promise<Student> {
    const response = await api.post<Student>(`${BASE_URL}/Add`, student);
    return response.data;
  },

  async updateStudent(id: number, student: Partial<Student>): Promise<Student> {
    const response = await api.put<Student>(`${BASE_URL}/Update/${id}`, student);
    return response.data;
  },

   async deleteStudent(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/Delete`, {
      params: { id }
    });
  }
  
};