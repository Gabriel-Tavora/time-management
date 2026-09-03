import React, { useRef, useState } from "react";
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import Button from "../../../components/common/Button/Button.jsx";
import "./Calendary.css";
import { calendaryGet } from "../../../utils/calendaryget";
import { formatDate, formatTime, formatHours } from "../../../utils/formatHours";
import { useCalendary } from "../../../hooks/useCalendary";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const Calendary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedOvertime, setSelectedOvertime] = useState([]);
  const showInfo = useRef(null);
  const { overtimeRecords, errorMessage } = useCalendary();
  const { year, month, firstDay, daysInMonth, today } = calendaryGet(currentDate);
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);
  while (calendarDays.length < 42) calendarDays.push(null);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDialog = (overtimes) => {
    setSelectedOvertime(overtimes);
    showInfo.current?.showModal();
  };

  const closeDialog = () => {
    showInfo.current?.close();
    setSelectedOvertime([]);
  };

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

        <dialog ref={showInfo} className="dialog-calendary">
          <div>
            <h2>Horas extras</h2>
          </div>

          {selectedOvertime.length > 0 && (
            <div>
              <p>
                Data:{" "}
                {formatDate(selectedOvertime[0].overtime_records.start_time)}
              </p>
              {selectedOvertime.map((item, index) => {
                const record = item.overtime_records;
                return (
                  <div key={index} className="data-extra">
                    <h3>Registro {index + 1}</h3>
                    <div>
                      <p>Início: {formatTime(record.start_time)}</p>
                      <p>Fim: {formatTime(record.end_time)}</p>
                      <p>Total: {formatHours(record.total_hours)}</p>
                      <p> Horas noturnas:{" "}{formatHours(record.nigth_hours ?? 0)}</p>
                      <p> jira:{" "}{record.jira_task_identifier}</p>
                      {record.observation && (
                        <p className="observation">
                          Observação: {record.observation}
                        </p>
                      )}
                      <hr />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Button
            className="btn btn-medium"
            type="button"
            onClick={closeDialog}
            buttonText="Fechar"
          />
        </dialog>
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
            const date = new Date(year, month, day);
            const buttonDate = formatDate(date);
            const overtimeOfDay = overtimeRecords.filter((item) => {
              const startTime = item.overtime_records?.start_time;
              return startTime && formatDate(startTime) === buttonDate;
            });
            const hasOvertime = overtimeOfDay.length > 0;
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
                onClick={() => hasOvertime && handleDialog(overtimeOfDay)}
                aria-current={isToday ? "date" : undefined}
                aria-label={`${buttonDate}${hasOvertime ? ", com hora extra registrada" : ""
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