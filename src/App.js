import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS for styling

function App() {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [ramUsage, setRamUsage] = useState(0);
  const [swapUsage, setSwapUsage] = useState(0);

  useEffect(() => {
    // Function to fetch system monitoring data
    const fetchSystemMonitoring = () => {
      fetch('http://192.168.102.111:9187/monitoring')
        .then((response) => response.json()) // Parse JSON response
        .then((data) => {
          if (data.cpu) {
            setCpuUsage(data.cpu);
          }
          if (data.ram) {
            setRamUsage(data.ram);
          }
          if (data.swap) {
            setSwapUsage(data.swap);
          }
        })
        .catch((error) => {
          console.error('Error fetching system monitoring data:', error);
        });
    };

    // Fetch initial system monitoring data
    fetchSystemMonitoring();

    // Update system monitoring data every 5 seconds
    const intervalId = setInterval(fetchSystemMonitoring, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="monitoring-container">
      {/* CPU Gauge */}
      <div className={`gauge cpu-gauge ${cpuUsage > 50 ? 'red' : ''}`}>
        <ul className="meter">
          <li className="low"></li>
          <li className="normal"></li>
          <li className="high"></li>
        </ul>
        <div className="dial">
          <div className={`inner ${cpuUsage > 50 ? 'red' : ''}`} style={{ transform: `rotate(${(cpuUsage * 1.8 - 90)}deg)` }}>
            <div className={`arrow ${cpuUsage > 50 ? 'red' : ''}`}></div>
            <div className={`mouse-arrow ${cpuUsage > 50 ? 'red' : ''}`}></div>
          </div>
        </div>
        <div className="value">CPU RAM: {cpuUsage.toFixed(2)}%</div>
      </div>
      
      {/* RAM Gauge */}
      <div className={`gauge ram-gauge ${ramUsage > 50 ? 'red' : ''}`}>
        <ul className="meter">
          <li className="low"></li>
          <li className="normal"></li>
          <li className="high"></li>
        </ul>
        <div className="dial">
          <div className={`inner ${ramUsage > 50 ? 'red' : ''}`} style={{ transform: `rotate(${(ramUsage * 1.8 - 90)}deg)` }}>
            <div className={`arrow ${ramUsage > 50 ? 'red' : ''}`}></div>
            <div className={`mouse-arrow ${ramUsage > 50 ? 'red' : ''}`}></div>
          </div>
        </div>
        <div className="value">Ram Usage {ramUsage.toFixed(2)}%</div>
      </div>
      
      {/* Swap Gauge */}
      <div className={`gauge swap-gauge ${swapUsage > 50 ? 'red' : ''}`}>
        <ul className="meter">
          <li className="low"></li>
          <li className="normal"></li>
          <li className="high"></li>
        </ul>
        <div className="dial">
          <div className={`inner ${swapUsage > 50 ? 'red' : ''}`} style={{ transform: `rotate(${(swapUsage * 1.8 - 90)}deg)` }}>
            <div className={`arrow ${swapUsage > 50 ? 'red' : ''}`}></div>
            <div className={`mouse-arrow ${swapUsage > 50 ? 'red' : ''}`}></div>
          </div>
        </div>
        <div className="value">Swap Usage {swapUsage.toFixed(2)}%</div>
      </div>
    </div>
  );
}

export default App;
