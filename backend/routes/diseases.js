import express from "express";
import Disease2variant from "../models/disease2variant.js";


const router = express.Router();

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    const { celltype } = req.query;
    
    console.log("id", id)
    console.log("celltype", celltype)
    
    try {
        const disease = await Disease2variant.find({Disease_trait: id})
        if(disease) {
            return res.status(200).json(disease)
        } else {
            return res.status(404).send("Disease not found")
        }
    } catch (error) {
        return res.status(500).send("Sever error")
    }
});

export default router;