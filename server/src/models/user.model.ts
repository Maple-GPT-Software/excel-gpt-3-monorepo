import { Model, Schema, model } from 'mongoose';
import validator from 'validator';

// import { toJSON } from './plugins';

/**
 * Base user type
 */
export interface UserType {
  userId: string;
  email: string;
  name: string;
  signUpSource: string;
  referrer: string;
  dailyRequests: number;
}

/**
 * Extending moongose Model to add statics
 * https://mongoosejs.com/docs/typescript/statics.html
 */
interface UserModel extends Model<UserType> {
  isEmailTaken: (k: string) => Promise<boolean>;
}

const userSchema = new Schema<UserType, UserModel>(
  {
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
      unique: false,
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
    },
  },
  {
    timestamps: true,
  }
);

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
