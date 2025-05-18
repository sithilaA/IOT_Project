import React from "react";
import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Modals from "../../components/Modals";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import Spinner from "react-bootstrap/Spinner";

function Register() {
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

  function handleRegister() {
    // Handle login logic here
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;
    let rePassword = document.getElementById("rePasswordInput").value;
    let name = document.getElementById("nameInput").value;
    let country = document.getElementById("countryInput").value;
    let res;

    // alert("Login clicked with email: " + email + " and password: " + password);
    if (
      email === "" ||
      password === "" ||
      rePassword === "" ||
      name === "" ||
      country === ""
    ) {
      setErrorTitle("Registration Error");
      setErrorMessage(
        "All fields must be filled in. Please complete the form."
      );
      handleShow();
    } else if (password !== rePassword) {
      setErrorTitle("Password Error");
      setErrorMessage("Passwords do not match. Please try again.");
      handleShow();
    } else if (password.length < 6) {
      setErrorTitle("Password Error");
      setErrorMessage("Password must be at least 6 characters long.");
      handleShow();
    } else {
      res = createUser(email, password);
      handleShowSpinner();
    }

    async function createUser(email, password) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        addUserData();
        return res;
      } catch (error) {
        handleCloseSpinner();
        setErrorTitle("Registration Error");
        switch (error.code) {
          case "auth/email-already-in-use":
            console.error(
              "Email is already registered. Try logging in.",
              error
            );
            setErrorMessage("Email is already registered. Try logging in.");
            break;
          case "auth/network-request-failed":
            console.error(
              "Network error. Check your internet connection.",
              error
            );
            setErrorMessage("Network error. Check your internet connection.");
            break;
          case "auth/internal-error":
            console.error("Something went wrong. Try again later.", error);
            setErrorMessage("Something went wrong. Try again later.");
            break;
          default:
            console.error(error);
            setErrorMessage(
              "Something went wrong. Please try another email or try again later."
            );
            break;
        }
        handleShow();
      }
    }
    async function addUserData() {
      try {
        await addDoc(collection(db, "users"), {
          name: name,
          country: country,
          email: email,
        });
        console.log("User added!");
        localStorage.setItem("email", email);
        navigate("/dashboard");
      } catch (error) {
        console.error("Error adding user:", error);
        alert(error);
      }
    }
  }

  return (
    <div
      className="container-fluid"
      style={{ width: "100vw", height: "100vh", backgroundColor: "#f8f9fa" }}
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
          <h1 className="text-center">Sign Up Form</h1>
          {showSpinner && (
            <div className="text-center">
              <Spinner animation="grow" variant="dark" />
            </div>
          )}

          <Form style={{ width: "450px" }} className="mx-auto mt-4">
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
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Re-type Password</Form.Label>
              <Form.Control
                id="rePasswordInput"
                type="password"
                placeholder="Re-type Password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Name</Form.Label>
              <Form.Control id="nameInput" type="text" placeholder="Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Country</Form.Label>
              <Form.Control
                id="countryInput"
                type="text"
                placeholder="Country"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                id="termsCheckbox"
                type="checkbox"
                label="I agree with terms and conditions"
              />
            </Form.Group>
            <Form.Group className="d-flex justify-content-center mt-1">
              <Link to="/register">
                <Button
                  className="m-1"
                  variant="primary"
                  type="submit"
                  onClick={handleRegister}
                >
                  Register
                </Button>
              </Link>
            </Form.Group>
            <Form.Group className="d-flex justify-content-center mt-1">
              <span className=" ">If you are already registered, please</span>
              <Link to="/login">
                <span className=" m-1 "> sign in.</span>
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

export default Register;
