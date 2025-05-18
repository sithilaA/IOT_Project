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
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import Collapse from "react-bootstrap/Collapse";
import Spinner from "react-bootstrap/Spinner";

function DeleteIncomeCategoryModal() {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSpinner, setOpenSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error Message");
  const email = localStorage.getItem("email");

  const handleClose = () => {
    setShow(false);
    setSelectedCategory("");
    setValidated(false);
  };

  const handleShow = () => setShow(true);

  const handleCategorySelect = (e) => {
    const selectedId = e.target.value;
    setSelectedCategory(selectedId);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!selectedCategory) {
      setErrorMessage("Please select a category to delete");
      setOpen(!open);
      return;
    }

    try {
      setOpenSpinner(!open);
      await deleteDoc(doc(db, "incomeCategory", selectedCategory));
      setOpenSpinner(false);
      console.log("Income Category deleted successfully!");
      handleClose();
      getIncomeCategories();
    } catch (error) {
      setOpenSpinner(false);
      console.error("Error deleting Income Category:", error);
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
      <Button variant="outline-danger" className="m-1" onClick={handleShow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="3.5vw"
          height="3.5vh"
          fill="currentColor"
          className="bi bi-trash-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
        </svg>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Income Category</Modal.Title>
        </Modal.Header>
        <Collapse in={openSpinner}>
          <div id="example-collapse-text" className="text-center m-3">
            <Spinner animation="grow" variant="dark" />
          </div>
        </Collapse>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleDelete}>
            <Form.Group className="mb-3">
              <Form.Label>Select Income Category to Delete</Form.Label>
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
                Please select a category to delete.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
          <Collapse in={open}>
            <div id="example-collapse-text" className="text-danger text-center">
              {errorMessage}
            </div>
          </Collapse>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Category
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeleteIncomeCategoryModal;
