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
        <div className="select">
          <span>Cargo</span>
          <select
            className="commun-select"
            id="role_id"
            name="role_id"
            disabled={isSubmitting}
            required
          >
            <option value="">Selecione uma opção</option>
            <option value="1">SuperAdmin</option>
            <option value="2">Gestor</option>
            <option value="3">Coordenador</option>
            <option value="4">Teamleader</option>
            <option value="5">Usuário</option>
          </select>
        </div>

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