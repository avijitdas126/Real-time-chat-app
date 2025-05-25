import mongoose, { Schema, Model } from 'mongoose'
import { active_user, Conversion, Message, User } from '../../../type'
import {v4 as uuidv4} from 'uuid'
const UserSchema = new Schema<User>(
    {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
        phone_no: { type: String },
        email: { type: String, required: true },
        id: { type: String, required: true },
        bio: { type: String }

    }
)

export const Users = mongoose.model('User', UserSchema);

const ConversionSchema = new Schema<Conversion>(
    {
        isGroup: { type: Boolean, required: true },
        users: { type: [String], required: true },
        icon: { type: String, required: true },
        id: { type: String, required: true ,default:uuidv4()},
        user_id: { type: String, required: true },
        conversionId: { type: String, required: true },
        unread_Msg: { type: Number, required: true, default: 0 }
    }
)

export const Conversions = mongoose.model('Conversion', ConversionSchema);

const MessageSchema = new Schema<Message>(
    {
        from: { type: String, required: true },
        to: { type: [String], required: true },
        id: { type: String, required: true ,default:uuidv4()},
        user_id: { type: String, required: true },
        reply_ID: { type: String},
        message: { type: String, required: true },
        time: { type: Date, required: true, default: Date.now() },
        attachment: { type: String }

    }
)

export const Messages = mongoose.model('Message', MessageSchema);


const active_userSchema = new Schema<active_user>(
    {
        id: { type: String, required: true },
        socket_id: { type: String, required: true }
    })

export const Active_Users: Model<active_user> =
    mongoose.models.Active_User || mongoose.model<active_user>('Active_User', active_userSchema);

