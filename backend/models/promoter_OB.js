import mongoose from "mongoose";
const { Schema } = mongoose;

const promoter_OBSchema = new Schema({}, {
    collection: 'promoter_OB'
});

const Promoter_OB = mongoose.model('Promoter_OB', promoter_OBSchema);

export default Promoter_OB;