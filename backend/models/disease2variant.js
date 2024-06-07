import mongoose from "mongoose";
const { Schema } = mongoose;

const disease2variantSchema = new Schema({}, {
    collection: 'disease2variant'
});

const Disease2variant = mongoose.model('Disease2variant', disease2variantSchema);

export default Disease2variant;