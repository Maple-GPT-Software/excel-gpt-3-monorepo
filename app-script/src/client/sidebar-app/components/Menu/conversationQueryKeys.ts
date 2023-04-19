const conversationKeyFactory = {
  all: ['conversations'] as const,
  edit: (id: string) => [conversationKeyFactory.all, id] as const,
};
