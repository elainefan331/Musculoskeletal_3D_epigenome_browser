import express from "express";
import VariantModel from "../models/variant.js";
import Promoter_hMSC from "../models/promoter_hMSC.js";

const router = express.Router();

router.get('/autocomplete', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send("Query parameter is required");
    }
    console.log(`Received query: ${query}`);
    try {
        const regex = new RegExp(query, 'i'); // 'i' for case-insensitive
        const results = await VariantModel.find({
            $or: [
                { variantID: regex },
                { RSID: regex }
            ]
        }).limit(10);

        console.log(`Search results for "${query}":`, results);
        return res.status(200).json(results);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).send("Server error");
    }
});

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
        let SigHiCRowData = "";
        const variant = await VariantModel.find(variantQuery);
        const obj = variant[0]._doc

        if (celltype === "hMSC") {
            SigHiCRowData = obj.SigHiC_hMSC
        } else if(celltype === "Osteocyte") {
            SigHiCRowData = obj.SigHiC_OC
        } else if (celltype === "Osteoblast") {
            SigHiCRowData = obj.SigHiC_OB13
        }
        console.log("SigHiCRowData", SigHiCRowData)
        
        if (SigHiCRowData !== "NA") {
            const regex = /RegulatoryBin:(\d+:\d+:\d+)/;
            const match = SigHiCRowData.match(regex)
            let extractedPart = match[1]
            const promoter_hMSC = await Promoter_hMSC.find({HiC_Distal_bin: extractedPart})
            // if(match) {
            //     extractedPart = match[1]
            // } else {
            //     extractedPart = "no match found"
            // }
            console.log("extractedPart", extractedPart)
        }
       
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

