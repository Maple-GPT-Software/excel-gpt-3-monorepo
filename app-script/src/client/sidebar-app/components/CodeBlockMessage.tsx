import React, { useState } from 'react';
import LoadingEllipsis from './LoadingEllipsis';
import { serverFunctions } from '../../utils/serverFunctions';
import { FORMULA } from '../constants';

import './CodeBlockMessage.style.css';

/**
 * This render the formula completion in a IDE-like UI element
 * and conditionally renders a button for inserting formula into sheet
 * NOTE: formula should keep %formula% placeholder
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
    try {
      await serverFunctions.writeFormulaToCell(
        formatFormulaForSheetInsert(formula)
      );
    } finally {
      setIsInserting(false);
    }
  }

  return (
    <div className="bot-message-code-wrapper">
      <div className="bot-message-code-header">
        {showInsertFormula && !isInserting && (
          <button onClick={handleInsertIntoCell}>INSERT INTO CELL</button>
        )}
        {showInsertFormula && isInserting && <LoadingEllipsis />}
      </div>
      <div className="bot-message-code-container">
        <code
          dangerouslySetInnerHTML={{
            __html: formula.replace(FORMULA, '').replaceAll('\n', ''),
          }}
        ></code>
      </div>
    </div>
  );
}

export default CodeBlockMessage;

/** removes %FORMULA% from string and any leading whitespace that the AI inserts by accident */
function formatFormulaForSheetInsert(formula: string) {
  return formula.replace(FORMULA, '').replace(/^\s+/g, '');
}
