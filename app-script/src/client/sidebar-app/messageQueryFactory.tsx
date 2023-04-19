const messageKeyFactory = {
  messagesById: (conversationId: string) =>
    ['messages', conversationId] as const,
};

export default messageKeyFactory;
