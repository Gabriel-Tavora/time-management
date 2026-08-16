import React, { useEffect, useState } from "react";

// components
import Sidebar from "../../../components/Layouts/SideBar/SideBar";

// css
import "./Calendary.css";

// utils
import { calendaryGet } from "../../../utils/calendaryget";
import { formatDate } from "../../../utils/formatHours";

// services
import { getUserHours } from "../../../services/overtimeData.js";

// context
import { useAuthValue } from "../../../context/TokenContext.jsx";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const Calendary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workDates, setWorkDates] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthValue();

  const { year, month, firstDay, daysInMonth, today } =
    calendaryGet(currentDate);

  useEffect(() => {
    let isMounted = true;

    const loadingData = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const userData = await getUserHours(token);

        if (!isMounted) return;

        const dates = new Set(
          userData
            .map((item) => item?.overtime_record?.work_date)
            .filter(Boolean)
            .map(formatDate),
        );

        setWorkDates(dates);
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(error?.message || "Erro ao carregar horas extras.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadingData();
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  return (
    <div className="calendary-menu">
      <Sidebar />

      <main className="calendary-page">
        <header className="calendar-header">
          <button
            type="button"
            className="month-btn"
            onClick={previousMonth}
            aria-label="Mês anterior"
          >
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

          <button
            type="button"
            className="month-btn"
            onClick={nextMonth}
            aria-label="Próximo mês"
          >
            ▶
          </button>
        </header>

        {loading && <p className="form-message">Carregando horas extras...</p>}

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
            if (day === null) {
              return (
                <button
                  key={`empty-${index}`}
                  type="button"
                  className="day empty"
                  disabled
                  aria-hidden="true"
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
                key={`${year}-${month}-${day}`}
                type="button"
                className={classNames}
              >
                {day}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Calendary;
