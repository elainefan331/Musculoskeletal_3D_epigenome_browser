// Load one phenotype's exports (MSK_browser/data/phenotype_search/<trait>/export/) into the phenotype-search collections.
// Usage: node scripts/import_phenotype.js <export_dir>
// Replaces that phenotype's existing documents, so it can be rerun. Also adds the phenotype (name and synonyms) to
// api_category so the home-page autocomplete offers it.
import fs from "fs";
import path from "path";
import readline from "readline";
import mongoose from "mongoose";
import { db_URI } from "../config.js";
import Api_category from "../models/api_category.js";
import { Phenotype, Locus, CredibleSetVariant, LocusGene, LocusAssoc } from "../models/phenotypeSearch.js";

const dir = process.argv[2];
if (!dir) {
    console.error("usage: node scripts/import_phenotype.js <export_dir>");
    process.exit(1);
}

const NUMERIC = /^-?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i;
const value = (v) => (v === "" || v === "NA" ? null : v === "True" ? true : v === "False" ? false : NUMERIC.test(v) ? Number(v) : v);

const readTsv = async (file) => {
    const rows = [];
    let header;
    for await (const line of readline.createInterface({ input: fs.createReadStream(path.join(dir, file)) })) {
        const f = line.split("\t");
        if (!header) {
            header = f;
            continue;
        }
        rows.push(Object.fromEntries(header.map((h, i) => [h, value(f[i] ?? "")])));
    }
    return rows;
};

const insert = async (Model, docs, label) => {
    for (let i = 0; i < docs.length; i += 5000) {
        await Model.insertMany(docs.slice(i, i + 5000), { ordered: false });
    }
    console.log(`${label}: ${docs.length}`);
};

await mongoose.connect(db_URI);
const [phenotype] = await readTsv("phenotypes.tsv");
const id = phenotype.phenotype_id;
for (const M of [Phenotype, Locus, CredibleSetVariant, LocusGene, LocusAssoc]) {
    await M.init();
    await M.deleteMany({ phenotype_id: id });
}

// locus plot data: one JSON per locus; the locus table takes its top -log10 p from it
const assoc = [];
const topLogP = {};
for await (const line of readline.createInterface({ input: fs.createReadStream(path.join(dir, "locus_assoc.jsonl")) })) {
    const a = JSON.parse(line);
    assoc.push(a);
    topLogP[a.locus_id] = Math.max(...a.log_pvalue);
}

const sets = await readTsv("credible_set_summary.tsv");
const setsByLocus = {};
for (const s of sets) {
    (setsByLocus[s.locus_id] ??= []).push(s);
}
const loci = (await readTsv("loci.tsv")).map((l) => ({
    ...l,
    phenotype_id: id,
    top_log_pvalue: topLogP[l.locus_id] ?? null,
    credible_sets: (setsByLocus[l.locus_id] || []).sort((a, b) => b.max_pip - a.max_pip),
}));
const variants = (await readTsv("credible_sets.tsv")).map((v) => ({ ...v, phenotype_id: id }));
const genes = (await readTsv("locus_genes.tsv")).map((g) => ({ ...g, phenotype_id: id }));

await insert(Phenotype, [phenotype], "phenotypes");
await insert(Locus, loci, "loci");
await insert(CredibleSetVariant, variants, "credible_sets");
await insert(LocusGene, genes, "locus_genes");
await insert(LocusAssoc, assoc, "locus_assoc");

const names = [phenotype.name, ...String(phenotype.synonyms || "").split("|")].filter(Boolean);
await Api_category.collection.deleteMany({ category: "phenotype", phenotype_id: id });
await Api_category.collection.insertMany(names.map((name) => ({ name, category: "phenotype", phenotype_id: id })));
console.log(`api_category: ${names.length} names`);
await mongoose.disconnect();
