import React from "react";

// Components
import CreateUser from "../Layouts/CreateUser/CreateUser";

// CSS
import "../../styles/RegisterInfo.css";

// Hooks
import { usecreateUser } from "../../hooks/useSuperAdmin";

const SuperAdminTable = () => {
  const {
    handleSubmit,
    isSubmitting,
    errorMessage,
  } = usecreateUser();

  return (
    <div className="super-admin-page">
      <h1 className="super-admin-title">
        Criar Usuário
      </h1>

      <form
        className="super-admin-form"
        onSubmit={handleSubmit}
      >
        <CreateUser
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </form>
    </div>
  );
};

export default SuperAdminTable;