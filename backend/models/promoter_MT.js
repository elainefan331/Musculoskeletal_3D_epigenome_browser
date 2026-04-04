import mongoose from "mongoose";
const { Schema } = mongoose;

const promoter_MTSchema = new Schema(
  {
    HiC_Distal_bin: { type: String, index: true },
    Gene: { type: String, index: true },
  },
  {
    collection: "promoter_MT",
  }
);

const Promoter_MT = mongoose.model("Promoter_MT", promoter_MTSchema);

export default Promoter_MT;
