import mongoose, { Document, Model, Types } from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export interface IComment extends Document {
  challenge: Types.ObjectId;
  content: string;
  creator: Types.ObjectId;
}

const CommentModel: Model<IComment> = mongoose.model("Comment", commentSchema);

export default CommentModel;
