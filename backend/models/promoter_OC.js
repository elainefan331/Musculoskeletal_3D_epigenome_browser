import mongoose from "mongoose";
const { Schema } = mongoose;

const promoter_OCSchema = new Schema({}, {
    collection: 'promoter_OC'
});

const Promoter_OC = mongoose.model('Promoter_OC', promoter_OCSchema);

export default Promoter_OC;