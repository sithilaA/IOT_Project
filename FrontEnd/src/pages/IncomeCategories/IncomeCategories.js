import React, { useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { query, where, collection, addDoc, getDocs } from "firebase/firestore";
import Modals from "../../components/Modals";
import Spinner from "react-bootstrap/Spinner";
import AddIncomeCategoryModal from "../../components/AddIncomeCategoryModal";
import EditIncomeCategoryModal from "../../components/EditIncomeCategoryModal";
import DeleteIncomeCategoryModal from "../../components/DeleteIncomeCategoryModal";
function IncomeCategories() {
  const [data, setData] = useState([]);
  // Add New Data

  // Edit Data
  const [editShow, setEditShow] = useState(false);
  const handleEditClose = () => setEditShow(false);
  const handleEditShow = () => setEditShow(true);
  //
  const [incomeCategory, setIncomeCategory] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [validated, setValidated] = useState(false);
  const email = localStorage.getItem("email");
  // New Data Add

  // Edit Data
  const handleEditSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };
  function editIncomeCategories(inCategory, inDescription, id) {
    setEditId(id);
    setEditId(id); // Set the ID of the item being edited
    setIncomeCategory(inCategory); // Update the state for incomeCategory
    setIncomeDescription(inDescription); // Update the state for incomeDescription
  }
  async function getIncomeCategories() {
    const email = localStorage.getItem("email");
    const q = query(
      collection(db, "incomeCategory"), // change to your collection name
      where("userEmail", "==", email)
    );
    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(categories);
  }
  useEffect(() => {
    getIncomeCategories();
  });
  return (
    <div>
      <div>
        <div className=" container m-auto">
          <h1 className="text-center m-3">Income Categories</h1>
          {/* Button Group */}
          <div className="d-flex justify-content-between align-items-end m-3">
            <div className="d-flex "></div>
            <div className=" d-flex justify-content-end m-1">
              <AddIncomeCategoryModal />
              <EditIncomeCategoryModal />
              <DeleteIncomeCategoryModal />
            </div>
          </div>
          {/* Table */}
          <div className=" container">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th> </th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? ( // Check if data is empty
                  <tr>
                    <td colSpan="4" className="text-center">
                      <Spinner animation="grow" />
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.incomeCategory}</td>
                      <td>{item.incomeDescription}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeCategories;
