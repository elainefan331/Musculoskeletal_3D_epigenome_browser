import express from "express";
import VariantModel from "../models/variant.js";
import Api_category from "../models/api_category.js";
import Promoter_hMSC from "../models/promoter_hMSC.js";
import Promoter_OB from "../models/promoter_OB.js";
import Promoter_OC from "../models/promoter_OC.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// helper function to parse bins
const parseBin = binString => {
    const [chr, start, end] = binString.split(':');
    return { chr: `chr${chr}`, start: parseInt(start), end: parseInt(end) };
}

// helper function for generate bedpe file
const generateBedpeFile = (promoter, filePath) => {
      // Extract data and construct the BEDPE array
        // console.log("promoter", promoter)
        const bedpeDataArray = promoter.flatMap(data => {
            console.log("data", data)
            const promoterDoc = data._doc
            const distalBin = parseBin(promoterDoc.HiC_Distal_bin);
            const promoterBin = parseBin(promoterDoc.HiC_Promoter_bin);
            
            // const promoterBins = data.HiC_Promoter_bin.split(',').map(parseBin);
            console.log("distalBin", distalBin)
            console.log("promoterBin", promoterBin)

            // Split HiC_info to handle multiple qvalues
            // let qvalues = ""
            // if (data.HiC_info.includes("|")) {
                
            // }
            
            const qvalues = promoterDoc.HiC_info.split('|').map(info => parseFloat(info.split('qvalue:')[1]));
            console.log("qvalues", qvalues)
         
            return qvalues.map(qvalue => ({
                chr1: distalBin.chr,
                start1: distalBin.start,
                end1: distalBin.end,
                chr2: promoterBin.chr,
                start2: promoterBin.start,
                end2: promoterBin.end,
                score: -Math.log10(qvalue)
            }));

        });
        console.log("result array", bedpeDataArray)

    const bedpeString = bedpeDataArray.map(item =>
        `${item.chr1}\t${item.start1}\t${item.end1}\t${item.chr2}\t${item.start2}\t${item.end2}\t${item.score}`
    ).join('\n');
    
    fs.writeFileSync(filePath, bedpeString, (err) => {
        if (err) throw err;
    });
    console.log(`BEDPE file has been generated and saved to ${filePath}.`);
}

router.get('/autocomplete', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send("Query parameter is required");
    }
    console.log(`Received query: ${query}`);
    try {
        const regex = new RegExp(query, 'i'); // 'i' for case-insensitive
        // const results = await Api_category.find({
        //     name: regex
        // }).limit(5)
        const results = await Api_category.find({
            $text: { $search: `"${query}"` }
        }).limit(5);
       

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
                // generate bedpe file if promoter exists
                if (promoter.length > 0) {
                    const publicFolderPath = path.resolve(__dirname,"../../frontend/public/igv/temp");
                    const filePath = path.join(publicFolderPath, `${obj.RSID}_${celltype}.bedpe.txt`);
                    generateBedpeFile(promoter, filePath);
                    console.log('BEDPE file has been generated and saved.')
                }
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

