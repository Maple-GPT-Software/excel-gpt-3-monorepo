import { Model, Schema, model, Document } from 'mongoose';
import validator from 'validator';
import Stripe from 'stripe';
/** base user type */
export interface UserType {
  userId: string;
  email: string;
  name: string;
  // TODO: remove this from schema
  signUpSource: string;
  referrer: string;
  dailyRequests?: number;
  /**
   * We don't have to keep all the metadata associated with a subscription because Stripe's client facing SDK has no rate limiting. Server side API however has a limit of 100 reads/min.
   */
  /** stripe customer id associated with user's email */
  stripeCustomerId?: string;
  /** the end of the bill cycle of the user's subscription*/
  stripeCurrentPeriodEnd?: number;
  /**
   * possible statuses: paid, incomplete, trialing, active, past_due, canceled. We don't allow users to pause their subscription.
   */
  stripeStatus?: Stripe.Subscription.Status;
  // TODO: hasAcceptedTerms
  // TODO: acceptedTermsVersion
}

/**
 * Extending moongose Model to add statics
 * https://mongoosejs.com/docs/typescript/statics.html
 */
interface UserModel extends Model<UserType> {
  isEmailTaken: (email: string) => Promise<boolean>;
}

const userSchema = new Schema<UserType, UserModel>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
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
  /** the client app they signed up from */
  signUpSource: {
    type: String,
    required: true,
    lowercase: true,
  },
  /** who referred them */
  referrer: {
    type: String,
    required: false,
    lowercase: true,
  },
  /** used for rate limiting the user */
  dailyRequests: {
    type: Number,
    required: true,
    default: 0,
  },
  stripeCustomerId: {
    type: String,
    required: false,
  },
  stripeCurrentPeriodEnd: {
    type: String,
    required: false,
  },
  stripeStatus: {
    type: String,
    required: false,
  },
});

/** Remove properties before Document is sent to client */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.referrer;
  delete obj.signUpSource;
  delete obj.dailyRequests;
  delete obj.stripeCurrentPeriodEnd;
  delete obj.stripeStatus;
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

export const User = model<UserType, UserModel>('User', userSchema);
