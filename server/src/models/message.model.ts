import { OpenAiModels } from '@src/config/openai';
import { Model, Schema, model } from 'mongoose';

export enum CompletionRating {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export interface MessageType {
  /** the user that created this message */
  userId: string;
  prompt: string;
  completion: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
  rating?: CompletionRating | '';
}

/**
 * Extending moongose Model to add statics
 * https://mongoosejs.com/docs/typescript/statics.html
 */
interface MessageModel extends Model<MessageType> {
  canRateMessage: (messageId: string, userId: string) => Promise<boolean>;
  isMessageUnrated: (messageId: string) => Promise<boolean>;
}

const messageSchema = new Schema<MessageType, MessageModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    completion: {
      type: String,
      required: true,
    },
    promptTokens: {
      type: Number,
      required: true,
    },
    completionTokens: {
      type: Number,
      required: true,
    },
    totalTokens: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      /** its better to leave out this check for now because openai is rapidly iterating and we might get a random bug if they return a different model name */
      // enum: [...Object.values(OpenAiModels)],
      required: true,
    },
    rating: {
      type: String,
      enum: [...Object.values(CompletionRating), ''],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

/** Remove properties before Document is sent to client */
messageSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.id = obj._id.toString();

  delete obj._id;
  delete obj.__v;
  delete obj._doc;
  delete obj.prompt;
  delete obj.promptTokens;
  delete obj.completionTokens;
  delete obj.totalTokens;
  delete obj.model;
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

export const Message = model<MessageType, MessageModel>('Message', messageSchema);
