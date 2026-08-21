import { useEffect, useState } from "react";
import "./analogClock.css";

const BASE_SIZE = 700;

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const [clockSize, setClockSize] = useState(BASE_SIZE);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const minViewport = Math.min(window.innerWidth, window.innerHeight);
      const newSize = Math.min(BASE_SIZE, Math.round(minViewport * 0.9));
      setClockSize(newSize);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const center = clockSize / 2;
  const numberRadius = Math.round(clockSize * 0.371); // 260/700

  return (
    <div className="clock-wrapper">
      <div
        className="clock"
        style={{ "--clock-size": `${clockSize}px` }}
      >
        {hours.map((num) => {
          const angle = (num * 30 * Math.PI) / 180;
          const x = center + numberRadius * Math.sin(angle);
          const y = center - numberRadius * Math.cos(angle);

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
    </div>
  );
};

export default AnalogClock