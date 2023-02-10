import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import { CHAT_ROUTE } from './constants';

function Refresh() {
  // const { user } = useAuthContext();
  // const navigate = useNavigate();

  // if the user goes backwards by scrolling to the left
  // we want to re-direct them to the chat route if
  // there is a valid user session
  // useEffect(() => {
  //   if (user) {
  //     setTimeout(() => {
  //       navigate(CHAT_ROUTE);
  //     }, 300);
  //   }
  // }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
