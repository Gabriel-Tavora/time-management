import { useEffect, useState } from "react";
import "./analogClock.css";

const CLOCK_SIZE = 700;
const CENTER = CLOCK_SIZE / 2; // 350
const NUMBER_RADIUS = 260; // distância do centro até cada número

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="clock">
      {hours.map((num) => {
        const angle = (num * 30 * Math.PI) / 180; 
        const x = CENTER + NUMBER_RADIUS * Math.sin(angle);
        const y = CENTER - NUMBER_RADIUS * Math.cos(angle);

        return (
          <span
            key={num}
            className="hour"
            style={{ left: `${x}px`, top: `${y}px` }}
          >
            {num}
          </span>
        );
      })}

      <div className="dot"></div>
      <div
        className="hour-hand"
        style={{
          transform: `rotateZ(${time.getHours() * 30 + time.getMinutes() * 0.5}deg)`,
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