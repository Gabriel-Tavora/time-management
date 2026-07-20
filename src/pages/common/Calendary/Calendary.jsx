import React, { useState, useEffect } from "react";
//compone
import Sidebar from "../../../components/SideBar/SideBar";
//css
import "./Calendary.css";
//utils
import { calendaryGet } from '../../../utils/calendaryget';
import { formatDate } from '../../../utils/formatHours';
// services
import { getUserHours } from '../../../services/userHours';
//context
import { useAuthValue } from "../../../context/TokenContext.jsx"
const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const Calendary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userCurrentDate, setUserCurrentDate] = useState(null);
  const [workDates, setWorkDates] = useState(new Set());

  const { token } = useAuthValue();

  const {
    year,
    month,
    firstDay,
    daysInMonth,
    today,
  } = calendaryGet(currentDate);

  const calendarDays = [];

  useEffect(() => {
    async function loadingData() {
      const userData = await getUserHours(token);
      setUserCurrentDate(userData);

      const dates = new Set(
        userData.map(item => formatDate(item.overtime_records.work_date))
      );

      setWorkDates(dates);
    }

    if (token) {
      loadingData();
    }
  }, [token]);
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

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
            const currentDay = String(day).padStart(2, "0");
            const currentMonth = String(month + 1).padStart(2, "0");
            const currentYear = year;

            const buttonDate = `${currentDay}/${currentMonth}/${currentYear}`;

            const hasOvertime = workDates.has(buttonDate);
            return (
              <button
                key={index}
                className={`day
                  ${!day ? "empty" : ""}
                  ${isToday ? "today" : ""}
                  ${hasOvertime ? "overtime-day" : ""}
                  `}>
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