import express from "express";

const router = express.Router();

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    const { celltype } = req.query;

    
    console.log("id", id)
    console.log("celltype", celltype)
})



export default router;