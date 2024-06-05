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
            let extractedPart = ""
            if(match) {
                extractedPart = match[1]
            } else {
                extractedPart = "no match found"
            }
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

