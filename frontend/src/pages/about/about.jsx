import "./about.css"

const About = () => {
    return (
        <div>
            <h1 className="about-header">About the Musculoskeletal 3D Epigenome Browser</h1>
            <p className="about-content">The Musculoskeletal (MSK) 3D Epigenome Atlas is a comprehensive platform designed to empower researchers in the exploration of gene regulation, single nucleotide polymorphisms (SNPs), and traits within cell-type-specific omics data relevant to the musculoskeletal system. This intuitive tool integrates multiple high-quality datasets, enabling in-depth analysis of the genome-wide regulatory landscape across critical MSK cell types.

In this study, we conducted extensive profiling using ATAC-seq and RNA-seq on human primary mesenchymal stem cells, osteoblasts, osteocytes, skeletal myoblasts, and myotubes, all derived from bone and skeletal muscle biopsies. To further enrich the data, we incorporated DNase-seq and ChIP-seq data from the ENCODE and Roadmap Epigenomics projects. Additionally, we generated high-resolution (2kb) MSK-specific Hi-C data to construct comprehensive maps of regulatory elements and 3D chromatin looping structures in MSK-related primary cell types.

By combining these robust datasets, the MSK 3D Epigenome Atlas provides a unique and powerful resource for advancing our understanding of gene regulatory mechanisms in human musculoskeletal biology. Researchers can utilize this atlas to gain insights that may inform the development of novel therapeutic strategies targeting musculoskeletal diseases and disorders.</p>
            <h1 className="about-header">How It Works</h1>
        </div>
    )
}

export default About;