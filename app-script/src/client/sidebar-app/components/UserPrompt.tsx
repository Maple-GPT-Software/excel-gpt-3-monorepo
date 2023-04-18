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
  CSV,
  USER_RANGE,
  FORMULA,
  MAXIMUM_ALLOWED_CHARACTERS,
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
  const [formula, setFormula] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // this flag is true when either of the two chat menu options are clicked to show
  // a loading state for the API call
  const [isAppsheetFetching, setIsAppsheetFetching] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const propMenuWrapperRef = useRef<HTMLDivElement>(null);

  useAutosizeTextArea(textAreaRef?.current, input);
  useOnClickOutside(propMenuWrapperRef, () => setIsMenuOpen(false));

  const totalInputCharacters = calculateUserInputLength(
    input,
    dataTable,
    formula
  );

  const inputExceedsMaximum = totalInputCharacters > MAXIMUM_ALLOWED_CHARACTERS;

  async function handleSubmit() {
    /** 5 is a minimum enforced by backend */
    // if (!input || inputExceedsMaximum || totalInputCharacters < 5) return;
    if (!input || inputExceedsMaximum) return;

    const clientUserPrompt = formatUserInputs(input, dataTable, formula);

    // re-initialize input state
    setInput('');
    setDataTable('');
    setFormula('');

    dispatch({
      type: ChatReducerActionTypes.ADD_USER_PROMPT,
      // TODO: format data table and formula
      payload: {
        id: Math.random().toString(),
        content: clientUserPrompt,
        author: 'user',
      },
    });

    // scroll to bottom of chat container after user's prompt is added
    // wrapped in setTimeout so that immer dispatch updates chat first
    setTimeout(() => {
      scrollToBottomOfChat();
    });

    try {
      // replace range with USER_RANGE so we can easily figure out if the user
      // added a data table via the prompt enhacements feature
      const completion = await SimplifyApi(accessToken).getCompletion(
        clientUserPrompt.replaceAll('%', '')
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
      setTimeout(() => {
        scrollToBottomOfChat();
      });
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
          placeholder="I want a formula that..."
        />
        {/* {!(dataTable && formula) && ( */}
        {/* // menu "icon" to open popup */}
        <button
          aria-label="Open message attachments menu"
          className="button-round attachment-button"
          onClick={() => setIsMenuOpen(true)}
        >
          +
        </button>
        {/* )} */}
        {/* CHARACTER LIMIT COUNTER */}
        <p
          className="character-count"
          style={{
            backgroundColor: inputExceedsMaximum ? '#ef4444' : '#22c55e',
          }}
        >{`${totalInputCharacters}/400`}</p>
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
                  <button
                    className="prompt-options-menu-button"
                    onClick={getSelectedFormulaHandler}
                  >
                    <Icon
                      pathName="ARROW_RIGHT_ON_RECT"
                      width={18}
                      height={18}
                    />
                    <p>Insert selected formula</p>
                  </button>
                )}
                {!dataTable && (
                  <button
                    className="prompt-options-menu-button"
                    onClick={getSelectedRangeValuesHandler}
                  >
                    <Icon
                      pathName="ARROW_RIGHT_ON_RECT"
                      width={18}
                      height={18}
                    />
                    <p>Insert selected values</p>
                  </button>
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

function formatUserInputs(
  input: string,
  datatable: ValueRangeObj | '',
  formula: string
) {
  let formattedInputs = input + `\n`;

  if (datatable) {
    formattedInputs += `${USER_RANGE}=${datatable.range} ${CSV}${datatable.values}\n`;
  }

  if (formula) {
    formattedInputs += `${FORMULA}${formula}`;
  }

  return formattedInputs;
}

function calculateUserInputLength(
  input: string,
  dataTable: ValueRangeObj | '',
  formula: string
) {
  let totalLength = input.length + formula.length;

  if (typeof dataTable === 'object') {
    totalLength += dataTable.range.length + dataTable.values.length;
  }

  return totalLength;
}
