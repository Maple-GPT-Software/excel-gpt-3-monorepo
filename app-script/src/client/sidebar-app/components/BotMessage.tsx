import React from 'react';
import { GPTCompletion } from '../types.d';
import LoadingEllipsis from './LoadingEllipsis';
import { serverFunctions } from '../../utils/serverFunctions';

import './BotMessage.style.css';

const CODE_BLOCK = 'CODE_BLOCK';

interface BotMessageProps {
  completion: GPTCompletion;
}

function BotMessage({ completion }: BotMessageProps) {
  return (
    <div className="bot-message-wrapper">
      {!completion.choices.length && <LoadingEllipsis />}

      {/* text block when completion is a formula, start with CODE_BLOCK */}
      {!!completion.choices.length &&
        completion?.choices[0].text.includes(CODE_BLOCK) && (
          <BotCodeMessage formula={completion?.choices[0].text} />
        )}

      {/* text block when completion is just text */}
      {!!completion.choices.length &&
        !completion?.choices[0].text.includes(CODE_BLOCK) && (
          <p
            dangerouslySetInnerHTML={{
              __html: completion?.choices[0].text.replace('\n', '<br>'),
            }}
          ></p>
        )}
    </div>
  );
}

export default BotMessage;

// pre-prend code with CODE_BLOCK to insert it into a code block???
function BotCodeMessage({ formula }: { formula: string }) {
  function handleInsertIntoCell() {
    console.log('handling insert');
    serverFunctions.writeFormulaToCell();
  }

  return (
    <div className="bot-message-code-wrapper">
      <div className="bot-message-code-header">
        {/* TODO: insert into cell */}
        <button onClick={handleInsertIntoCell}>Insert into cell </button>
      </div>
      <div className="bot-message-code-container">
        <code
          dangerouslySetInnerHTML={{
            __html: formula.replace(CODE_BLOCK, '').replaceAll('\n', ''),
          }}
        ></code>
      </div>
    </div>
  );
}
