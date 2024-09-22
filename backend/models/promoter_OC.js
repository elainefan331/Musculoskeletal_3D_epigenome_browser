import mongoose from "mongoose";
const { Schema } = mongoose;

const promoter_OCSchema = new Schema({
    HiC_Distal_bin: {type: String, index: true},
    Gene: {type: String, index: true},
}, {
    collection: 'promoter_OC'
});

const Promoter_OC = mongoose.model('Promoter_OC', promoter_OCSchema);

export default Promoter_OC;