import { useEffect, useState } from "react";
import "./analogClock.css";

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return (
    <div className="clock">
      <div className="dot"></div>
      <div
        className="hour-hand"
        style={{
          transform: `rotateZ(${time.getHours() * 30}deg)`,
        }}
      ></div>
      <div
        className="minute-hand"
        style={{
          transform: `rotateZ(${time.getMinutes() * 6}deg)`,
        }}
      ></div>
      <div
        className="second-hand"
        style={{
          transform: `rotateZ(${time.getSeconds() * 6}deg)`,
        }}
      ></div>
    </div>
  );
};

export default AnalogClock;