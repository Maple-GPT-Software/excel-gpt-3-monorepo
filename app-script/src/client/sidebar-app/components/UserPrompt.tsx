// NPM
import React, { useState, useRef } from 'react';
// UTILS
import SimplifyApi from '../api/SimplifyApi';
import { serverFunctions } from '../../utils/serverFunctions';
// TYPES
import { ChatActions, ChatReducerActionTypes } from '../Chat';
import { ValueRangeObj } from '../types';
// HOOKS
import { useAuthContext } from '../AuthProvider';
import useAutosizeTextArea from '../hooks/useAutosizeTextArea';
import useOnClickOutside from '../hooks/useOnClickOutside';
// COMPONENTS
import DataTable from './DataTable';
import CodeBlockMessage from './CodeBlockMessage';
import Icon from './Icon';
import LoadingEllipsis from './LoadingEllipsis';
// PROJECT MODULES
import {
  USER_PROMPT_ENHANCEMENTS,
  USER_RANGE,
  USER_DATA_TABLE,
  FORMULA_BLOCK,
} from '../constants';

import './UserPrompt.style.css';

interface ChatInputProps {
  shouldDisableTextarea: boolean;
  dispatch: (value: ChatActions) => void;
  scrollToBottomOfChat: () => void;
}

const UserPrompt = (props: ChatInputProps) => {
  const { accessToken } = useAuthContext();
  const { shouldDisableTextarea, dispatch, scrollToBottomOfChat } = props;

  const [input, setInput] = useState('');
  const [dataTable, setDataTable] = useState<ValueRangeObj | ''>('');
  // formula from SpreadsheetApp always starts with "="
  const [formula, setFormula] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // this flag is true when either of the two chat menu options are clicked to show
  // a loading state for the API call
  const [isAppsheetFetching, setIsAppsheetFetching] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const propMenuWrapperRef = useRef<HTMLDivElement>(null);

  useAutosizeTextArea(textAreaRef?.current, input);
  useOnClickOutside(propMenuWrapperRef, () => setIsMenuOpen(false));

  async function handleSubmit() {
    if (!input) return;

    const clientUserPrompt = formatUserInputs(input, dataTable, formula);

    // re-initialize input state
    setInput('');
    setDataTable('');
    setFormula('');

    dispatch({
      type: ChatReducerActionTypes.ADD_USER_PROMPT,
      // TODO: format data table and formula
      payload: clientUserPrompt,
    });

    // scroll to bottom of chat container after user's prompt is added
    // wrapped in setTimeout so that immer dispatch updates chat first
    setTimeout(() => {
      scrollToBottomOfChat();
    });

    try {
      const completion = await SimplifyApi(accessToken).getCompletion(
        formatUserPromptForAPI(clientUserPrompt)
      );

      dispatch({
        type: ChatReducerActionTypes.ADD_GPT_COMPLETION_SUCCESS,
        payload: completion,
      });
    } catch (error: any) {
      dispatch({
        type: ChatReducerActionTypes.ADD_GPT_COMPLETION_FAIL,
        payload:
          error.message ?? 'Unexpected Error. Pleaser retry your request.',
      });
    } finally {
      scrollToBottomOfChat();
    }
  }

  /**
   * get the formula that the user has selected in the spreadhseet app
   * as a string
   */
  async function getSelectedFormulaHandler() {
    try {
      setIsAppsheetFetching(true);
      const formula = await serverFunctions.getSelectedCellFormula();
      setFormula(formula);
    } catch (error) {}
    setIsMenuOpen(false);
    setIsAppsheetFetching(false);
  }

  /**
   * get the range of cells the user has selected in the spreadhseet app
   * as a JSON of string[][], e.g [["2/1/2023","hello,world","1:00:00 AM","2.335"]]
   */
  async function getSelectedRangeValuesHandler() {
    try {
      setIsAppsheetFetching(true);
      const rangeValueObj = await serverFunctions.getSelectedRangeValues();
      console.log(rangeValueObj);
      if (rangeValueObj) {
        setDataTable(rangeValueObj);
      }
    } catch (error) {}
    setIsMenuOpen(false);
    setIsAppsheetFetching(false);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && input) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function ønChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target?.value;
    setInput(value);
  }

  function removeDataTable() {
    setDataTable('');
  }

  function removeFormula() {
    setFormula('');
  }

  return (
    <div className="prompt-wrapper">
      <div className="text-area-wrapper" style={{ position: 'relative' }}>
        <textarea
          rows={1}
          ref={textAreaRef}
          value={input}
          aria-label="user-prompt"
          onKeyDown={handleInputKeyDown}
          onChange={ønChangeHandler}
          disabled={shouldDisableTextarea}
        />
        {!(dataTable && formula) && (
          // menu "icon" to open popup
          <button
            aria-label="Open message attachments menu"
            className="button-round attachment-button"
            onClick={() => setIsMenuOpen(true)}
          >
            +
          </button>
        )}
        {/* MENU FOR TO SELECT INSERT FORMULA OR RANGE */}
        {isMenuOpen && (
          <div ref={propMenuWrapperRef} className="prompt-options-menu">
            {isAppsheetFetching ? (
              <div className="prompt-options-menu-loader">
                <LoadingEllipsis />
              </div>
            ) : (
              <>
                {!formula && (
                  <div onClick={getSelectedFormulaHandler}>
                    <Icon
                      pathName="ARROW_RIGHT_ON_RECT"
                      width={18}
                      height={18}
                    />
                    <p>Insert selected formula</p>
                  </div>
                )}
                {!dataTable && (
                  <div onClick={getSelectedRangeValuesHandler}>
                    <Icon
                      pathName="ARROW_RIGHT_ON_RECT"
                      width={18}
                      height={18}
                    />
                    <p>Insert selected range</p>
                  </div>
                )}
                {dataTable && formula && (
                  <p style={{ position: 'absolute', bottom: 25 }}>
                    only one formula and range can be attached to your message
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {/* <div className="prompt-submit" onClick={handleSubmit} /> */}

      {/* RENDER DATA TABLE IF USER HAS INSERTED ONE */}
      {dataTable && (
        <div className="attachment-wrapper">
          <button
            className="button-round"
            aria-label="remove data table"
            type="button"
            onClick={removeDataTable}
          >
            X
          </button>
          <DataTable data={JSON.parse(dataTable.values)} />
        </div>
      )}

      {/* RENDER DATA TABLE IF USER HAS INSERTED ONE */}
      {formula && (
        <div className="attachment-wrapper">
          <button
            className="button-round"
            aria-label="remove data table"
            type="button"
            onClick={removeFormula}
          >
            X
          </button>
          <CodeBlockMessage formula={formula} showInsertFormula={false} />
        </div>
      )}
    </div>
  );
};

export default UserPrompt;

// TODO: fix USER_PROMPT_ENHANCEMENTS, we can get rid of it entirely.
function formatUserInputs(
  input: string,
  datatable: ValueRangeObj | '',
  formula: string
) {
  // we add this string regardless if there are no enhancements
  // we have a utility function that will take it out for display purposes
  let formattedInputs = input + ` ${USER_PROMPT_ENHANCEMENTS}`;

  if (datatable) {
    formattedInputs += ` ${USER_RANGE}=${datatable.range} ${USER_DATA_TABLE}=${datatable.values}`;
  }

  if (formula) {
    formattedInputs += ` ${FORMULA_BLOCK}${formula}`;
  }

  return formattedInputs;
}

function formatUserPromptForAPI(prompt: string) {
  let newPrompt = prompt;

  newPrompt = newPrompt.replace(FORMULA_BLOCK, 'formula: ');
  newPrompt = newPrompt.replace(USER_RANGE, 'range: ');
  newPrompt = newPrompt.replace(USER_DATA_TABLE, 'data table: ');

  return newPrompt;
}
