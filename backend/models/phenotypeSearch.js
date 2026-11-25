import mongoose from "mongoose";
const { Schema } = mongoose;

// Phenotype search: fine-mapped GWAS loci and their predicted target genes in the 5 cell types.
// Documents are loaded by scripts/import_phenotype.js from the analysis exports; fields not listed here are kept as is.

const phenotypeSchema = new Schema({
    phenotype_id: { type: String, index: true, unique: true },
}, { collection: 'phenotypes', strict: false });

const locusSchema = new Schema({
    phenotype_id: { type: String, index: true },
    locus_id: { type: String, index: true, unique: true },
}, { collection: 'loci', strict: false });

const credibleSetVariantSchema = new Schema({
    locus_id: { type: String, index: true },
    variant_hg38: { type: String, index: true },
}, { collection: 'credible_sets', strict: false });

const locusGeneSchema = new Schema({
    locus_id: { type: String, index: true },
    gene: { type: String, index: true },
}, { collection: 'locus_genes', strict: false });

const locusAssocSchema = new Schema({
    locus_id: { type: String, index: true, unique: true },
}, { collection: 'locus_assoc', strict: false });

export const Phenotype = mongoose.model('Phenotype', phenotypeSchema);
export const Locus = mongoose.model('Locus', locusSchema);
export const CredibleSetVariant = mongoose.model('CredibleSetVariant', credibleSetVariantSchema);
export const LocusGene = mongoose.model('LocusGene', locusGeneSchema);
export const LocusAssoc = mongoose.model('LocusAssoc', locusAssocSchema);
