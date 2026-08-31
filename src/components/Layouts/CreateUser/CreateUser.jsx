import React from "react";

// Components
import Input from "../../common/Inputs/Inputs.jsx";
import Button from "../../common/Button/Button.jsx";

// CSS
import "../../../styles/RegisterInfo.css";

const CreateUser = ({ isSubmitting, errorMessage }) => {
  return (
    <div className="create-user-content">

      <div className="create-user-row">

        <Input
          placeholder="Digite o nome completo"
          classNameIn="commun-input"
          labelText="Nome"
          id="name"
          type="text"
          name="name"
          required
          disabled={isSubmitting}
        />

        <Input
          placeholder="Digite o nome de usuário"
          classNameIn="commun-input"
          labelText="Nome de usuário"
          id="displayName"
          type="text"
          name="displayName"
          required
          disabled={isSubmitting}
        />

        <Input
          placeholder="(00) 00000-0000"
          classNameIn="commun-input"
          labelText="Telefone"
          id="phone"
          type="tel"
          name="phone"
          required
          disabled={isSubmitting}
        />

        <Input
          placeholder="********"
          classNameIn="commun-input"
          labelText="Senha"
          id="password"
          type="password"
          name="password"
          required
          disabled={isSubmitting}
        />

      </div>

      <div className="create-user-row">

        <Input
          placeholder="exemplo@email.com"
          classNameIn="commun-input"
          labelText="Email"
          id="email"
          type="email"
          name="email"
          required
          disabled={isSubmitting}
        />

        <Input
          placeholder="000.000.000-00"
          classNameIn="commun-input"
          labelText="CPF"
          id="cpf"
          type="text"
          name="cpf"
          inputMode="numeric"
          maxLength={11}
          required
          disabled={isSubmitting}
        />

        <Input
          placeholder="0"
          classNameIn="commun-input"
          labelText="Função"
          id="role_id"
          type="text"
          name="role_id"
          inputMode="numeric"
          maxLength={1}
          required
          disabled={isSubmitting}
        />

      </div>

      <div className="create-user-button">
        {errorMessage && (
          <p
            className="time-menu-message time-menu-message-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
      
      <div className="create-user-button">
        <Button
          type="submit"
          className="btn-large btn"
          buttonText={
            isSubmitting
              ? "Criando Usuário..."
              : "Criar Usuário"
          }
          disabled={isSubmitting}
        />
      </div>

    </div>
  );
};

export default CreateUser;