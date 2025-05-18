import React from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import { HouseDoorFill, PersonCircle } from "react-bootstrap-icons";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

function OffCanvas() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  function handleBtnClickDashboard() {
    navigate("/dashboard");
  }
  function handleBtnClickIncome() {
    navigate("/incomeExpenses");
  }
  function handleBtnClickIncomeCate() {
    navigate("/incomeCategories");
  }
  function handleBtnClickExpenseCate() {
    navigate("/expenseCategories");
  }
  function handleBtnClickLogOut() {
    navigate("/login");
  }
  function handleBtnClickDevices() {
    navigate("/devices");
  }
  return (
    <>
      <Button variant="light" onClick={handleShow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="4vw"
          height="4vh"
          fill="currentColor"
          class="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
          ></path>
        </svg>
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <h1>
              Moisture<samp className=" text-danger fw-bold">Track</samp>{" "}
            </h1>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div
            className="container"
            style={{
              height: "100%",
            }}
          >
            <Button
              variant="outline-dark m-1"
              className="container"
              onClick={handleBtnClickDashboard}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="3vw"
                height="3vh"
                fill="currentColor"
                class="bi bi-menu-button-wide-fill"
                viewBox="0 0 16 16"
                className="m-1"
              >
                <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v2A1.5 1.5 0 0 0 1.5 5h13A1.5 1.5 0 0 0 16 3.5v-2A1.5 1.5 0 0 0 14.5 0zm1 2h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m9.927.427A.25.25 0 0 1 12.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5" />
              </svg>
              Dashboard
            </Button>
            <Button
              variant="outline-dark m-1"
              className="container"
              onClick={handleBtnClickDevices}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="3vw"
                height="3vh"
                fill="currentColor"
                class="bi bi-phone-vibrate"
                viewBox="0 0 16 16"
                className="m-1"
              >
                <path d="M10 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM6 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                <path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2M1.599 4.058a.5.5 0 0 1 .208.676A7 7 0 0 0 1 8c0 1.18.292 2.292.807 3.266a.5.5 0 0 1-.884.468A8 8 0 0 1 0 8c0-1.347.334-2.619.923-3.734a.5.5 0 0 1 .676-.208m12.802 0a.5.5 0 0 1 .676.208A8 8 0 0 1 16 8a8 8 0 0 1-.923 3.734.5.5 0 0 1-.884-.468A7 7 0 0 0 15 8c0-1.18-.292-2.292-.807-3.266a.5.5 0 0 1 .208-.676M3.057 5.534a.5.5 0 0 1 .284.648A5 5 0 0 0 3 8c0 .642.12 1.255.34 1.818a.5.5 0 1 1-.93.364A6 6 0 0 1 2 8c0-.769.145-1.505.41-2.182a.5.5 0 0 1 .647-.284m9.886 0a.5.5 0 0 1 .648.284C13.855 6.495 14 7.231 14 8s-.145 1.505-.41 2.182a.5.5 0 0 1-.93-.364C12.88 9.255 13 8.642 13 8s-.12-1.255-.34-1.818a.5.5 0 0 1 .283-.648" />
              </svg>
              Devices
            </Button>
            <Dropdown>
              <Dropdown.Toggle
                className=" container m-1"
                variant="outline-dark"
                id="dropdown-basic"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="3vw"
                  height="3vh"
                  fill="currentColor"
                  class="bi bi-cash-coin"
                  viewBox="0 0 16 16"
                  className="m-1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"
                  />
                  <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z" />
                  <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z" />
                  <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567" />
                </svg>
                Device
              </Dropdown.Toggle>

              <Dropdown.Menu className="container">
                <Dropdown.Item onClick={handleBtnClickIncome}>
                  Device List
                </Dropdown.Item>
                <Dropdown.Item onClick={handleBtnClickIncomeCate}>
                  Income Categories
                </Dropdown.Item>
                <Dropdown.Item onClick={handleBtnClickExpenseCate}>
                  Expense Categories
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div
              className="container"
              style={{
                position: "absolute",
                bottom: "0",
              }}
            >
              <Button
                variant="dark"
                onClick={handleBtnClickLogOut}
                className="m-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="3vw"
                  height="3vh"
                  fill="currentColor"
                  class="bi bi-box-arrow-left"
                  viewBox="0 0 16 16"
                  className="m-1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                  />
                </svg>
                Log Out
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffCanvas;
