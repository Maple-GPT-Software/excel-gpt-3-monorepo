import React from 'react';
import { UserInput } from '../Chat';
import DataTable from './DataTable';

import './UserMessage.style.css';

function UserMessage({ prompt }: { prompt: UserInput }) {
  // TODO: some preprocessing to display data table and formula
  // if they are present the user prompt string

  return (
    <div className="user-message-wrapper">
      <p> {prompt} </p>
      {/* {!!prompt.dataTable?.values && <DataTable data={undefined} />} */}
      {/* <DataTable data={undefined} />
      {prompt.formula && <p>has formula</p>} */}
    </div>
  );
}

export default UserMessage;
