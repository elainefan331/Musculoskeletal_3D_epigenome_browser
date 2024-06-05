import mongoose from "mongoose";
const { Schema } = mongoose;

const promoter_hMSCSchema = new Schema({}, {
    collection: 'promoter_hMSC'
});

const Promoter_hMSC = mongoose.model('Promoter_hMSC', promoter_hMSCSchema);

export default Promoter_hMSC;