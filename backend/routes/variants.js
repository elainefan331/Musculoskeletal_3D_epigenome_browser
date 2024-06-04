import express from "express";
import VariantModel from "../models/variant.js";

const router = express.Router();

router.get("/:id", async(req, res) => {
    const id = req.params.id;
    const { celltype } = req.query;
    console.log("received celltype query parameter", req.query)
    console.log("celltype", celltype); 
    let variantQuery = {};

    if(id.startsWith("rs")) {
        variantQuery = {"RSID": id}
    } else {
        variantQuery = {"variantID": id}
    }

    try {
        const variant = await VariantModel.find(variantQuery)
        if (variant) {
            return res.status(200).json(variant);
        } else {
            return res.status(404).send("Variant not found");
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server error");
    }
});



export default router;

