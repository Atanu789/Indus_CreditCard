import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  mobileNumber: string;
  dob: string;
  email: string;
  city: string;
  cardHolderName: string;
  cardTotalLimit: string;
  simLabel: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      minlength: [10, 'Mobile number must be at least 10 digits'],
    },
    dob: {
      type: String,
      required: [true, 'Date of birth is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    cardHolderName: {
      type: String,
      required: [true, 'Card holder name is required'],
      trim: true,
    },
    cardTotalLimit: {
      type: String,
      required: [true, 'Card total limit is required'],
      trim: true,
    },
    simLabel: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ mobileNumber: 1 });
userSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', userSchema);
