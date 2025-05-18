import React from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import OffCanvas from "./OffCanvas";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  function handleBtnClickLogOut() {
    navigate("/login");
  }
  const email = localStorage.getItem("email");
  return (
    <div>
      <Navbar style={{ background: "#2c3e50" }}>
        <div className="m-2">
          <OffCanvas />
        </div>
        <Container>
          <Navbar.Brand href="#home" style={{ color: "#ecf0f1" }}>
            <h1>
              Moisture<samp className=" text-danger fw-bold">Track</samp>{" "}
            </h1>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text
              className="d-none d-sm-block"
              style={{ color: "#ecf0f1" }}
            >
              Signed in as:{" "}
              <a href="#login" style={{ color: "#3498db" }}>
                {email}
              </a>
              <Button
                onClick={handleBtnClickLogOut}
                variant="secondary m-2"
                style={{}}
              >
                Log Out
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
