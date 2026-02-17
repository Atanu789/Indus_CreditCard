import mongoose, { Document, Schema } from 'mongoose';

export type ServiceType = 'RewardsRedeem' | 'CardProtection';
export type RequestStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface IServiceRequest extends Document {
  userId: mongoose.Types.ObjectId;
  serviceType: ServiceType;
  cardName: string;
  referenceId: string;
  fullName: string;
  mobileNumber: string;
  dob: string;
  email: string;
  city: string;
  cardHolderName: string;
  cardTotalLimit: string;
  simLabel: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

function generateReferenceId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'IND';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const serviceRequestSchema = new Schema<IServiceRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceType: {
      type: String,
      enum: ['RewardsRedeem', 'CardProtection'],
      required: [true, 'Service type is required'],
    },
    cardName: {
      type: String,
      required: [true, 'Card name is required'],
      trim: true,
    },
    referenceId: {
      type: String,
      unique: true,
      default: generateReferenceId,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    dob: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    cardHolderName: { type: String, required: true },
    cardTotalLimit: { type: String, required: true },
    simLabel: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'rejected'],
      default: 'processing',
    },
  },
  {
    timestamps: true,
  },
);

serviceRequestSchema.index({ userId: 1 });
serviceRequestSchema.index({ mobileNumber: 1 });

export default mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);
