import mongoose from "mongoose";
const { Schema } = mongoose;

// const api_categorySchema = new Schema({
//     name: {type: String, index: true},
// }, {
//     collection:'api_category'
// });
const api_categorySchema = new Schema({
    name: { type: String, index: true, text: true },
}, {
    collection: 'api_category'
});
api_categorySchema.index({ name: 'text' });
const Api_category = mongoose.model('Api_category', api_categorySchema);

export default Api_category;