import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    password: string;

    // role
    @Prop({ required: true, enum: ["admin", "seller", "user"], default: 'user' })
    role: string;

    // token
    @Prop({ type: String, default: null })
    resetToken: string | null;

    @Prop({ type: Date, default: null })
    resetTokenExpiration: Date | null;


}

export const UserSchema = SchemaFactory.createForClass(User);