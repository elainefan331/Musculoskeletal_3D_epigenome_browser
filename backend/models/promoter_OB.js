import mongoose from "mongoose";
const { Schema } = mongoose;

const promoter_OBSchema = new Schema({
    HiC_Distal_bin: {type: String, index: true},
}, {
    collection: 'promoter_OB'
});

const Promoter_OB = mongoose.model('Promoter_OB', promoter_OBSchema);

export default Promoter_OB;