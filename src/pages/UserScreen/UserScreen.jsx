import React from 'react'
//components
import Sidebar from '../../components/SideBar/SideBar.jsx'
import MainInformations from '../../components/MainInformations/MainInformations.jsx'
// CSS 
import "./UserScreen.css"
const UserScreen = () => {
  return (
    <div className="user-screen">
      <Sidebar />
      <MainInformations />
    </div>
  )
}

export default UserScreen;