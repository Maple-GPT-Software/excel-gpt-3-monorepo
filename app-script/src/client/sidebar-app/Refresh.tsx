import React from 'react';
import { useNavigate } from 'react-router-dom';

function Refresh() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        backgroundColor: 'white',
      }}
    >
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p style={{ textTransform: 'uppercase', marginTop: '2rem' }}>
        getting things ready
      </p>
    </div>
  );
}

export default Refresh;
