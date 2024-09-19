import express from "express";
import geneModel from "../models/gene.js"

const router = express.Router();

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    const { celltype } = req.query;

    
    // console.log("id in gene route", id)
    // console.log("celltype in gene route", celltype)

    try {
        const gene = await geneModel.find({Gene_Name: id})
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