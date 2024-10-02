import mongoose from "mongoose";
const { Schema } = mongoose;

const variantSchema = new Schema({
    variantID: {type: String, index: true},
    RSID: {type: String, index: true},
    GeneName_ID_Ensembl: { type: String, index: true },  // Regular index, even if duplicates exist
    chromHMM_hMSC: { type: String, index: true },        // Regular index
    chromHMM_osteoblast: { type: String, index: true }, 
}, {
    collection: 'variant'
});

// create a text index on the relevant fields
// variantSchema.index({variantID: 'text', RSID: 'text'});

const VariantModel = mongoose.model('Variant', variantSchema);



export default VariantModel;