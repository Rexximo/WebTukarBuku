import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

export const USER_ROLES = ["admin", "anggota"] as const;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, default: "anggota" },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User> & {
  createdAt: Date;
  updatedAt: Date;
};

export const UserModel = model("User", userSchema);
