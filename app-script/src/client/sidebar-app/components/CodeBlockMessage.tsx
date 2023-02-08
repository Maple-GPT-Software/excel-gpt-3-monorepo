import React, { useState } from 'react';
import LoadingEllipsis from './LoadingEllipsis';
import { serverFunctions } from '../../utils/serverFunctions';
import { CODE_BLOCK } from '../constants';

import './CodeBlockMessage.style.css';

/**
 * This render the code completion in a IDE-like UI element
 * and conditionally renders a button for inserting formula into sheet
 */
function CodeBlockMessage({
  formula,
  showInsertFormula = true,
}: {
  formula: string;
  showInsertFormula?: boolean;
}) {
  const [isInserting, setIsInserting] = useState(false);

  async function handleInsertIntoCell() {
    setIsInserting(true);
    await serverFunctions.writeFormulaToCell();
    setIsInserting(false);
  }

  return (
    <div className="bot-message-code-wrapper">
      <div className="bot-message-code-header">
        {showInsertFormula && !isInserting ? (
          <button onClick={handleInsertIntoCell}>INSERT INTO CELL</button>
        ) : (
          showInsertFormula ?? <LoadingEllipsis />
        )}
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

export default CodeBlockMessage;
