import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";

function IncomeExpenses() {
  return (
    <div>
      <div className="container m-auto">
        <h1 className="text-center m-3">Income Expenses Table </h1>
        <div className="d-flex justify-content-between align-items-end m-3">
          <div className="d-flex ">
            <Form.Select aria-label="Select Year" className="m-1">
              <option>Select Year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </Form.Select>
            <Form.Select aria-label="Select Month" className="m-1">
              <option>Select Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </Form.Select>
          </div>
          <div>
            <ButtonGroup aria-label="Basic example">
              <Button variant="outline-success">
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
              <Button variant="outline-danger">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="3.5vw"
                  height="3.5vh"
                  fill="currentColor"
                  class="bi bi-trash-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                </svg>
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default IncomeExpenses;
