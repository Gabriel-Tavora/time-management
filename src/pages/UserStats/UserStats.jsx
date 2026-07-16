import React from 'react'
//components
import Sidebar from '../../components/SideBar/SideBar.jsx'
//css
import "./UserStats.css"
const UserStats = () => {
  return (
    <div className="stats">
      <Sidebar />
      <div className="menu-stats">
        <header>
          <h1>Conta</h1>
        </header>
        <section className="menu-data">
          <ul>
            <li>
              <h2>Nome: Dawn Hansen</h2>
            </li>
            <li>
              <h2>Apelido: Cid</h2>
            </li>
            <li>
              <h2>Email: cid@gmail.com</h2>
            </li>
            <li>
              <h2>Telefone: 8593525550675</h2>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default UserStats;