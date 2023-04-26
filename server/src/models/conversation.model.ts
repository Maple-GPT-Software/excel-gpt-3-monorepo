import { Schema, model, ObjectId, Types, Document } from 'mongoose';

import { DConversation, DConversationPromptType, IClientSource } from '../types';

export type DConversationObject = DConversation & {
  _id: Types.ObjectId;
};

export type DConversationDocument = Document<unknown, any, DConversation> &
  Omit<
    DConversation & {
      _id: Types.ObjectId;
    },
    never
  >;

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
    isBookmarked: {
      type: Boolean,
      required: false,
      default: false,
    },
    systemPrompt: {
      type: String,
      required: true,
    },
    promptType: {
      type: String,
      enum: Object.values(DConversationPromptType),
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
