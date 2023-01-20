import React, { useState } from 'react';
import { GPTCompletion } from '../types.d';
import LoadingEllipsis from './LoadingEllipsis';
import Icon from './Icon';
import { serverFunctions } from '../../utils/serverFunctions';

import './BotMessage.style.css';

const CODE_BLOCK = 'CODE_BLOCK';

interface BotMessageProps {
  completion: GPTCompletion;
}

function BotMessage({ completion }: BotMessageProps) {
  if (!completion.choices.length) {
    return (
      <div className="bot-message-wrapper">
        <LoadingEllipsis />
      </div>
    );
  }

  return (
    <div className="bot-message-wrapper">
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

      <RateCompletion completion={completion} />
    </div>
  );
}

export default BotMessage;

/**
 * This render the code completion in a IDE-like UI element
 * and includes element for inserting formula into the UI
 */
function BotCodeMessage({ formula }: { formula: string }) {
  function handleInsertIntoCell() {
    console.log('handling insert');
    serverFunctions.writeFormulaToCell();
  }

  return (
    <div className="bot-message-code-wrapper">
      <div className="bot-message-code-header">
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

interface RateCompletionFormProps {
  completion: GPTCompletion;
}

const RateCompletion: React.FC<RateCompletionFormProps> = (props) => {
  const { completion } = props;

  // TODO: get user from AuthProvider
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="like-dislike-container">
      <Icon pathName="THUMB_DOWN" width={16} height={16} onClick={() => {}} />
      <Icon pathName="THUMB_UP" width={16} height={16} onClick={() => {}} />
    </div>
  );
};
