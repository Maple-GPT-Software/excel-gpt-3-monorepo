import React from 'react';
import { UserInput } from '../Chat';
import {
  getDataTableFromText,
  getFormulaFromText,
  getUserPromptFromText,
} from '../utils/regexUtils';
import DataTable from './DataTable';

import './UserMessage.style.css';
import CodeBlockMessage from './CodeBlockMessage';

function UserMessage({ prompt }: { prompt: UserInput }) {
  const datatable = getDataTableFromText(prompt);
  const formula = getFormulaFromText(prompt);
  const userPrompt = getUserPromptFromText(prompt);

  return (
    <div className="user-message-wrapper">
      <p> {userPrompt} </p>
      {formula && (
        <CodeBlockMessage formula={formula} showInsertFormula={false} />
      )}
      {datatable && <DataTable data={JSON.parse(datatable)} />}
    </div>
  );
}

export default UserMessage;
