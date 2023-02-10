import React, { useState, useRef } from 'react';
import CodeBlockMessage from './CodeBlockMessage';
import { GPTCompletion } from '../types.d';
import LoadingEllipsis from './LoadingEllipsis';
import Icon from './Icon';

import './BotMessage.style.css';
import Modal from './Modal';
import { CODE_BLOCK } from '../constants';
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
          <CodeBlockMessage formula={completion?.choices[0].text} />
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

      {/* TODO: conditionally render this based on rating property on completion */}
      <RateCompletion completion={completion} />
    </div>
  );
}

export default BotMessage;

// ======================= RATE COMPLETION

interface RateCompletionFormProps {
  completion: GPTCompletion;
}

type RatingTypes = 'DISLIKE' | 'LIKE';

const MAX_FEEDBACK_CHARACTERS = 280;
/**
 * This componnt renders two icons (like and dislike). When the icons are clicked
 * an API call is made to mutate the `rating` property on the completion document
 * The user is then shown a modal for providing additional feedback (optional)
 */
const RateCompletion: React.FC<RateCompletionFormProps> = (props) => {
  const { completion } = props;

  // TODO: get user from AuthProvider
  // TODO: use immerReducer to coordinate things such as
  // 1. closing modal also resets userInput
  // 2. when rating is sumittted, show loading state, reset textInput etc...
  const [showModal, setShowModal] = useState(false);
  const [ratingType, setRatingType] = useState<RatingTypes | undefined>();
  const [userInput, setUserInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function iconClickHandler(type: RatingTypes) {
    setRatingType(type);
    // TODO: update rating on completion
  }

  function ønChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target?.value;
    if (value.length > MAX_FEEDBACK_CHARACTERS) {
      return;
    }

    setUserInput(value);
  }

  function onPasteHandler(e: any) {
    const value = e.clipboardData.getData('text');

    if (!value) {
      return;
    }

    setUserInput((prevValue) => {
      return (prevValue += value);
    });
  }

  // TODO: After a rating has been submitted don't render the thumb-up and thumb-down

  return (
    <>
      <div className="like-dislike-container">
        <Modal
          open={showModal}
          setOpen={setShowModal}
          title="Feedback"
          trigger={
            <div>
              <Icon
                pathName="THUMB_DOWN"
                width={16}
                height={16}
                onClick={() => iconClickHandler('DISLIKE')}
              />
              <Icon
                pathName="THUMB_UP"
                width={16}
                height={16}
                onClick={() => iconClickHandler('LIKE')}
              />
            </div>
          }
        >
          <textarea
            className="user-feedback"
            rows={10}
            // ref={textareaRef}
            onChange={ønChangeHandler}
            onPaste={onPasteHandler}
            aria-label="user-feedback"
          />
          <p>{`${userInput.length}/${MAX_FEEDBACK_CHARACTERS}`}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="button green"
              disabled={userInput.length > MAX_FEEDBACK_CHARACTERS}
            >
              save
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};
