import express from "express";
// import Disease2SNPModel from "../models/disease2SNP";

const router = express.Router();

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    const { celltype } = req.query;

    // try {
    //     const disease = await Disease2SNPModel.find({})
    // }
    console.log("id", id)
    console.log("celltype", celltype)
})

export default router;