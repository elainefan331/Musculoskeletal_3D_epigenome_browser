import express from "express";
import GwasLD from "../models/gwasLD.js";

const router = express.Router();

router.get('/:variantId', async(req, res) => {
    const variantId = req.params.variantId;
    const { cutoff } = req.query;

    console.log("variantId", variantId)
    console.log("type of variantid", typeof(variantId))
    console.log("cutoff", cutoff)
    // convert cutoff to number
    const cutoffNum = parseFloat(cutoff)
    try {
        const variants = await GwasLD.find({
            $and: [
                {IndexSNP: variantId},
                {R_square: {$gte: cutoffNum}}
            ]
        });
        console.log("result at backend", variants)
        if(variants.length > 0) {
            return res.status(200).json(variants)
        } else {
            return res.status(404).send("variants not found")
        }
    } catch (error) {
        return res.status(500).send("Sever error")
    }
});

export default router;