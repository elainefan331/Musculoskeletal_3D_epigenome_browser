import { useEffect, useRef } from 'react';
import igv from 'igv';

const IgvGene = ({gene, celltype, Igvrange}) => {
    console.log("Igvrange in IgvGene", Igvrange)
    const igvDiv = useRef(null);
    const igvBrowser = useRef(null);
    const locus = `chr${gene.Chr}:${Igvrange.locusStart}-${Igvrange.locusEnd}`

    let locus_hic_url = `/igv/temp/IndexSNP_${IndexSNP}_${celltype}.bedpe.txt`
    let genecode_url = "https://s3.amazonaws.com/igv.org.genomes/hg38/Homo_sapiens.GRCh38.94.chr.gff3.gz"
    let genecode_index_url = "https://s3.amazonaws.com/igv.org.genomes/hg38/Homo_sapiens.GRCh38.94.chr.gff3.gz.tbi"
    let atac_url;
    let dnase_url;
    let chromHMM_url;
    let H3k27ac_url;
    let H3k4me3_url;
    let H3k4me1_url;
    let atac_name;
    let dnase_name;
    let chromHMM_name;
    let H3k27ac_name;
    let H3k4me3_name;
    let H3k4me1_name;

    if (celltype === "Osteocyte") {
        atac_name = "ATAC-seq-Osteoblast";
        dnase_name = "DNase-seq_Osteoblast";
        chromHMM_name = "ChromHMM-Osteoblast";
        H3k27ac_name = "H3k27ac-Osteoblast";
        H3k4me3_name = "H3k4me3-Osteoblast";
        H3k4me1_name = "H3k4me1-Osteoblast";
        atac_url = `/igv/bigwig/Osteoblast/ATAC_seq_Osteoblast_pvalue.bigwig`;
        dnase_url = `/igv/bigwig/Osteoblast/DNase_seq_Osteoblast.bigWig`;
        chromHMM_url = `/igv/bigwig/Osteoblast/imputed12marks_hg38lift_dense.bed`;
        H3k27ac_url = `/igv/bigwig/Osteoblast/H3K27ac_Osteoblast_pvalue.bigWig`;
        H3k4me3_url = `/igv/bigwig/Osteoblast/H3K4me3_Osteoblast_pvalue.bigWig`;
        H3k4me1_url = `/igv/bigwig/Osteoblast/H3K4me1_Osteoblast_pvalue.bigWig`;
    } else {
        atac_name = `ATAC-seq`;
        dnase_name = `DNase-seq`;
        chromHMM_name = `ChromHMM`;
        H3k27ac_name = `H3k27ac`;
        H3k4me3_name = `H3k4me3`;
        H3k4me1_name = `H3k4me1`;
        atac_url = `/igv/bigwig/${celltype}/ATAC_seq_${celltype}_pvalue.bigwig`;
        dnase_url = `/igv/bigwig/${celltype}/DNase_seq_${celltype}.bigWig`;
        chromHMM_url = `/igv/bigwig/${celltype}/imputed12marks_hg38lift_dense.bed`;
        H3k27ac_url = `/igv/bigwig/${celltype}/H3K27ac_${celltype}_pvalue.bigWig`;
        H3k4me3_url = `/igv/bigwig/${celltype}/H3K4me3_${celltype}_pvalue.bigWig`;
        H3k4me1_url = `/igv/bigwig/${celltype}/H3K4me1_${celltype}_pvalue.bigWig`;
    }


    useEffect(() => {
        const options = {
            genome: "hg38",
            locus: locus,
            tracks:[
                {
                    type: "interaction",
                    format: "bedpe",
                    name: "Significant Hi-C",
                    arcType: "nested",
                    useScore: true,
                    color: "blue",
                    logScale: true,
                    showBlocks: true,
                    height: 150,
                    url: locus_hic_url,
                },
                {
                    type: "annotation",
                    format: "gff3",
                    // format: "gtf",
                    url: genecode_url,
                    indexURL: genecode_index_url,
                    displayMode: "EXPANDED",
                    name: "Gencode v35 (gtf)",
                    visibilityWindow: 10000000,
                    height: 150,
                    color: (feature) => {
                        switch (feature.getAttributeValue("biotype")) {
                            case "antisense":
                                return "blueviolet"
                            case "protein_coding":
                                return "blue"
                            case "retained_intron":
                                return "rgb(0, 150, 150)"
                            case "processed_transcript":
                                return "purple"
                            case "processed_pseudogene":
                                return "#7fff00"
                            case "unprocessed_pseudogene":
                                return "#d2691e"
                            default:
                                return "black"
                        }
                    }
                },
                {
                    type: "wig",
                    format: "bigwig",
                    url: atac_url,
                    height: 50,
                    name: atac_name,
                },
                {
                    type: "wig",
                    format: "bigwig",
                    url: dnase_url,
                    height: 50,
                    name: dnase_name,
                },
                {
                    type: "annotation",
                    format: "bed",
                    url: chromHMM_url,
                    height: 50,
                    name: chromHMM_name,
                    displayMode: "EXPANDED",
                },
                {
                    type: "wig",
                    format: "bigwig",
                    url: H3k27ac_url,
                    height: 50,
                    name: H3k27ac_name,
                    color: "rgb(252, 202, 3)",
                },
                {
                    type: "wig",
                    format: "bigwig",
                    url: H3k4me1_url,
                    height: 50,
                    name: H3k4me1_name,
                    color: "rgb(252, 202, 3)",
                }, 
                {
                    type: "wig",
                    format: "bigwig",
                    url: H3k4me3_url,
                    height: 50,
                    name: H3k4me3_name,
                    color: "rgb(252, 74, 3)",
                },
                {
                    type: "annotation",
                    format: "bb",
                    url: '/igv/encodeCcreCombined.bb',
                    height: 50,
                    name: "ENCODE-cCRE",
                    displayMode: "EXPANDED",
                }
            ],
            log: true
        };
        igv.createBrowser(igvDiv.current, options).then(function (browser) {
            igvBrowser.current = browser;
            console.log("Created IGV browser");
          });
         
          // Cleanup function to remove the browser instance
          return () => {
            if (igvBrowser.current) {
                igv.removeBrowser(igvBrowser.current);
                igvBrowser.current = null;
            }
          };
    }, []);



    return (
        <div>
            <div ref={igvDiv} style={{ height: '500px', width: '100%',  marginBottom: '150px' }}></div>
        </div>
    )
}

export default IgvGene;