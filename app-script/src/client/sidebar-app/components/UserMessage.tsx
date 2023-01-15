import React from 'react';

import './UserMessage.style.css';

function UserMessage({ prompt }: { prompt: string }) {
  return (
    <div className="user-message-wrapper">
      <p> {prompt} </p>
    </div>
  );
}

export default UserMessage;
