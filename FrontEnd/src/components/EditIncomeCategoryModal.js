import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  query,
  where,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import Collapse from "react-bootstrap/Collapse";
import Spinner from "react-bootstrap/Spinner";

function EditIncomeCategoryModal() {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSpinner, setOpenSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error Message");
  const email = localStorage.getItem("email");
  const handleClose = () => {
    setShow(false);
    setSelectedCategory("");
    setIncomeCategory("");
    setIncomeDescription("");
    setValidated(false);
  };

  const handleShow = () => setShow(true);

  const handleCategorySelect = (e) => {
    const selectedId = e.target.value;
    const selected = data.find((category) => category.id === selectedId);

    if (selected) {
      setSelectedCategory(selectedId);
      setIncomeCategory(selected.incomeCategory);
      setIncomeDescription(selected.incomeDescription);
    } else {
      setSelectedCategory("");
      setIncomeCategory("");
      setIncomeDescription("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!selectedCategory || !incomeCategory || !incomeDescription) {
      setErrorMessage("Please fill in all fields");
      setOpen(!open);
      return;
    }

    try {
      setOpenSpinner(!open);
      await updateDoc(doc(db, "incomeCategory", selectedCategory), {
        incomeCategory,
        incomeDescription,
        userEmail: email,
      });
      setOpenSpinner(false);
      console.log("Income Category updated successfully!");
      handleClose();
      getIncomeCategories();
    } catch (error) {
      setOpenSpinner(false);
      console.error("Error updating Income Category:", error);
      alert(error.message);
    }
  };

  async function getIncomeCategories() {
    try {
      const q = query(
        collection(db, "incomeCategory"),
        where("userEmail", "==", email)
      );
      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert(error.message);
    }
  }

  useEffect(() => {
    getIncomeCategories();
  }, []);

  return (
    <div>
      <Button variant="outline-warning" className="m-1" onClick={handleShow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="3.5vw"
          height="3.5vh"
          fill="currentColor"
          className="bi bi-pencil-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
        </svg>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Income Category</Modal.Title>
        </Modal.Header>
        <Collapse in={openSpinner}>
          <div id="example-collapse-text" className=" text-center m-3">
            <Spinner animation="grow" variant="dark" />
          </div>
        </Collapse>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Income Category</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={handleCategorySelect}
                required
                className="mb-3"
              >
                <option value="">Select a category</option>
                {data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.incomeCategory}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a category.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Income Category Name</Form.Label>
              <Form.Control
                type="text"
                value={incomeCategory}
                onChange={(e) => setIncomeCategory(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Income category name is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Income Category Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={incomeDescription}
                onChange={(e) => setIncomeDescription(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Income category description is required.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
          <Collapse in={open}>
            <div
              id="example-collapse-text"
              className=" text-danger text-center"
            >
              {errorMessage}
            </div>
          </Collapse>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update Category
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditIncomeCategoryModal;
