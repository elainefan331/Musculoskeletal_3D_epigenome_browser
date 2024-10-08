import mongoose from "mongoose";
const { Schema } = mongoose;

const promoter_hMSCSchema = new Schema({
    HiC_Distal_bin: {type: String, index: true},
    Gene: {type: String, index: true},
}, {
    collection: 'promoter_hMSC'
});

const Promoter_hMSC = mongoose.model('Promoter_hMSC', promoter_hMSCSchema);

export default Promoter_hMSC;