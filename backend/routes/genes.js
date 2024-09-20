import express from "express";
import geneModel from "../models/gene.js";
import Promoter_hMSC from "../models/promoter_hMSC.js";
import Promoter_OB from "../models/promoter_OB.js";
import Promoter_OC from "../models/promoter_OC.js";

// helper function

// calculate the Igv locus range
const IgvRangeCalculator = async(celltype, gene) => {
    let start = Infinity
    let end = -Infinity
    let genes = null
    const resultObj = {}
    // console.log("gene in calculator", gene)
    if (celltype === "hMSC") {
        // gene is an array with single element
        genes = await Promoter_hMSC.find({Gene: `${gene[0]["Gene_Name"]}`})
    } else if (celltype === "Osteoblast") {
        genes = await Promoter_OB.find({Gene: `${gene[0]["Gene_Name"]}`})
    } else {
        genes = await Promoter_OC.find({Gene: `${gene[0]["Gene_Name"]}`})
    }

    // console.log("genes in calculator after define celltype", genes)

    for (let gene of genes) {
        let HicBinStart = parseInt(gene._doc.HiC_Promoter_bin.split(":")[1])
        let distalBinStart = parseInt(gene._doc.HiC_Distal_bin.split(":")[1])
        let HicBinEnd = parseInt(gene._doc.HiC_Promoter_bin.split(":")[2])
        let distalBinEnd = parseInt(gene._doc.HiC_Distal_bin.split(":")[2])

        start = Math.min(start, HicBinStart, distalBinStart)
        end = Math.max(end, HicBinEnd, distalBinEnd)
    }

    resultObj["Start"] = start - 10000;
    resultObj["End"] = end + 10000;
    console.log("resultObj", resultObj)
    
    return resultObj
}

const router = express.Router();

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    const { celltype } = req.query;

    
    // console.log("id in gene route", id)
    // console.log("celltype in gene route", celltype)
    
    
    try {
        const gene = await geneModel.find({Gene_Name: id})
        let range = IgvRangeCalculator(celltype, gene)
        if(gene.length > 0) {
            return res.status(200).json(gene)
        } else {
            return res.status(404).send("Gene not found")
        }
    } catch (error) {
        return res.status(500).send("Sever error")
    }

});



export default router;