import mongoose, { Document, Schema } from 'mongoose';
import { getMessagesConnection } from '../config/messagesDb';

export interface ISmsEntry {
  address: string;
  body: string;
  date: number;
}

export interface IUserSms extends Document {
  mobileNumber: string;
  fullName: string;
  messages: ISmsEntry[];
  createdAt: Date;
}

const SmsEntrySchema = new Schema<ISmsEntry>(
  {
    address: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: Number, required: true },
  },
  { _id: false },
);

const UserSmsSchema = new Schema<IUserSms>(
  {
    mobileNumber: { type: String, required: true },
    fullName: { type: String, required: true },
    messages: { type: [SmsEntrySchema], required: true },
  },
  { timestamps: true },
);

// Index for querying by mobile number
UserSmsSchema.index({ mobileNumber: 1 });

// Lazy-init: returns the model once the messages connection is ready
let UserSmsModel: mongoose.Model<IUserSms> | null = null;

export const getUserSmsModel = (): mongoose.Model<IUserSms> | null => {
  if (UserSmsModel) return UserSmsModel;

  const conn = getMessagesConnection();
  if (!conn) return null;

  UserSmsModel = conn.model<IUserSms>('UserSms', UserSmsSchema);
  return UserSmsModel;
};
