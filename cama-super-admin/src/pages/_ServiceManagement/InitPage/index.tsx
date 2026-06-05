import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import PageHeader from 'components/PageHeader';

function InitPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/system-management/hospital/list');
  }, []);

  return (
    <div>
      <PageHeader />

    </div>
  );
}

export default InitPage;

