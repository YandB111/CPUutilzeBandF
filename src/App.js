import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS for styling

function App() {
  const [cpuUsage, setCpuUsage] = useState(0);

  useEffect(() => {
    // Function to fetch CPU usage data
    const fetchCPUUsage = () => {
      fetch('http://localhost:8080/get-cpu-usage') // Replace with the actual server address
        .then((response) => response.text())
        .then((data) => {
          const usageArray = data.split(', ').map(parseFloat);
          // Filter out NaN values and use the last recorded CPU usage value
          const validUsageArray = usageArray.filter((value) => !isNaN(value));
          if (validUsageArray.length > 0) {
            setCpuUsage(validUsageArray[validUsageArray.length - 1]);
          }
        })
        .catch((error) => {
          console.error('Error fetching CPU usage:', error);
        });
    };

    // Fetch initial CPU usage
    fetchCPUUsage();

    // Update CPU usage every 5 seconds
    const intervalId = setInterval(fetchCPUUsage, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="gauge">
      <ul className="meter">
        <li className="low"></li>
        <li className="normal"></li>
        <li className="high"></li>
      </ul>
      <div className="dial">
        <div className="inner" style={{ transform: `rotate(${(cpuUsage * 1.8 - 90)}deg)` }}>
          <div className="arrow"></div>
        </div>
      </div>
      <div className="value">{cpuUsage.toFixed(2)}%</div>
    </div>
  );
}

export default App;
