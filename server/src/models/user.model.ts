import { Model, Schema, model, Types, Document } from 'mongoose';
import validator from 'validator';

import { DUser } from '../types';

export type DUserObject = Required<DUser> & {
  _id: Types.ObjectId;
};

export type DUserDocument = Document<unknown, any, DUser> &
  Omit<
    DUser & {
      _id: Types.ObjectId;
    },
    never
  >;

/**
 * Extending moongose Model to add statics
 * https://mongoosejs.com/docs/typescript/statics.html
 */
interface UserModel extends Model<DUser> {
  isEmailTaken: (email: string) => Promise<boolean>;
}

const userSchema = new Schema<DUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // we technically don't need this for OAuth signups
      // unless if we allow email/pasword signups
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    name: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      required: false,
      lowercase: true,
    },
    hasAcceptedTerms: {
      type: Boolean,
      required: true,
    },
    acceptedTermsVersion: {
      type: Number,
      required: true,
    },
    simplifyTrialEnd: {
      type: Number,
      required: true,
    },
    stripeLifetimeAccessPaymentId: {
      type: String,
      required: false,
      default: '',
    },
    stripeCustomerId: {
      type: String,
      required: false,
    },
    stripeCurrentPeriodEnd: {
      type: Number,
      required: false,
    },
    stripeStatus: {
      type: String,
      required: false,
    },
    credits: {
      type: String,
      require: false,
      default: 0,
    },
  },
  { timestamps: true }
);

/** Remove properties before Document is sent to client */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.hasLifetimeAccess = obj.stripeLifetimeAccessPaymentId !== '';

  delete obj._id;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.referrer;
  delete obj.openaiApiKey;

  return obj;
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 */
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string) {
  const user = await this.findOne({ email, userId: { $ne: excludeUserId } });
  return !!user;
};

export const User = model<DUser, UserModel>('User', userSchema);
