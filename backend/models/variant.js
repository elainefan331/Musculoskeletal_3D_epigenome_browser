import mongoose from "mongoose";
const { Schema } = mongoose;

const variantSchema = new Schema({}, {
    collection: 'variant'
    // collection: 'SNP'
});

const VariantModel = mongoose.model('Variant', variantSchema);
// const variantModel = mongoose.model('SNP', variantSchema);


export default VariantModel;