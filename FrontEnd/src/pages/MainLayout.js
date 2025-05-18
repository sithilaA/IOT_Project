import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import IncomeExpenses from "./IncomeExpenses/IncomeExpenses";
import IncomeCategories from "./IncomeCategories/IncomeCategories";
import ExpenseCategories from "./ExpenseCategories/ExpenseCategories";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <NavBar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
