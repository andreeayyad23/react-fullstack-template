import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IFamilyMember extends Document {
  username: string;
  fatherName: string;
  motherName: string;
  familyName: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FamilyMemberSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      maxlength: [50, 'Username cannot be more than 50 characters']
    },
    fatherName: {
      type: String,
      required: [true, 'Father name is required'],
      trim: true,
      maxlength: [50, 'Father name cannot be more than 50 characters']
    },
    motherName: {
      type: String,
      required: [true, 'Mother name is required'],
      trim: true,
      maxlength: [50, 'Mother name cannot be more than 50 characters']
    },
    familyName: {
      type: String,
      required: [true, 'Family name is required'],
      trim: true,
      maxlength: [50, 'Family name cannot be more than 50 characters']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const FamilyMember: Model<IFamilyMember> = mongoose.model<IFamilyMember>(
  'FamilyMember',
  FamilyMemberSchema
);

export default FamilyMember;