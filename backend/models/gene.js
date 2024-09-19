import mongoose from "mongoose";
const { Schema } = mongoose;

const geneSchema = new Schema({
    Gene_Name: {type: String, index: true}
}, {
    collection: 'gene'
});

const geneModel = mongoose.model('Gene', geneSchema);

export default geneModel;