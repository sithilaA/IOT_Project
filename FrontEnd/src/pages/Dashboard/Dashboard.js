import React, { useState, useEffect } from "react";
import { Card, Col, Row, Container, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "../../services/firebase";

function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [led, setLed] = useState(false);

  useEffect(() => {
    const db = getDatabase(app);
    const sensorDataRef = ref(db, "sensor_data/latest");

    onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      setSensorData(data);
    });
  }, []);

  useEffect(() => {
    const db = getDatabase(app);
    const ledRef = ref(db, "led");

    onValue(ledRef, (snapshot) => {
      const value = snapshot.val();
      setLed(value === 1);
    });
  }, []);

  const toggleAlarm = () => {
    const db = getDatabase(app);
    const newValue = led ? 0 : 1;
    update(ref(db, "/"), { led: newValue })
      .then(() => {
        console.log("LED updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating LED:", error);
      });
  };

  return (
    <Container>
      <h2 className="text-center my-4">Dashboard</h2>
      {sensorData && (
        <Row className="g-4">
          <Col md={4}>
            <Card border="primary" className="shadow-lg">
              <Card.Body>
                <Card.Title>DHT Humidity</Card.Title>
                <Card.Text
                  className=" text-center text-primary"
                  style={{ fontSize: "1.5rem" }}
                >
                  {sensorData.dht?.humidity}
                </Card.Text>
                <p>
                  This shows the humidity inside your seed container. The ideal
                  range is between 20% and 40% relative humidity (RH).
                </p>
                <p>
                  {sensorData.dht?.humidity >= 20 &&
                  sensorData.dht?.humidity <= 40 ? (
                    <span style={{ color: "green" }}>Good condition</span>
                  ) : sensorData.dht?.humidity > 40 ? (
                    <span style={{ color: "red" }}>Humidity High inside</span>
                  ) : (
                    <span style={{ color: "red" }}>Humidity Low</span>
                  )}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card border="success" className="shadow-lg">
              <Card.Body>
                <Card.Title>DHT Temperature</Card.Title>
                <Card.Text
                  className=" text-center text-primary"
                  style={{ fontSize: "1.5rem" }}
                >
                  {sensorData.dht?.temperature}
                </Card.Text>
                <p>
                  This shows the temperature measured by the sensor inside the
                  device.
                </p>
                <p>
                  {sensorData.dht?.temperature >= 10 &&
                  sensorData.dht?.temperature <= 70 ? (
                    <span style={{ color: "green" }}>Good condition</span>
                  ) : sensorData.dht?.temperature > 70 ? (
                    <span style={{ color: "red" }}>
                      Temperature High inside
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>Temperature Low</span>
                  )}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card border="danger" className="shadow-lg">
              <Card.Body>
                <Card.Title>DS18B20 Temperature</Card.Title>
                <Card.Text
                  className=" text-center text-primary"
                  style={{ fontSize: "1.5rem" }}
                >
                  {sensorData.ds18b20?.temperature}
                </Card.Text>
                <p>
                  This shows the temperature measured by the temperature sensor
                  outside the device.
                </p>
                <p>
                  {sensorData.ds18b20?.temperature >= 10 &&
                  sensorData.ds18b20?.temperature <= 70 ? (
                    <span style={{ color: "green" }}>Good condition</span>
                  ) : sensorData.ds18b20?.temperature > 70 ? (
                    <span style={{ color: "red" }}>
                      Temperature High outside
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>Temperature Low</span>
                  )}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card border="warning" className="shadow-lg">
              <Card.Body>
                <Card.Title>Heat Index</Card.Title>
                <Card.Text
                  className=" text-center text-primary"
                  style={{ fontSize: "1.5rem" }}
                >
                  {sensorData.heat_index}
                </Card.Text>
                <p>
                  This shows the heat index inside the seed container using
                  temperature and humidity sensors.
                </p>
                <p>
                  {sensorData.heat_index >= 10 &&
                  sensorData.heat_index <= 70 ? (
                    <span style={{ color: "green" }}>Good condition</span>
                  ) : sensorData.heat_index > 70 ? (
                    <span style={{ color: "red" }}>Heat Index High</span>
                  ) : (
                    <span style={{ color: "red" }}>Heat Index Low</span>
                  )}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card border="info" className="shadow-lg">
              <Card.Body>
                <Card.Title>Soil Moisture Raw</Card.Title>
                <Card.Text
                  className=" text-center text-primary"
                  style={{ fontSize: "1.5rem" }}
                >
                  {sensorData.soil_moisture?.raw}
                </Card.Text>
                <p>This shows the moisture raw level of the seeds.</p>
                <p>
                  {sensorData.soil_moisture?.value >= 0 &&
                  sensorData.soil_moisture?.value <= 40 ? (
                    <span style={{ color: "green" }}>
                      Dry (Best for Storage)
                    </span>
                  ) : sensorData.soil_moisture?.value > 70 ? (
                    <span style={{ color: "red" }}>
                      {" "}
                      Slightly moist but safe for germination setup
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>
                      Not good for seed storage (risk of rot)
                    </span>
                  )}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card border="dark" className="shadow-lg">
              <Card.Body>
                <Card.Title>Soil Moisture Value</Card.Title>
                <Card.Text
                  className=" text-center text-primary"
                  style={{ fontSize: "1.5rem" }}
                >
                  {sensorData.soil_moisture?.value}
                </Card.Text>
                <p>This shows the moisture value level of the seeds.</p>
                <p>
                  {sensorData.soil_moisture?.value >= 0 &&
                  sensorData.soil_moisture?.value <= 40 ? (
                    <span style={{ color: "green" }}>
                      Dry (Best for Storage)
                    </span>
                  ) : sensorData.soil_moisture?.value > 70 ? (
                    <span style={{ color: "red" }}>
                      {" "}
                      Slightly moist but safe for germination setup
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>
                      Not good for seed storage (risk of rot)
                    </span>
                  )}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card border="secondary" className="shadow-lg">
              <Card.Body>
                <Card.Title>Alarm Status</Card.Title>
                <Form>
                  <Form.Check
                    type="switch"
                    id="alarm-switch"
                    label={led ? "Alarm On" : "Alarm Off"}
                    checked={led}
                    onChange={toggleAlarm}
                  />
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Row className="text-center mt-4" style={{ marginBottom: "80px" }}>
            <Card border="primary" className="shadow-lg">
              <Card.Body>
                <Card.Title>Seed Coverage Status</Card.Title>
                <Card.Text>
                  {sensorData.ir?.ir1 === true &&
                  sensorData.ir?.ir2 !== true &&
                  sensorData.ir?.ir3 !== true
                    ? "Initial Stage: Only some devices are under seed; accuracy may vary."
                    : sensorData.ir?.ir1 === true &&
                      sensorData.ir?.ir2 === true &&
                      sensorData.ir?.ir3 !== true
                    ? "Germination Stage: Approximately 50% of devices are covered; getting simpler values."
                    : sensorData.ir?.ir1 === true &&
                      sensorData.ir?.ir2 === true &&
                      sensorData.ir?.ir3 === true
                    ? "Advanced Stage: All devices are fully covered; expect accurate values."
                    : "No seeds detected."}
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
        </Row>
      )}
    </Container>
  );
}

export default Dashboard;
