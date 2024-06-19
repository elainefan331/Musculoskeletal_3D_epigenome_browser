import express from "express";
import VariantModel from "../models/variant.js";
import Api_category from "../models/api_category.js";
import Promoter_hMSC from "../models/promoter_hMSC.js";
import Promoter_OB from "../models/promoter_OB.js";
import Promoter_OC from "../models/promoter_OC.js";

const router = express.Router();

// helper function
const getPromoterData = async (celltype, extractedPart) => {
    let promoterModel;

    if (celltype === "hMSC") {
        promoterModel = Promoter_hMSC
    } else if (celltype === "Osteocyte") {
        promoterModel = Promoter_OC
    } else if (celltype === "Osteoblast") {
        promoterModel = Promoter_OB
    } else {
        return null
    }

    return promoterModel.find({HiC_Distal_bin: extractedPart})
}

router.get('/autocomplete', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send("Query parameter is required");
    }
    console.log(`Received query: ${query}`);
    try {
        const regex = new RegExp(query, 'i'); // 'i' for case-insensitive
        // const results = await VariantModel.find({
        //     $or: [
        //         { variantID: regex },
        //         { RSID: regex }
        //     ]
        // }).limit(10);
        const results = await Api_category.find({
            name: regex
        }).limit(10)

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
        let variant = await VariantModel.find(variantQuery);
        const obj = variant[0]._doc

        if (celltype === "hMSC") {
            SigHiCRowData = obj.SigHiC_hMSC
        } else if(celltype === "Osteocyte") {
            SigHiCRowData = obj.SigHiC_OC
        } else if (celltype === "Osteoblast") {
            SigHiCRowData = obj.SigHiC_OB13
        }
        console.log("SigHiCRowData", SigHiCRowData)
        let promoter=[];
        let extractedPart = "";
        let promoterBin = "";
        let promoterBinArray = [];
        if (SigHiCRowData !== "NA") {
            const regex = /RegulatoryBin:(\d+:\d+:\d+);PromoterBin:((?:\d+:\d+:\d+,?)+)/;
            const match = SigHiCRowData.match(regex)
            if (match) {
                extractedPart = match[1];
                promoterBin = match[2];
                promoterBinArray = promoterBin.split(",");
                promoter = await getPromoterData(celltype, extractedPart)
                console.log("promoter", promoter)
                console.log("extractedPart", extractedPart)
                console.log("promoter_bin", promoterBin)
                console.log("promoterBinArray", promoterBinArray)

            }
        }
       
        if (variant) {
            return res.status(200).json({variant, promoter, 
                bin: {
                    regulatoryBin: extractedPart, 
                    promoterBin: promoterBin,
                    promoterBinArray: promoterBinArray
                }
            });
        } else {
            return res.status(404).send("Variant not found");
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server error");
    }
});



export default router;

