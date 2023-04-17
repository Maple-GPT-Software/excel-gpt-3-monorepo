import { Model, Types, Schema, model } from 'mongoose';

import { DMessage, DMessageRating, IClientSource, DMessageBase, DAsssistantMessage, DMessageAuthor } from '../types';

export type DUserMessageObject = DMessageBase & {
  _id: Types.ObjectId;
};

export type DAssistantMessageObject = DAsssistantMessage & {
  _id: Types.ObjectId;
};

/**
 * Extending moongose Model to add statics
 * https://mongoosejs.com/docs/typescript/statics.html
 */
interface MessageModel extends Model<DMessage> {
  canRateMessage: (messageId: string, userId: string) => Promise<boolean>;
  isMessageUnrated: (messageId: string) => Promise<boolean>;
}

const messageSchema = new Schema<DMessage, MessageModel>(
  {
    conversationId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      enum: Object.values(DMessageAuthor),
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    promptTokens: {
      type: Number,
      required: false,
      default: 0,
    },
    completionTokens: {
      type: Number,
      required: false,
      default: 0,
    },
    totalTokens: {
      type: Number,
      required: false,
      default: 0,
    },
    model: {
      type: String,
      /** its better to leave out enum check for now because openai is rapidly iterating and we might get a random bug if they return a different model name */
      // enum: [...Object.values(OpenAiModels)],
      required: false,
      default: '',
    },
    rating: {
      type: String,
      enum: [...Object.values(DMessageRating), ''],
      default: '',
    },
    source: {
      type: String,
      enum: Object.values(IClientSource),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/** Remove properties before Document is sent to client */
messageSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.id = obj._id;
  // preserve special characters such as "\n" so that clients can split up
  // completion and render formulas appropriately
  obj.content = encodeURI(obj.content);

  delete obj._id;
  delete obj.__v;
  delete obj._doc;
  delete obj.prompt;
  delete obj.promptTokens;
  delete obj.completionTokens;
  delete obj.totalTokens;
  delete obj.model;
  delete obj.source;

  return obj;
};

/**
 * Check if the user can rate the message based on their userId
 * @param {string} id - the message's id
 * @param {string} userId - the user's id
 */
messageSchema.statics.canRateMessage = async function (id: string, userId: string) {
  const message = await this.findById(id);

  return userId === message?.userId;
};

/**
 * Check if the user can rate the message based on their userId
 * @param {string} id - the message's id
 */
messageSchema.statics.isMessageUnrated = async function (id: string) {
  const message = await this.findById(id);
  return !message?.rating;
};

export const Message = model<DMessage, MessageModel>('Message', messageSchema);
