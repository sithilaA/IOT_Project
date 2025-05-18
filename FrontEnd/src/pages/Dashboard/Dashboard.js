import React from "react";
function Dashboard() {
  const email = localStorage.getItem("email");
  return (
    <div>
      Dashboard
      <h1>{email}</h1>
    </div>
  );
}

export default Dashboard;
