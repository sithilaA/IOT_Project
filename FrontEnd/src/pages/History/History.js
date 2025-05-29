import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { app } from "../../services/firebase";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

function History() {
  const [selectedChart, setSelectedChart] = useState("humidity_snapshots");
  const [historicalData, setHistoricalData] = useState([]);
  const db = getFirestore(app);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `Historical Data - ${selectedChart}`,
      },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "day", tooltipFormat: "yyyy-MM-dd HH:mm" }, // Corrected format
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Value" },
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: "Value",
        data: historicalData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptionsList = [
    { value: "humidity_snapshots", label: "Humidity" },
    { value: "soil_moisture_snapshots", label: " Moisture" },
    { value: "temperature_snapshots", label: "Temperature" },
  ];

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        let q = query(
          collection(db, selectedChart),
          orderBy("createdAt", "asc")
        );

        const allData = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Fetched data:", data);
          if (
            data.snapshot &&
            Array.isArray(data.snapshot) &&
            data.snapshot.length > 0
          ) {
            // Only take the first point
            const point = data.snapshot[0];
            allData.push({
              x: point.x.toDate(), // Convert Firebase Timestamp to JavaScript Date
              y: point.y,
            });
          }
        });
        setHistoricalData(allData);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchHistoricalData();
  }, [db, selectedChart]);

  const handleChartChange = (e) => {
    setSelectedChart(e.target.value);
  };

  return (
    <Container>
      <h1 className="text-center m-4">Historical Data</h1>
      <Form>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Select Chart:
          </Form.Label>
          <Col sm="4">
            <Form.Select onChange={handleChartChange} value={selectedChart}>
              {chartOptionsList.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>
      </Form>
      <Card className="p-4">
        <Line data={chartData} options={chartOptions} />
      </Card>
    </Container>
  );
}

export default History;
