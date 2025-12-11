import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './books/booksSlice';
import studentsReducer from './students/studentsSlice'
import transactionsReducer from './transactions/transactionsSlice'
import reportsReducer from './reports/reportsSlice'
import dashboardReducer from './dashboard/dashboardSlice';


export const store = configureStore({
  reducer: {
    books: booksReducer,
    students: studentsReducer,
    transactions: transactionsReducer,
    reports: reportsReducer,
    dashboard: dashboardReducer,
    // Add other reducers here as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;