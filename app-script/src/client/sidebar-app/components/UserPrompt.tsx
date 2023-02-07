// NPM
import React, { useState, useRef } from 'react';
import {
  Cross1Icon,
  Cross2Icon,
  DotsVerticalIcon,
} from '@radix-ui/react-icons';
// UTILS
import { serverFunctions } from '../../utils/serverFunctions';
// TYPES
import { ChatActions } from '../Chat';
import { ValueRangeObj } from '../types';
// HOOKS
import useAutosizeTextArea from '../hooks/useAutosizeTextArea';
import useOnClickOutside from '../hooks/useOnClickOutside';
// COMPONENTS
import Icon from './Icon';
import LoadingEllipsis from './LoadingEllipsis';

import './UserPrompt.style.css';
import DataTable from './DataTable';

interface ChatInputProps {
  shouldDisableTextarea: boolean;
  dispatch: (value: ChatActions) => void;
}

const UserPrompt = (props: ChatInputProps) => {
  const { shouldDisableTextarea, dispatch } = props;

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

  async function handleSubmit() {
    if (!input) return;
    dispatch({
      type: 'ADD_USER_PROMPT',
      // TODO: format data table and formula
      payload: 'hello world',
    });

    // scroll to bottom of chat container after user's prompt is added
    setTimeout(() => {
      //   handleScrollToChatBottom();
    });
    // TODO: call API here

    // ONLY FOR TESTING
    setTimeout(() => {
      dispatch({
        type: 'ADD_GPT_COMPLETION_SUCCESS',
        payload: {
          choices: [
            { finish_reason: 'success', index: 0, text: 'some response' },
          ],
          id: `${Math.random()}`,
          model: 'DEVELOPMENT_MODEL',
          object: 'DEVELOPMENT_OBJECT',
        },
      });
      // scroll to bottom of chat container after completion is added
      setTimeout(() => {
        // handleScrollToChatBottom();
      });
    }, 500);

    // re-initialize input state
    setInput('');
    setDataTable('');
    setFormula('');
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

  return (
    <div className="prompt-wrapper">
      <div>
        <textarea
          rows={1}
          ref={textAreaRef}
          value={input}
          aria-label="user-prompt"
          onKeyDown={handleInputKeyDown}
          onChange={ønChangeHandler}
          disabled={shouldDisableTextarea}
        />
        <div
          className="prompt-menu-wrapper"
          onClick={() => setIsMenuOpen(true)}
        >
          {/* menu "icon" to open popup*/}
          <div className="prompt-menu">
            <DotsVerticalIcon />
          </div>
        </div>
        {isMenuOpen && (
          <div ref={propMenuWrapperRef} className="prompt-options-menu">
            {isAppsheetFetching ? (
              <div className="prompt-options-menu-loader">
                <LoadingEllipsis />
              </div>
            ) : (
              <>
                <div onClick={getSelectedFormulaHandler}>
                  <Icon pathName="ARROW_RIGHT_ON_RECT" width={18} height={18} />
                  <p>Insert selected formula</p>
                </div>
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
              </>
            )}
          </div>
        )}
      </div>
      {/* <div className="prompt-submit" onClick={handleSubmit} /> */}
      {dataTable && (
        <div className="attachment-wrapper">
          <button
            aria-label="remove data table"
            type="button"
            onClick={removeDataTable}
          >
            <Cross1Icon />
          </button>
          <DataTable />
        </div>
      )}
    </div>
  );
};

export default UserPrompt;
