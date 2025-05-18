import "./App.css";
import Login from "./pages/Login/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import IncomeExpenses from "./pages/IncomeExpenses/IncomeExpenses";
import IncomeCategories from "./pages/IncomeCategories/IncomeCategories";
import ExpenseCategories from "./pages/ExpenseCategories/ExpenseCategories";
import NavBar from "./components/NavBar";
import MainLayout from "./pages/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incomeExpenses" element={<IncomeExpenses />} />
          <Route path="/incomeCategories" element={<IncomeCategories />} />
          <Route path="/expenseCategories" element={<ExpenseCategories />} />
          <Route path="/devices" element={<ExpenseCategories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
