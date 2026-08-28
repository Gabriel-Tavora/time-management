import React from "react";

// components
import Input from "../../common/Inputs/Inputs.jsx";

const CreateUser = () => {
  return (
    <form className="input-time">
      <div className="date-time">
        <Input
          classNameIn="commun-input"
          labelText="Nome"
          id="name"
          type="text"
          name="name"
          required
        />

        <Input
          classNameIn="commun-input"
          labelText="Nome de usuário"
          id="display_name"
          type="text"
          name="display_name"
          required
        />

        <Input
          classNameIn="commun-input"
          labelText="Telefone"
          id="phone"
          type="tel"
          name="phone"
          required
        />

        <Input
          classNameIn="commun-input"
          labelText="Senha"
          id="password"
          type="password"
          name="password"
          required
        />
      </div>
      <div className="date-time">
        <Input
          classNameIn="commun-input"
          labelText="Email"
          id="email"
          type="email"
          name="email"
          required
        />

        <Input
          classNameIn="commun-input"
          labelText="CPF"
          id="cpf"
          type="text"
          name="cpf"
          inputMode="numeric"
          maxLength={11}
          required
        />
      </div>
      
      <div className="date-time">
        <button
          type="submit"
          className="time-menu-send-btn"
        >
          Criar Usuário
        </button>
      </div>
    </form>
  );
};

export default CreateUser;
