import React from 'react'
// Components
import CreateUser from '../Layouts/CreateUser/CreateUser'
// CSS
import "../../styles/registerHours.css";
const SuperAdminTable = () => {
  return (
    <div>
      <aside className="add-time-menu">
        <div className="time-menu-container">
          <h1>Criar Usuário</h1>
          <form className="time-menu-form" >
            <CreateUser
            />

            {/* {nightTime && (
              <div className="time-menu-night-alert">
                🌙 Horário noturno detectado
              </div>
            )}

            <RegisterInfo
              mode={"register"}
              jiraTask={jiraTask}
              observation={observation}
              onJiraTaskChange={(e) => setJiraTask(e.target.value)}
              onObservationChange={(e) => setObservation(e.target.value)}
              message={message}
              isSubmitting={isSubmitting}
            /> */}
          </form>
        </div>
      </aside>
    </div>
  )
}

export default SuperAdminTable;