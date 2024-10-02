import express from "express";
import geneModel from "../models/gene.js";
import Promoter_hMSC from "../models/promoter_hMSC.js";
import Promoter_OB from "../models/promoter_OB.js";
import Promoter_OC from "../models/promoter_OC.js";
import Disease2variant from "../models/disease2variant.js";
import VariantModel from "../models/variant.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// helper function

// find the relative promoter based on the celltype
const getPromoterData = async (celltype, gene) => {
    let genes;

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

    await generateBedpeFile(genes, bedpeFilePath);

    return genes;
}

// calculate the Igv locus range
const IgvRangeCalculator = async(celltype, gene) => {
    let start = Infinity
    let end = -Infinity
    // let genes = null
    let genes = await getPromoterData(celltype, gene)
    const resultObj = {}

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
const generateBedpeFile = async(genes, filePath) => {
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
    
    // fs.writeFileSync(filePath, bedpeString, (err) => {
    //     if (err) throw err;
    // });
    await fs.promises.writeFile(filePath, bedpeString);  
    console.log(`BEDPE file has been generated and saved to ${filePath}.`);

}

// generate proximal regulatory region
const proximalRegion = async(gene, celltype) => {
    let genes = await getPromoterData(celltype, gene);
    let range = []
    // console.log("genes in proximal helper function =====", genes)
    for (let gene of genes) {
        const rangeObj = {
            chr: parseInt(gene._doc.Chr.replace('chr', '')),
            start: gene._doc.Start, 
            end: gene._doc.End,
        }
        // Check if the range object already exists in the array
        // temporary comment out  && gene._doc.OpenChromatin !== "NA"
        if (!range.some(r => r.start === rangeObj.start && r.end === rangeObj.end)) {
            console.log("chr", gene._doc.Chr)
            range.push(rangeObj);  // Add range object to the array if it's unique
        }
    }
    console.log("range in proximal helper function =====", range)
    
    // Build an array of range conditions for the MongoDB query
    let rangeConditions;
    let result = [];
    if (range.length > 0) {
        rangeConditions = range.map(ele => ({
            Chr: ele.chr,
            Start: { $gte: ele.start, $lte: ele.end }
        }));
        console.log("condition", rangeConditions)
    
        // Query the VariantModel where the Start falls within any of the ranges
        result = await VariantModel.find({
            $or: rangeConditions
        });

    }

    return result;
}

router.get('/:id/proximal_regulatory', async(req, res) => {
    console.log("proximal regulatory =============")
    const id = req.params.id;
    const { celltype } = req.query;
    // const gene = await geneModel.find({Gene_Name: id});
    const variants = await VariantModel.find({GeneName_ID_Ensembl: { $regex: id, $options: 'i' }});

    let result = []
    for (let variant of variants) {
        // console.log("variant", variant)
        if (celltype === "hMSC") {
            if (variant._doc.chromHMM_hMSC && 
                (variant._doc.chromHMM_hMSC.startsWith("1_") || 
                 variant._doc.chromHMM_hMSC.startsWith("2_") || 
                 variant._doc.chromHMM_hMSC.startsWith("3_") ||
                 variant._doc.chromHMM_hMSC.startsWith("4_") 
                )) {
                    
                    result.push(variant);
            }
        } else if (celltype == "Osteoblast") {
            if (variant._doc.chromHMM_osteoblast && 
                (variant._doc.chromHMM_osteoblast.startsWith("1_") || 
                 variant._doc.chromHMM_osteoblast.startsWith("2_") || 
                 variant._doc.chromHMM_osteoblast.startsWith("3_") ||
                 variant._doc.chromHMM_osteoblast.startsWith("4_") 
                )) {
                    // console.log("variant", variant)
                    result.push(variant);
            }
        }
    }
    try {
        // const result = await proximalRegion(gene, celltype);
        // console.log("result in proximal route====", result)
        
        if (result) {
            return res.status(200).json({proximalRegion: result})
        } else {
            return res.status(404).json({ message: "No proximal regulatory data found" });
        }

    } catch(error) {
        return res.status(500).send("Sever error")
    }

})


router.get('/:id/distal_regulatory', async(req, res) => {
    console.log("distal regulatory =============")
    const id = req.params.id;
    const { celltype } = req.query;
    const variants = await VariantModel.find({GeneName_ID_Ensembl: { $regex: id, $options: 'i' }});
    console.log("celltype in distal regulatory", celltype)

    let result = []
    for (let variant of variants) {
        // console.log("variant", variant)
        if (celltype === "hMSC") {
            if (variant._doc.chromHMM_hMSC && 
                (variant._doc.chromHMM_hMSC.startsWith("13_") || 
                 variant._doc.chromHMM_hMSC.startsWith("14_") || 
                 variant._doc.chromHMM_hMSC.startsWith("15_") ||
                 variant._doc.chromHMM_hMSC.startsWith("16_") ||
                 variant._doc.chromHMM_hMSC.startsWith("17_") ||
                 variant._doc.chromHMM_hMSC.startsWith("18_") 
                )) {
                    
                    result.push(variant);
            }
        } else if (celltype == "Osteoblast") {
            if (variant._doc.chromHMM_osteoblast && 
                (variant._doc.chromHMM_osteoblast.startsWith("13_") || 
                 variant._doc.chromHMM_osteoblast.startsWith("14_") || 
                 variant._doc.chromHMM_osteoblast.startsWith("15_") ||
                 variant._doc.chromHMM_osteoblast.startsWith("16_") ||
                 variant._doc.chromHMM_osteoblast.startsWith("17_") ||
                 variant._doc.chromHMM_osteoblast.startsWith("18_") 
                )) {
                    // console.log("variant", variant)
                    result.push(variant);
            }
        }
    }

    console.log("result", result[0])
    try {
        if (result) {
            return res.status(200).json({distalRegion: result})
        } else {
            return res.status(404).json({ message: "No distal regulatory data found" });
        }

    } catch(error) {
        return res.status(500).send("Sever error")
    }

})



router.get('/:id', async(req, res) => {
    const id = req.params.id;
    const { celltype } = req.query;

    // console.log("id in gene route", id)
    // console.log("celltype in gene route", celltype)
    
    try {
        const gene = await geneModel.find({Gene_Name: id});
        const diseases = await Disease2variant.find({Reported_gene: { $regex: id, $options: 'i' } }).sort({'P-value': 1});
        const codingRegion = await VariantModel.find({GeneName_ID_Ensembl: id, Region_Ensembl: "exonic"})
        if(gene.length > 0) {
            let Igvrange = await IgvRangeCalculator(celltype, gene)
            return res.status(200).json({gene: gene, Igvrange: Igvrange, diseases: diseases, codingRegion: codingRegion})
        } else {
            return res.status(404).send("Gene not found")
        }
    } catch (error) {
        return res.status(500).send("Sever error")
    }

});




export default router;