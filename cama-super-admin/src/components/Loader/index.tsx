import React from 'react';
import ReactLoading from 'react-loading';

function Loader() {
  return (
    <div
      style={{
        width: 60, height: 60,
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    >
      <h2 style={{textAlign: 'center', marginBottom: 10}}>{''}</h2>
      <ReactLoading
        type={'spin'}
        color={'#F69021'}
        height={'100%'}
        width={'100%'}
      />
    </div>
  );
}

export default Loader;

