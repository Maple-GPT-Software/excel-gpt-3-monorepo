import React from 'react';
import { UserMessageType } from '../types';
import DataTable from './DataTable';
import { CSV, FORMULA, USER_RANGE } from '../constants';
import CodeBlockMessage from './CodeBlockMessage';
import './UserMessage.style.css';

function UserMessage({ prompt: { content } }: { prompt: UserMessageType }) {
  const promptParts = content.split('\n');

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
