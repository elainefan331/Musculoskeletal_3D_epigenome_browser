import mongoose from "mongoose";
const { Schema } = mongoose;

const gwasLDSchema = new Schema({
    IndexSNP: {type: String, index: true},
}, {
    collection: 'gwasLD'
});

const GwasLD = mongoose.model('GwasLD', gwasLDSchema);

export default GwasLD;

