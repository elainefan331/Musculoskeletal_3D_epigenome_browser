import mongoose from "mongoose";
const { Schema } = mongoose;

const promoter_MBSchema = new Schema(
  {
    HiC_Distal_bin: { type: String, index: true },
    Gene: { type: String, index: true },
  },
  {
    collection: "promoter_MB",
  }
);

const Promoter_MB = mongoose.model("Promoter_MB", promoter_MBSchema);

export default Promoter_MB;
