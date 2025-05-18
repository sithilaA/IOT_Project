import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { query, where, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

function AddIncomeCategoryModal() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);
  const email = localStorage.getItem("email");

  const handleSubmit = (event) => {
    let incomeCategory = document.getElementById("incomeCategory").value;
    let incomeDescription = document.getElementById("incomeDescription").value;
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      if (incomeCategory === "" || incomeDescription === "") {
      } else {
        addUserData();
        handleClose();
      }
    }
    setValidated(true);
    async function addUserData() {
      try {
        await addDoc(collection(db, "incomeCategory"), {
          incomeCategory: incomeCategory,
          incomeDescription: incomeDescription,
          userEmail: email,
        });
        console.log("Income Category added!");
      } catch (error) {
        console.error("Error adding Income Category", error);
        alert(error);
      }
    }
  };

  return (
    <div>
      <Button variant="outline-success" className="m-1" onClick={handleShow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="3.5vw"
          height="3.5vh"
          fill="currentColor"
          class="bi bi-file-plus-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0" />
        </svg>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Income Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Income Category Name</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                required
                id="incomeCategory"
              />
              <Form.Control.Feedback type="invalid">
                Income category name is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Income Category Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                id="incomeDescription"
              />
              <Form.Control.Feedback type="invalid">
                Income category description is required.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddIncomeCategoryModal;
