import React, { useState } from "react";
import Sidebar from "../../components/SideBar/SideBar";
import "./Calendary.css";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const Calendary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const calendarDays = [];

  
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  
  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  return (
    <div className="calendary-menu">
      <Sidebar />

      <div className="calendary-page">

        <header className="calendar-header">

          <button className="month-btn" onClick={previousMonth}>
            ◀
          </button>

          <div>
            <h1>Calendário</h1>

            <h2>
              {currentDate.toLocaleString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>

          <button className="month-btn" onClick={nextMonth}>
            ▶
          </button>

        </header>

        <div className="week-days">
          {weekDays.map((day) => (
            <h3 key={day}>{day}</h3>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            const isToday =
              day &&
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            return (
              <button
                key={index}
                className={`day ${!day ? "empty" : ""} ${isToday ? "today" : ""
                  }`}
              >
                {day}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Calendary;