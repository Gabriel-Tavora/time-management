import React from 'react'
//css 
import "./NotFound.css"
const NotFound = () => {
  return (
    <div className="not-found">
      <h1>Página não encontrada <span className="erro">ERRO 404!</span></h1>
      <p>você foi muito longe do site, volte por favor!</p>
      <p>apesar que aqui nada será encontrado</p>
    </div>
  )
}

export default NotFound