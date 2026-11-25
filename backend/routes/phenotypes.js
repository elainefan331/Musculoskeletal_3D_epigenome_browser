import express from "express";
import { Phenotype, Locus, CredibleSetVariant, LocusGene, LocusAssoc } from "../models/phenotypeSearch.js";

// Phenotype search (see MSK_atlas_manuscript PHENOTYPE_SEARCH.md):
//   GET /phenotypes                -> all phenotypes
//   GET /phenotypes/:id            -> one phenotype with its loci and each locus's top gene per cell type
//   GET /phenotypes/loci/:locusId  -> one locus: credible sets, credible-set variants, candidate genes x cell types
//   GET /phenotypes/loci/:locusId/assoc -> association data for the locus plot (p-values, r2, PIP)

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const phenotypes = await Phenotype.find({}, { _id: 0 }).sort({ category: 1, name: 1 }).lean();
        return res.status(200).json(phenotypes);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

router.get("/loci/:locusId", async (req, res) => {
    const { locusId } = req.params;
    try {
        const locus = await Locus.findOne({ locus_id: locusId }, { _id: 0 }).lean();
        if (!locus) {
            return res.status(404).send("Locus not found");
        }
        const [phenotype, variants, genes] = await Promise.all([
            Phenotype.findOne({ phenotype_id: locus.phenotype_id }, { _id: 0 }).lean(),
            CredibleSetVariant.find({ locus_id: locusId }, { _id: 0 }).sort({ pip: -1 }).lean(),
            LocusGene.find({ locus_id: locusId }, { _id: 0 }).sort({ score: -1 }).lean(),
        ]);
        return res.status(200).json({ phenotype, locus, variants, genes });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

router.get("/loci/:locusId/assoc", async (req, res) => {
    try {
        const assoc = await LocusAssoc.findOne({ locus_id: req.params.locusId }, { _id: 0 }).lean();
        if (!assoc) {
            return res.status(404).send("Locus not found");
        }
        return res.status(200).json(assoc);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const phenotype = await Phenotype.findOne({ phenotype_id: id }, { _id: 0 }).lean();
        if (!phenotype) {
            return res.status(404).send("Phenotype not found");
        }
        const loci = await Locus.find({ phenotype_id: id }, { _id: 0, credible_sets: 0 })
            .sort({ top_log_pvalue: -1 }).lean();
        // best-scoring gene of each locus in each cell type
        const top = await LocusGene.aggregate([
            { $match: { phenotype_id: id } },
            { $sort: { score: -1 } },
            { $group: { _id: { locus_id: "$locus_id", cell: "$cell" }, gene: { $first: "$gene" }, score: { $first: "$score" } } },
        ]);
        const candidates = await LocusGene.aggregate([
            { $match: { phenotype_id: id } },
            { $group: { _id: "$locus_id", genes: { $addToSet: "$gene" } } },
        ]);
        const genesByLocus = Object.fromEntries(candidates.map((c) => [c._id, c.genes]));
        const byLocus = {};
        for (const t of top) {
            (byLocus[t._id.locus_id] ??= {})[t._id.cell] = { gene: t.gene, score: t.score };
        }
        for (const l of loci) {
            l.top_genes = byLocus[l.locus_id] || {};
            l.candidate_genes = genesByLocus[l.locus_id] || [];
        }
        return res.status(200).json({ phenotype, loci });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

export default router;
