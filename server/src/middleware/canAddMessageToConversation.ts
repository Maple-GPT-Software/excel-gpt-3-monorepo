import { RequestHandler } from 'express';

/**
 * middleware that checks if the user has access to the conversation. Either to edit/delete the conversation or to add a new message
 * */
export const canAccessConversation: RequestHandler = async (req, res, next) => {
  const { conversationId } = req.params;
  const userId = req.decodedFirebaseToken.uid;

  // https://fjolt.com/article/javascript-get-full-url-in-express

  // TODO: conversation check
  // const conversation = await

  next();
};
