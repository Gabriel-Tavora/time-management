import React, { useState, useEffect } from "react";
//componentes
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import Button from "../../../components/Layouts/Button/Button.jsx"
//css
import "./Calendary.css";
//utils
import { calendaryGet } from '../../../utils/calendaryget';
// services
import { getUserHours } from '../../../services/overtimeData.js';
//context
import { useAuthValue } from "../../../context/TokenContext.jsx"

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getUtcDateKey(dateValue) {
  const d = new Date(dateValue);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

// Deriva os dias com hora extra a partir de start_time/end_time, não de
// work_date — isso garante que turnos de múltiplos dias marquem TODOS os
// dias cobertos, não só o dia de início.
function buildWorkDatesSet(records) {
  const dates = new Set();

  records.forEach((item) => {
    const { start_time, end_time } = item.overtime_records;
    if (!start_time || !end_time) return;

    const cursor = new Date(start_time);
    const end = new Date(end_time);

    while (cursor <= end) {
      dates.add(getUtcDateKey(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  });

  return dates;
}

const Calendary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userCurrentDate, setUserCurrentDate] = useState(null);
  const [workDates, setWorkDates] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState(null);

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
    let cancelled = false;

    async function loadingData() {
      setErrorMessage(null);

      try {
        const userData = await getUserHours(token);
        if (cancelled) return;

        setUserCurrentDate(userData);
        setWorkDates(buildWorkDatesSet(userData));
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setErrorMessage(error?.message || "Erro ao carregar horas extras.");
      }
    }

    if (token) {
      loadingData();
    }

    return () => {
      cancelled = true;
    };
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

          <Button
            className="change-btn"
            onClick={previousMonth}
            aria-label="Mês anterior"
            buttonText="◀"
          />

          <div>
            <h1>Calendário</h1>

            <h2>
              {currentDate.toLocaleString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>

          <Button
            className="change-btn"
            onClick={nextMonth}
            aria-label="Próximo mês"
            buttonText="▶"
          />
        </header>

        {errorMessage && (
          <p className="form-message error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="week-days">
          {weekDays.map((day) => (
            <h3 key={day}>{day}</h3>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            if (!day) {
              return (
                <button
                  key={index}
                  type="button"
                  className="day empty"
                  disabled
                />
              );
            }

            const isToday =
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            const currentDay = String(day).padStart(2, "0");
            const currentMonth = String(month + 1).padStart(2, "0");
            const buttonDate = `${currentDay}/${currentMonth}/${year}`;

            const hasOvertime = workDates.has(buttonDate);

            const classNames = [
              "day",
              isToday && "today",
              hasOvertime && "overtime-day",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={index}
                type="button"
                className={classNames}
                aria-current={isToday ? "date" : undefined}
                aria-label={`${buttonDate}${hasOvertime ? ", com hora extra registrada" : ""}`}
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