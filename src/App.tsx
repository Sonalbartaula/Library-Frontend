import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/authContext";
import { store } from "./features/store";

import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books/Books";
import AddBook from "./pages/Books/AddBook";
import Students from "./pages/Students/Students";
import AddStudent from "./pages/Students/AddStudent";
import Transaction from "./pages/Transaction";
import Reports from "./pages/Reports";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Auth pages - WITHOUT sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Pages that use sidebar */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />        
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="books" element={<Books />} />
              <Route path="addbook" element={<AddBook />} />

              <Route path="students" element={<Students />} />
              <Route path="addstudent" element={<AddStudent />} />

              {/* Transaction Management Routes */}
              <Route path="transactions" element={<Transaction />} />
              <Route path="transactions/checkout" element={<Transaction/>} />
              <Route path="transactions/active" element={<Transaction/>} />
              <Route path="transactions/history" element={<Transaction />} />

              <Route path="reports"element={<Reports/>}/>
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;