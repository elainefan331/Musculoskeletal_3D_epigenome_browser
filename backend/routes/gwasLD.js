import express from "express";
import GwasLD from "../models/gwasLD.js";
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

// find the promoters according celltype, access different promoter collections
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

// add regulatoryBin, promoterBin attribute to variant obj according celltype
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
        // console.log("variant bins check", variant)
    }
}

// check if there is no promoter exist in variants
const promoterBinExist = (variants) => {
    let result = false;
    for (let variant of variants) {
        if (variant._doc.SigHic !== "NA") result = true;
    }
    return result;
}

// calculate the range of Igv
const IgvRangeCalculator = (variants) => {
    let start = Infinity;
    let end = -Infinity;
    const resultObj = {}

    for(let variant of variants) {
        const varriantStart = parseInt(variant._doc.regulatoryBin.split(":")[1]);
        const variantEnd = parseInt(variant._doc.regulatoryBin.split(":")[2]);
        // console.log("start", varriantStart);
        // console.log("end", variantEnd);
        if (!isNaN(varriantStart) && !isNaN(variantEnd)) {
            start = Math.min(start, varriantStart);
            end = Math.max(end, variantEnd);
        }
    }

    resultObj["Start"] = start - 10000;
    resultObj["End"] = end + 10000;
    // console.log("resultObj", resultObj);
    
    return resultObj;

}

// generate LD file
const generateLDFile = (variants, filePath) => {
    const LDdataArray = variants.flatMap(variant => {
        const variantObj = variant._doc;
        // console.log("variantObj", variantObj)
        const variantIdArr = variantObj.Variant.split(":")
        const chr = `chr${variantIdArr[0]}`
        const position = variantIdArr[1];
        const rsid = variantObj.RSID;
        const rsquare = variantObj.R_square;

        let rgb;
        if(rsquare === 1){
            rgb = "127,0,255";
        } else if(rsquare >= 0.8 && rsquare < 1){
            rgb = "255,0,5";
        } else if(rsquare < 0.8 && rsquare >= 0.6){
            rgb = "255,153,51";
        } else if(rsquare < 0.6 && rsquare >= 0.4){
            rgb = "102,204,0";
        } else if(rsquare < 0.4 && rsquare >= 0.2){
            rgb = "153,204,255";
        } else {
            rgb = "0,0,0"
        }

        return {
            chr: chr,
            start1: position,
            end1: position,
            rsid: rsid,
            rsquare: rsquare,
            start2: position,
            end2: position,
            rgb: rgb
        }
    });

    // console.log("result array", LDdataArray);

    const LDString = LDdataArray.map(item => `${item.chr}\t${item.start1}\t${item.end1}\t${item.rsid}\t${item.rsquare}\t+\t${item.start2}\t${item.end2}\t${item.rgb}`).join('\n');
    fs.writeFileSync(filePath, LDString, (err) => {
        if (err) throw err;
    });
    console.log(`LD file has been generated and saved to ${filePath}.`);

}

// generate bedpe file
const generateBedpeFile = (variants, filePath) => {
    const bedpeDataArray = variants.flatMap(variant => {
        const variantDoc = variant._doc;
        const variantArr = variantDoc.Variant.split(":");
        const chr = `chr${variantArr[0]}`;
        const position = variantArr[1];
        const promoterBins = variantDoc.promoterBinArray;

        return promoterBins.map(promoterBin => ({
            chr1: chr,
            start1: position,
            end1: position,
            chr2: chr,
            start2: promoterBin.split(":")[1],
            end2: promoterBin.split(":")[2]
        }));  
    });
    // console.log("disease bedpe data array", bedpeDataArray)

    const bedpeString = bedpeDataArray.map(item => `${item.chr1}\t${item.start1}\t${item.end1}\t${item.chr2}\t${item.start2}\t${item.end2}`).join('\n');
    
    fs.writeFileSync(filePath, bedpeString, (err) => {
        if (err) throw err;
    });

    console.log(`BEDPE file has been generated and saved to ${filePath}.`);
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
        const Igvrange = IgvRangeCalculator(variants);
        const promoterExist = promoterBinExist(variants);
        
        if(variants.length > 0) {
            const publicFolderPath = path.resolve(__dirname,"../../frontend/public/igv/temp");
            const LDfilePath = path.join(publicFolderPath, `${variantId}_LD.bed`);
            const bedpeFilePath = path.join(publicFolderPath, `${variantId}_${celltype}.bedpe.txt`)
            generateLDFile(variants, LDfilePath);
            if (promoterExist) {
                generateBedpeFile(variants, bedpeFilePath);
            }
            return res.status(200).json({variants, Igvrange, promoterExist})
        } else {
            return res.status(404).send("variants not found")
        }
    } catch (error) {
        return res.status(500).send("Sever error")
    }
});

export default router;