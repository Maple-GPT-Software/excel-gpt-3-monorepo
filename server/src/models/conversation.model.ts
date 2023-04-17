import { Schema, model, ObjectId, Types } from 'mongoose';

import { DConversation, IClientSource } from '../types';

export type DConversationObject = DConversation & {
  _id: Types.ObjectId;
};

const conversationSchema = new Schema<DConversation>(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    systemPrompt: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: Object.values(IClientSource),
    },
  },
  { timestamps: true }
);

conversationSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.id = obj._id;

  delete obj._id;
  delete obj.__v;
  delete obj.systemPrompt;
  delete obj.source;

  return obj;
};

export const Conversation = model<DConversation>('Conversation', conversationSchema);
