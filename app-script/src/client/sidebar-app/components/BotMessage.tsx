import React, { Dispatch } from 'react';
import CodeBlockMessage from './CodeBlockMessage';
import { CompletionRating, GPTCompletion } from '../types';
import LoadingEllipsis from './LoadingEllipsis';
import Icon from './Icon';
import { ChatActions, ChatReducerActionTypes } from '../Chat';

import './BotMessage.style.css';
import { useAuthContext } from '../AuthProvider';
import SimplifyApi from '../api/SimplifyApi';

interface BotMessageProps {
  completion: GPTCompletion;
  dispatch: Dispatch<ChatActions>;
  requestStatus: 'FETCHING' | 'SUCCESS' | 'FAIL';
}

function BotMessage({ completion, dispatch, requestStatus }: BotMessageProps) {
  const { content, id, rating, status } = completion;

  if (!content) {
    return (
      <div className="bot-message-wrapper">
        <LoadingEllipsis />
      </div>
    );
  }

  if (status === 'fail') {
    return (
      <div className="bot-message-wrapper">
        <p style={{ color: '#dc2626' }}>{content}</p>
      </div>
    );
  }

  const messageParts = content.split('\n');

  return (
    <div className="bot-message-wrapper">
      {messageParts.map((content, index) => {
        if (content.startsWith('=')) {
          return (
            <>
              <CodeBlockMessage formula={content} key={index} />
              <br />
            </>
          );
        } else if (!content) {
          return null;
        } else {
          return (
            <>
              <p
                key={index}
                dangerouslySetInnerHTML={{
                  __html: content.replace(/\n/g, '<br>'),
                }}
                style={{ wordBreak: 'break-word' }}
              ></p>
              <br />
            </>
          );
        }
      })}

      <RateCompletion id={id} rating={rating} dispatch={dispatch} />
    </div>
  );
}

export default BotMessage;

// ======================= RATE COMPLETION

interface RateCompletionFormProps {
  /** id of the completion being rated */
  id: string;
  rating: CompletionRating | '';
  dispatch: React.Dispatch<ChatActions>;
}

/**
 * This component renders two icons (like and dislike). When the icons are clicked
 * an API call is made to mutate the `rating` property on the completion document
 * we optimistcally update and undo if API call fails
 */
const RateCompletion: React.FC<RateCompletionFormProps> = (props) => {
  const { id, rating, dispatch } = props;
  const { accessToken } = useAuthContext();

  async function iconClickHandler(newRating: CompletionRating) {
    dispatch({
      type: ChatReducerActionTypes.RATE_COMPLETION_OPTIMISTIC,
      payload: { id, rating: newRating },
    });

    try {
      await SimplifyApi(accessToken).rateMessage(id, newRating);
    } catch (error) {
      dispatch({
        type: ChatReducerActionTypes.RATE_COMPLETION_FAILED,
        payload: id,
      });
    }
  }

  if (rating) {
    return (
      <div className="like-dislike-container" style={{ alignItems: 'center' }}>
        <p>Thank you! </p>
        <Icon
          pathName={`${rating === 'LIKE' ? 'THUMB_UP' : 'THUMB_DOWN'}`}
          styles={{ cursor: 'not-allowed' }}
          width={16}
          height={16}
        />
      </div>
    );
  }

  return (
    <>
      <div className="like-dislike-container">
        <div>
          <Icon
            pathName="THUMB_UP"
            width={16}
            height={16}
            onClick={() => iconClickHandler(CompletionRating.LIKE)}
          />
          <Icon
            pathName="THUMB_DOWN"
            width={16}
            height={16}
            onClick={() => iconClickHandler(CompletionRating.DISLIKE)}
          />
        </div>
      </div>
    </>
  );
};
