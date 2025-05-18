import React from "react";
import { Card, Form, Button, Alert, Modal } from "react-bootstrap";
import "./Login.css";
import { Link, Links, useNavigate } from "react-router-dom";
import { useState } from "react";
import Modals from "../../components/Modals";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import Spinner from "react-bootstrap/Spinner";
function Login() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [variant, setVariant] = useState("text-danger");
  const navigate = useNavigate();

  const [showSpinner, setShowSpinner] = useState(false);
  const handleCloseSpinner = () => setShowSpinner(false);
  const handleShowSpinner = () => setShowSpinner(true);
  function handleLogin() {
    // Handle login logic here
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;
    // alert("Login clicked with email: " + email + " and password: " + password);
    if (email === "" || password === "") {
      setErrorTitle("Login Error");
      setErrorMessage(
        "Please enter both your email and password. Fields cannot be left empty."
      );
      handleShow();
    } else {
      signInUser(email, password);
      handleShowSpinner();
    }
    async function signInUser(email, password) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("email", email);
        navigate("/dashboard");
      } catch (error) {
        handleCloseSpinner();
        setErrorTitle("Login Error");
        switch (error.code) {
          case "auth/user-not-found":
            console.error("User not found. Please check your email.", error);
            setErrorMessage("User not found. Please check your email.");
            break;
          case "auth/invalid-credential":
            console.error(
              "Your email or password is incorrect. Please try again.",
              error
            );
            setErrorMessage(
              "Your email or password is incorrect. Please try again."
            );
            break;
          case "auth/network-request-failed":
            console.error(
              "Network error. Check your internet connection.",
              error
            );
            setErrorMessage("Network error. Check your internet connection.");
            break;
          case "auth/invalid-email":
            console.error("Invalid email format.", error);
            setErrorMessage("Invalid email format.");
            break;
          default:
            console.error(error);
            setErrorMessage("Something went wrong. Try again later." + error);
            break;
        }
        handleShow();
        return error;
      }
    }
  }

  return (
    <div
      className="container-fluid"
      style={{ width: "100vw", height: "100vh", background: "#f8f9fa" }}
    >
      <Card
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className="shadow-lg"
      >
        <div className="container p-5">
          {showSpinner && (
            <div className="text-center">
              <Spinner animation="grow" variant="dark" />
            </div>
          )}
          <h1 className="text-center">Login</h1>
          <Form style={{ width: "300px" }} className="mx-auto mt-4">
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                id="emailInput"
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                id="passwordInput"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
            <Form.Group className="d-flex justify-content-center mt-1">
              <Button onClick={handleLogin} className="m-1">
                Login
              </Button>
              <Link to="/register">
                <Button className="m-1" variant="primary" type="submit">
                  Register
                </Button>
              </Link>
            </Form.Group>
          </Form>
        </div>
        <div>
          <Modals
            show={show}
            handleClose={handleClose}
            variant={variant}
            errorTitle={errorTitle}
            errorMessage={errorMessage}
          />
        </div>
      </Card>
    </div>
  );
}

export default Login;
