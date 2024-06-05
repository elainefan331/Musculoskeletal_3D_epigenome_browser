import mongoose from "mongoose";
const { Schema } = mongoose;

const variantSchema = new Schema({
    variantID: {type: String, index: true},
    RSID: {type: String, index: true},
}, {
    collection: 'variant'
});

// create a text index on the relevant fields
// variantSchema.index({variantID: 'text', RSID: 'text'});

const VariantModel = mongoose.model('Variant', variantSchema);



export default VariantModel;