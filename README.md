# Musculoskeletal (MSK) 3D Epigenome Atlas

The **Musculoskeletal (MSK) 3D Epigenome Atlas** is a comprehensive platform designed to empower researchers in the exploration of gene regulation, single nucleotide polymorphisms (SNPs), and traits within cell-type-specific omics data relevant to the musculoskeletal system. This intuitive tool integrates multiple high-quality datasets, enabling in-depth analysis of the genome-wide regulatory landscape across critical MSK cell types.

In this study, we conducted extensive profiling using **ATAC-seq** and **RNA-seq** on human primary mesenchymal stem cells, osteoblasts, osteocytes, skeletal myoblasts, and myotubes, all derived from bone and skeletal muscle biopsies. To further enrich the data, we incorporated **DNase-seq** and **ChIP-seq** data from the **ENCODE** and **Roadmap Epigenomics** projects. Additionally, we generated high-resolution (2kb) MSK-specific **Hi-C** data to construct comprehensive maps of regulatory elements and 3D chromatin looping structures in MSK-related primary cell types.

By combining these robust datasets, the MSK 3D Epigenome Atlas provides a unique and powerful resource for advancing our understanding of gene regulatory mechanisms in human musculoskeletal biology. Researchers can utilize this atlas to gain insights that may inform the development of novel therapeutic strategies targeting musculoskeletal diseases and disorders.

## Phenotype search

Phenotype pages start from genome-wide association studies (GWAS) of musculoskeletal phenotypes: phenotype → fine-mapped
loci → 95% credible sets → predicted target genes (CisLink-Base) in the five cell types → 3D view.

- `/phenotypes`, `/phenotypes/:id`, `/loci/:id` (frontend); `/phenotypes`, `/phenotypes/:id`, `/phenotypes/loci/:id`,
  `/phenotypes/loci/:id/assoc` (backend, `routes/phenotypes.js`).
- Collections: `phenotypes`, `loci`, `credible_sets`, `locus_genes`, `locus_assoc` (`models/phenotypeSearch.js`).
- Load or update one phenotype from its analysis exports (rerunnable; replaces that phenotype's documents and adds it to
  the home-page autocomplete):

  ```bash
  cd backend && node scripts/import_phenotype.js /path/to/<phenotype>/export
  ```

  The exports are made by the atlas analysis pipeline (`MSK_browser/data/phenotype_search/scripts/`). One phenotype is
  about 100 MB in MongoDB, most of it the locus-plot data.
- The locus plot uses LocusZoom.js; its gene track is fetched from the University of Michigan LocusZoom API.
