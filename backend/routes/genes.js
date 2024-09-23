import express from "express";
import geneModel from "../models/gene.js";
import Promoter_hMSC from "../models/promoter_hMSC.js";
import Promoter_OB from "../models/promoter_OB.js";
import Promoter_OC from "../models/promoter_OC.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// helper function

// calculate the Igv locus range
const IgvRangeCalculator = async(celltype, gene) => {
    let start = Infinity
    let end = -Infinity
    let genes = null
    const resultObj = {}
    
    if (celltype === "hMSC") {
        // gene is an array with single element
        genes = await Promoter_hMSC.find({Gene: `${gene[0]["Gene_Name"]}`})
    } else if (celltype === "Osteoblast") {
        genes = await Promoter_OB.find({Gene: `${gene[0]["Gene_Name"]}`})
    } else {
        genes = await Promoter_OC.find({Gene: `${gene[0]["Gene_Name"]}`})
    }

    const publicFolderPath = path.resolve(__dirname,"../../frontend/public/igv/temp"); 
    const bedpeFilePath = path.join(publicFolderPath, `${gene[0]["Gene_Name"]}_${celltype}.bedpe.txt`);
    generateBedpeFile(genes, bedpeFilePath);

    for (let gene of genes) {
        let HicBinStart = parseInt(gene._doc.HiC_Promoter_bin.split(":")[1])
        let distalBinStart = parseInt(gene._doc.HiC_Distal_bin.split(":")[1])
        let HicBinEnd = parseInt(gene._doc.HiC_Promoter_bin.split(":")[2])
        let distalBinEnd = parseInt(gene._doc.HiC_Distal_bin.split(":")[2])

        start = Math.min(start, HicBinStart, distalBinStart)
        end = Math.max(end, HicBinEnd, distalBinEnd)
    }

    resultObj["locusStart"] = start - 10000;
    resultObj["locusEnd"] = end + 10000;
    // console.log("resultObj", resultObj)
    
    return resultObj
}

// generate bedpe file
const generateBedpeFile = (genes, filePath) => {
    // console.log("in generate bedpe file")
    const bedpeDataArray = genes.flatMap(gene => {
        const geneDoc = gene._doc;
        const HicBinArray = geneDoc.HiC_Promoter_bin.split(":")
        const distalBinArray = geneDoc.HiC_Distal_bin.split(":")
        const chr = `chr${HicBinArray[0]}`;
        
        return {
            chr1: chr,
            start1: distalBinArray[1],
            end1: distalBinArray[2],
            chr2: chr,
            start2: HicBinArray[1],
            end2: HicBinArray[2],
            long: 10
        }
    });

    const bedpeString = bedpeDataArray.map(item => `${item.chr1}\t${item.start1}\t${item.end1}\t${item.chr2}\t${item.start2}\t${item.end2}\t${item.long}`).join('\n');
    
    fs.writeFileSync(filePath, bedpeString, (err) => {
        if (err) throw err;
    });

    console.log(`BEDPE file has been generated and saved to ${filePath}.`);

}


router.get('/:id', async(req, res) => {
    const id = req.params.id;
    const { celltype } = req.query;

    
    // console.log("id in gene route", id)
    // console.log("celltype in gene route", celltype)
    
    
    try {
        const gene = await geneModel.find({Gene_Name: id})
        let Igvrange = await IgvRangeCalculator(celltype, gene)
        if(gene.length > 0) {
            return res.status(200).json({gene: gene, Igvrange: Igvrange})
        } else {
            return res.status(404).send("Gene not found")
        }
    } catch (error) {
        return res.status(500).send("Sever error")
    }

});



export default router;