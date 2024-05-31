import express from "express";
import VariantModel from "../models/variant.js";

const router = express.Router();

router.get("/:id", async(req, res) => {
    const id = req.params.id;
    let query = {};

    if(id.startsWith("rs")) {
        query = {"RSID": id}
    } else {
        query = {"variantID": id}
    }

    try {
        const variant = await VariantModel.find(query)
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

