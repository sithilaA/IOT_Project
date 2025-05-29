import React, { useEffect, useRef, useState } from "react";
import { Card, Container, Form, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../services/firebase";
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

function IncomeExpenses() {
  const [dataPoints, setDataPoints] = useState([]);
  const db = getFirestore(app);
  const snapshotRef = useRef([]);
  const [realtimeData, setRealtimeData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [timeRange, setTimeRange] = useState("10"); // Default 10 minutes

  const timeRangeOptions = [
    { value: "10", label: "Last 10 mins" },
    { value: "30", label: "Last 30 mins" },
    { value: "60", label: "Last 1 hour" },
  ];

  // Fetch Historical Data on Load
  useEffect(() => {
    const fetchHistoricalData = async () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - parseInt(timeRange) * 60 * 1000);

      const q = query(
        collection(db, "soil_moisture_snapshots"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const historicalPoints = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt && data.createdAt.toDate() >= timeAgo) {
          data.snapshot.forEach((point) => {
            historicalPoints.push({
              x: new Date(point.x),
              y: point.y,
            });
          });
        }
      });
      setHistoricalData(historicalPoints);
    };

    fetchHistoricalData();
  }, [db, timeRange]);

  // Fetch Realtime Data from Firebase Realtime Database
  useEffect(() => {
    const rtdb = getDatabase(app);
    const sensorDataRef = ref(rtdb, "sensor_data/latest");

    const unsubscribe = onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      setRealtimeData(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Transform Realtime Data and Combine with Historical Data
  useEffect(() => {
    if (realtimeData) {
      const now = new Date();
      const newDataPoint = {
        x: now,
        y: realtimeData.soil_moisture?.value,
      };

      setDataPoints((prevDataPoints) => {
        const updatedDataPoints = [
          ...historicalData,
          ...prevDataPoints,
          newDataPoint,
        ];
        const timeAgo = new Date(
          now.getTime() - parseInt(timeRange) * 60 * 1000
        );
        return updatedDataPoints.filter((point) => point.x >= timeAgo);
      });

      snapshotRef.current = [...dataPoints, newDataPoint];
    }
  }, [realtimeData, historicalData, timeRange]);

  // Save Snapshot to Firestore every 1 minute
  useEffect(() => {
    const interval = setInterval(async () => {
      if (snapshotRef.current.length > 0) {
        try {
          await addDoc(collection(db, "soil_moisture_snapshots"), {
            snapshot: snapshotRef.current,
            createdAt: serverTimestamp(),
          });
          console.log("Snapshot saved to Firestore");
        } catch (error) {
          console.error("Error saving snapshot:", error);
        }
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [db]);

  const chartData = {
    datasets: [
      {
        label: "Soil Moisture",
        data: dataPoints,
        fill: false,
        borderColor: "#007bff",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `Soil Moisture (Last ${timeRange} Minutes)`,
      },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "second", tooltipFormat: "HH:mm:ss" },
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Moisture Value" },
      },
    },
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <Container>
      <h1 className="text-center m-4">Soil Moisture Live Chart</h1>

      <Form>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Time Range:
          </Form.Label>
          <Col sm="10">
            <Form.Select onChange={handleTimeRangeChange} value={timeRange}>
              {timeRangeOptions.map((option) => (
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

export default IncomeExpenses;
