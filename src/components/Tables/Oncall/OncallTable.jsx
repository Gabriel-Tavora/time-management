import React, { useState, useEffect } from 'react'
//services
import { getMonthOncall } from '../../../services/contractData'
// context
import { useAuthValue } from "../../../context/TokenContext.jsx";

const OncallTable = ({ idMonth }) => {
  const { token } = useAuthValue();
  const [onCall, setOnCall] = useState(null);
  console.log(idMonth)
  useEffect(() => {
    if (!token || !idMonth) return;

    const loadData = async () => {
      try {
        const response = await getMonthOncall(token, idMonth);
        setOnCall(response);
      } catch (error) {
        setOnCall(null);
        console.error(error);
      }
    };

    loadData();
  }, [token, idMonth]);

  return (
    <div>
      {/* tabela */}
    </div>
  );
};
export default OncallTable