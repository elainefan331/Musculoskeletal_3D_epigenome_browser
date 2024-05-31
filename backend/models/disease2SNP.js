import mongoose from "mongoose";
const { Schema } = mongoose;

const disease2SNPSchema = new Schema({}, {
    collection: 'disease2snps'
});

const Disease2SNPModel = mongoose.model('Disease2SNP', disease2SNPSchema);

export default Disease2SNPModel;