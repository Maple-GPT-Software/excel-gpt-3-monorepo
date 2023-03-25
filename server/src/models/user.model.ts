import { Model, Schema, model, Document } from 'mongoose';
import validator from 'validator';
import Stripe from 'stripe';

// TODO: improve typings. There's a basic UserType and an IUserType
// the IUserType will have stripeCustomerId, stripeCurrentPeriodEnd, stripeStatus as required
// optional properties will have a default defined in the schema
/** base user type */
export interface UserType {
  /** corresponds to uid from firebase auth */
  // TODO: refactor this to be firebaseUUID
  userId: string;
  email: string;
  name: string;
  /** e.g, Concordia */
  referrer: string;
  /** terms and conditions and the version the user has accepted */
  hasAcceptedTerms: boolean;
  acceptedTermsVersion: number;
  /**
   * We don't have to keep all the metadata associated with a subscription because Stripe's client facing SDK has no rate limiting. Server side API however has a limit of 100 reads/min.
   */
  /** stripe customer id associated with user's email */
  stripeCustomerId?: string;
  /**
   * IMPORTANT: this is updated once when the user's payment has succeeded
   * the payment id associated with lifetime access purchase. Empty string by default
   * */
  stripeLifetimeAccessPaymentId?: string;
  /** the end of the bill cycle of the user's subscription */
  stripeCurrentPeriodEnd?: number;
  /**
   * possible statuses: paid, incomplete, trialing, active, past_due, canceled. We don't allow users to pause their subscription.
   */
  stripeStatus?: Stripe.Subscription.Status;
  /** the user's open AI API key */
  openaiApiKey?: string;
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
  referrer: {
    type: String,
    required: false,
    lowercase: true,
  },
  hasAcceptedTerms: {
    type: Boolean,
    required: true,
    lowercase: true,
  },
  acceptedTermsVersion: {
    type: Number,
    required: true,
    lowercase: true,
  },
  openaiApiKey: {
    type: String,
    required: false,
    default: '',
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
});

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

export const User = model<UserType, UserModel>('User', userSchema);
