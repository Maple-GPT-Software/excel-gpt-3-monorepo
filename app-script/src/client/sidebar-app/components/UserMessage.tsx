import React from 'react';
import { UserInput } from '../Chat';
import DataTable from './DataTable';

import './UserMessage.style.css';
import CodeBlockMessage from './CodeBlockMessage';
import { CSV, FORMULA, USER_RANGE } from '../constants';

function UserMessage({ prompt }: { prompt: UserInput }) {
  const promptParts = prompt.split('\n');

  return (
    <div className="user-message-wrapper">
      {promptParts.map((part, index) => {
        if (part.includes(`${USER_RANGE}`)) {
          const csvOnly = part.split(CSV)[1];

          if (csvOnly.length) {
            return <DataTable data={JSON.parse(csvOnly)} key={index} />;
          } else {
            null;
          }
        } else if (part.includes(FORMULA)) {
          return (
            <CodeBlockMessage
              formula={part}
              showInsertFormula={false}
              key={index}
            />
          );
        } else {
          return <p key={index}>{part}</p>;
        }
      })}
    </div>
  );
}

export default UserMessage;
