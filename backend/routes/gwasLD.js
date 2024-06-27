import express from "express";
import GwasLD from "../models/gwasLD.js";
import Promoter_hMSC from "../models/promoter_hMSC.js";
import Promoter_OB from "../models/promoter_OB.js";
import Promoter_OC from "../models/promoter_OC.js";

const router = express.Router();

// helper function
const getPromoterData = async (celltype, regulatoryBin) => {
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

    return promoterModel.find({HiC_Distal_bin: regulatoryBin})
}

const variantBinFinder = async(variants, celltype) => {
    let SigHic = "";
    for(let variant of variants) {
        if (celltype === "hMSC") {
            SigHic = variant._doc.SigHiC_hMSC
        } else if (celltype === "Osteocyte") {
            SigHic = variant._doc.SigHiC_OC
        } else if (celltype === "Osteoblast") {
            SigHic = variant._doc.SigHiC_OB13
        }
        variant._doc["SigHic"] = SigHic;
        // console.log("variant SigHic check", variant);
    }

    for(let variant of variants) {
        let regulatoryBin = "";
        let promoterBin = "";
        let promoterBinArray = [];
        let promoters=[];
        if (variant._doc.SigHic !== "NA") {
            const regex = /RegulatoryBin:(\d+:\d+:\d+);PromoterBin:((?:\d+:\d+:\d+,?)+)/;
            const match = variant._doc.SigHic.match(regex)
            if (match) {
                regulatoryBin = match[1];
                promoterBin = match[2];
                promoterBinArray = promoterBin.split(",");
                promoters = await getPromoterData(celltype, regulatoryBin)
            }
        }
        variant._doc["regulatoryBin"] = regulatoryBin;
        variant._doc["promoterBin"] = promoterBin;
        variant._doc["promoterBinArray"] = promoterBinArray;
        variant._doc["promoters"] = promoters;
        console.log("variant bins check", variant)
    }
}



router.get('/:variantId', async(req, res) => {
    const variantId = req.params.variantId;
    const { cutoff } = req.query;
    const { celltype} = req.query;

    console.log("variantId", variantId)
    console.log("celltype", celltype)
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

        await variantBinFinder(variants, celltype);
        
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