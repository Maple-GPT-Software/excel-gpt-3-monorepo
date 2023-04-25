import React, { useState } from 'react';
import SimplifyApi, {
  DConversation,
  DConversationPromptType,
} from '../../api/SimplifyApi';
import { CenteredLoadingEllipsis } from '../LoadingEllipsis';
import useSWRMutation from 'swr/mutation';

import './ConversationForm.style.css';
import conversationKeyFactory from './conversationQueryKeys';

interface ConversationSettings {
  name: string;
  promptType: DConversationPromptType;
  temperature: number;
}

const SYSTEM_PROMPT_OPTIONS: {
  label: string;
  value: DConversationPromptType;
}[] = [
  {
    label: 'Google Sheet',
    value: DConversationPromptType.googleSheetChat,
  },
  {
    label: 'Google App Script',
    value: DConversationPromptType.googleAppScriptChat,
  },
  {
    label: 'General',
    value: DConversationPromptType.generalAiChat,
  },
];

interface EditConversationProps {
  backToMenuDefaultMode: () => void;
  conversation: DConversation;
  accessToken: string;
  conversations: DConversation[] | undefined;
}

function editConversationFetcher(
  key: readonly ['conversations'],
  {
    arg,
  }: {
    arg: {
      accessToken: string;
      id: string;
      updatedSettings: Omit<ConversationSettings, 'promptType'>;
    };
  }
) {
  return SimplifyApi(arg.accessToken).editConversation(
    arg.id,
    arg.updatedSettings
  );
}

function EditConversationForm({
  backToMenuDefaultMode,
  conversation,
  conversations,
  accessToken,
}: EditConversationProps) {
  const { trigger, isMutating, error } = useSWRMutation(
    conversationKeyFactory.all,
    editConversationFetcher,
    {
      onSuccess: () => {
        backToMenuDefaultMode();
      },
      populateCache: (updatedConversation) => {
        return conversations?.map((conversation) => {
          if (conversation.id === updatedConversation.id) {
            return updatedConversation;
          }
          return conversation;
        });
      },
      revalidate: false,
    }
  );

  const [settings, setSettings] = useState<ConversationSettings>(() => {
    const { name, promptType, temperature } = conversation;

    return {
      name,
      promptType,
      temperature,
    };
  });

  function onChangeByProp(prop: keyof ConversationSettings, value: any) {
    setSettings((prevSettings) => ({ ...prevSettings, [prop]: value }));
  }

  function onSubmitHandler() {
    const updatedSettings = {
      name: settings.name,
      temperature: settings.temperature,
    };
    trigger({ accessToken, id: conversation.id, updatedSettings });
  }

  if (isMutating) {
    return (
      <CenteredLoadingEllipsis darkMode={true}>
        <p style={{ color: 'white' }}> creating new converation</p>
      </CenteredLoadingEllipsis>
    );
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <ConversationFormFields
        isEditing={true}
        onChangeByProp={onChangeByProp}
        settings={settings}
      />
      <button
        style={{ marginTop: '24px' }}
        className="button button-outline"
        type="submit"
      >
        UPDATE CONVERSATION SETTINGS
      </button>
      {error && (
        <p style={{ marginTop: '6px', fontSize: '12px', color: '#dc2626' }}>
          {error.message}. Please try again.
        </p>
      )}
    </form>
  );
}

type EditConversationFormWrapper = {
  backToMenuDefaultMode: () => void;
  conversationId: string | undefined;
  conversations: DConversation[] | undefined;
  accessToken: string;
};

export function EditConversationFormWrapper({
  conversationId,
  conversations,
  ...props
}: EditConversationFormWrapper) {
  const targetConversation = conversations?.find(
    (conversation) => conversation.id === conversationId
  );

  if (!targetConversation) {
    return <p>Unable to find the conversation you want to edit </p>;
  }

  return (
    <EditConversationForm
      {...props}
      conversations={conversations}
      conversation={targetConversation}
    />
  );
}

export function CreateConversationForm({
  accessToken,
  createNewConversationSuccessCb,
  conversations,
}: {
  accessToken: string;
  createNewConversationSuccessCb: (id: string) => void;
  conversations: DConversation[] | undefined;
}) {
  const { trigger, isMutating } = useSWRMutation(
    conversationKeyFactory.all,
    (
      key,
      { arg }: { arg: { accessToken: string; settings: ConversationSettings } }
    ) => SimplifyApi(arg.accessToken).createNewConversation(arg.settings),
    {
      onSuccess: (newConversation) => {
        createNewConversationSuccessCb(newConversation.id);
      },
    }
  );

  const [settings, setSettings] = useState<ConversationSettings>(() => {
    return {
      name: 'new conversation',
      promptType: DConversationPromptType.googleSheetChat,
      temperature: 0.4,
    };
  });

  function onChangeByProp(prop: keyof ConversationSettings, value: any) {
    setSettings((prevSettings) => ({ ...prevSettings, [prop]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    trigger({ accessToken, settings });
  }

  if (isMutating) {
    return (
      <CenteredLoadingEllipsis darkMode={true}>
        <p style={{ color: 'white' }}> creating new converation</p>
      </CenteredLoadingEllipsis>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <ConversationFormFields
        onChangeByProp={onChangeByProp}
        settings={settings}
      />
      <button
        style={{ marginTop: '24px' }}
        className="button button-outline"
        type="submit"
      >
        CREATE NEW CONVERSATION
      </button>
    </form>
  );
}

function ConversationFormFields({
  settings,
  onChangeByProp,
  isEditing = false,
}: {
  settings: ConversationSettings;
  onChangeByProp: (prop: keyof ConversationSettings, value: any) => void;
  isEditing?: boolean;
}) {
  const { name, promptType, temperature } = settings;

  return (
    <>
      <div className="conversation-form-field-wrapper">
        <label htmlFor="name">Name</label>
        <input
          className="field"
          id="name"
          value={name}
          onChange={(event) => onChangeByProp('name', event.target.value)}
          type="text"
          placeholder="conversation name"
        />
      </div>
      {/* FUTURE: show system prompt */}
      <div className="conversation-form-field-wrapper">
        <label htmlFor="promptType">Assistant Type</label>
        <select
          disabled={isEditing}
          className="field"
          id="promptType"
          value={promptType}
          onChange={(event) => onChangeByProp('promptType', event.target.value)}
        >
          {SYSTEM_PROMPT_OPTIONS.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="conversation-form-field-wrapper">
        <label htmlFor="temperature">
          Temperature -{' '}
          <span>
            {(Math.round(settings.temperature * 100) / 100).toFixed(2)}
          </span>
        </label>
        <p style={{ marginBottom: '6px' }}>
          We suggest using the default value if you are sure!
          <a
            href="https://algowriting.medium.com/gpt-3-temperature-setting-101-41200ff0d0be"
            target="_blank"
          >
            {' '}
            Suggested reading
          </a>
        </p>
        <input
          id="temperature"
          value={temperature}
          onChange={(event) =>
            onChangeByProp('temperature', event.target.value)
          }
          type="range"
          min={0}
          max={1}
          defaultValue={0.4}
          step={0.05}
        />
      </div>
    </>
  );
}
