import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "../../services/firebase";

function Alerts() {
  // We'll store only the alert-related keys.
  const [alertConfig, setAlertConfig] = useState({
    maxSoilMoisture: 50,
    maxTemperature: 50,
    minSoilMoisture: 0,
    minTemperature: -300,
  });

  // Since the alert values are at the root of the database,
  // we use "/" as the reference and extract only the alert values.
  useEffect(() => {
    const db = getDatabase(app);
    const rootRef = ref(db, "/");

    onValue(rootRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAlertConfig({
          maxSoilMoisture:
            typeof data.maxSoilMoisture === "number"
              ? data.maxSoilMoisture
              : 50,
          maxTemperature:
            typeof data.maxTemperature === "number" ? data.maxTemperature : 50,
          minSoilMoisture:
            typeof data.minSoilMoisture === "number" ? data.minSoilMoisture : 0,
          minTemperature:
            typeof data.minTemperature === "number"
              ? data.minTemperature
              : -300,
        });
      } else {
        // If no data exists we fallback to defaults.
        setAlertConfig({
          maxSoilMoisture: 50,
          maxTemperature: 50,
          minSoilMoisture: 0,
          minTemperature: -300,
        });
      }
    });
  }, []);

  const handleChange = (e) => {
    setAlertConfig({
      ...alertConfig,
      [e.target.name]: parseInt(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase(app);
    const rootRef = ref(db, "/");

    try {
      // Only update the alert configuration keys at the root.
      await update(rootRef, alertConfig);
      console.log("Alert configuration updated successfully!");
    } catch (error) {
      console.error("Error updating alert configuration:", error);
    }
  };

  return (
    <Container className=" shadow-lg rounded-2">
      <div className="text-center m-4">
        <h1 className="m-5">Alert Configuration</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="4">
              Max Soil Moisture:
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="number"
                name="maxSoilMoisture"
                value={alertConfig.maxSoilMoisture}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="4">
              Max Temperature:
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="number"
                name="maxTemperature"
                value={alertConfig.maxTemperature}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="4">
              Min Soil Moisture:
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="number"
                name="minSoilMoisture"
                value={alertConfig.minSoilMoisture}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="4">
              Min Temperature:
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="number"
                name="minTemperature"
                value={alertConfig.minTemperature}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Button variant="primary" type="submit" className="m-5">
            Save Changes
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Alerts;
