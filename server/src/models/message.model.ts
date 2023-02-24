import { Model, Schema, model } from 'mongoose';
import validator from 'validator';

/**
 * completion type
 */
export interface MessageType {
  /** the user that created this message */
  userId: string;
  prompt: string;
  completion: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  rating?: string;
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
    rating: {
      type: String,
      enum: ['LIKE', 'DISLIKE', 'N/A'],
      default: 'N/A',
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
  delete obj.prompt;
  delete obj.tok;
  delete obj.promptTokens;
  delete obj.completionTokens;
  delete obj.totalTokens;
  return obj;
};

/**
 * Check if the user can rate the message based on their userId
 * @param {string} messageId - the message's id
 * @param {string} userId - the user's id
 */
messageSchema.statics.canRateMessage = async function (messageId: string, userId: string) {
  const message = await this.findById(messageId);
  console.log(messageId, userId);
  return userId === message?.userId;
};

/**
 * Check if the user can rate the message based on their userId
 * @param {string} messageId - the message's id
 */
messageSchema.statics.isMessageUnrated = async function (messageId: string) {
  const message = await this.findById(messageId);
  return message?.rating === 'N/A';
};

export const Message = model<MessageType, MessageModel>('Message', messageSchema);
