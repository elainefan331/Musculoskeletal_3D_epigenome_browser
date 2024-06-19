import React, { useEffect, useRef } from 'react';
import igv from 'igv';

const IgvVariantWithPromoter = ({variant, celltype, promoter, regulatoryBin, promoterBin}) => {
    const igvDiv = useRef(null);
    
    // calculate the start and end --> generate locus range
    let startMin = regulatoryBin.split(":")[1];
    let endMax = regulatoryBin.split(":")[2];
    let promoterBinArr = promoterBin.split(",");
    console.log("promoter", promoter)
    
    for (let i = 0; i < promoterBinArr.length; i++) {
        let start = promoterBinArr[i].split(":")[1];
        let end = promoterBinArr[i].split(":")[2];
        startMin = Math.min(start, startMin);
        endMax = Math.max(end, endMax);
    }
    startMin -= 10000;
    endMax += 10000;
    const locus = `chr${variant.Chr}:${startMin}-${endMax}`;

    // define the path to target files
    let promoter_like_url = "/igv/promoter/promoter_like_regions_annotation_sorted.bed";
    // let genecode_url = "/igv/gencode.v35.annotation.sort.gtf.gz";
    // let genecode_index_url = "/igv/gencode.v35.annotation.sort.gtf.gz.tbi";
    let genecode_url = "https://s3.amazonaws.com/igv.org.genomes/hg38/Homo_sapiens.GRCh38.94.chr.gff3.gz"
    let genecode_index_url = "https://s3.amazonaws.com/igv.org.genomes/hg38/Homo_sapiens.GRCh38.94.chr.gff3.gz.tbi"
    let atac_url = `/igv/bigwig/${celltype}/ATAC_seq_${celltype}_pvalue.bigwig`;
    let dnase_url = `/igv/bigwig/${celltype}/DNase_seq_${celltype}.bigWig`;
    let chromHMM_url = `/igv/bigwig/${celltype}/imputed12marks_hg38lift_dense.bed`;
    let H3k27ac_url = `/igv/bigwig/${celltype}/H3K27ac_${celltype}_pvalue.bigWig`;
    let H3k4me3_url = `/igv/bigwig/${celltype}/H3K4me3_${celltype}_pvalue.bigWig`;
    let H3k4me1_url = `/igv/bigwig/${celltype}/H3K4me1_${celltype}_pvalue.bigWig`;
    let rnaseq_url = `/igv/bigwig/${celltype}/rep1PE_stranded_genome_plusAll.bw`;

    // generate the bedpe array for promoters track
    const parseBin = binString => {
        const [chr, start, end] = binString.split(':');
        return { chr: `chr${chr}`, start: parseInt(start), end: parseInt(end) };
    }

    // Extract data and construct the BEDPE array
    const bedpeDataArray = promoter.flatMap(data => {
        const distalBin = parseBin(data.HiC_Distal_bin);
        const promoterBins = data.HiC_Promoter_bin.split(',').map(parseBin);

        // Split HiC_info to handle multiple qvalues
        const qvalues = data.HiC_info.split('|').map(info => parseFloat(info.split('qvalue:')[1]));

        // Generate rows for each qvalue and promoter bin
        return qvalues.flatMap(qvalue =>
            promoterBins.map(promoterBin => ({
                chr1: distalBin.chr,
                start1: distalBin.start,
                end1: distalBin.end,
                chr2: promoterBin.chr,
                start2: promoterBin.start,
                end2: promoterBin.end,
                // score: qvalue
                score: -Math.log10(qvalue)
            }))
        );
        // return qvalues.flatMap(qvalue =>
        //     promoterBins.map(promoterBin => [
        //         {
        //             chr: distalBin.chr,
        //             start: distalBin.start,
        //             end: distalBin.end,
        //             score: -Math.log10(qvalue)
        //         },
        //         {
        //             chr: promoterBin.chr,
        //             start: promoterBin.start,
        //             end: promoterBin.end,
        //             score: -Math.log10(qvalue)
        //         }
        //     ])
        // ).flat();

});

console.log(bedpeDataArray);



    useEffect(() => {
        const options = {
            genome: "hg38",
            locus: locus,
            roi:[
                {
                    name: `${variant.RSID}`,
                    color: "rgba(68, 134, 247, 0.25)",
                    features: [
                        {
                            chr: `chr${variant.Chr}`,
                            start: variant.Start,
                            end: variant.End,
                        }
                    ],
                }
            ],
            tracks: [
                {
                    type: "interaction",
                    format: "bedpe",
                    name: "Significant Hi-C",
                    arcType: "proportional",
                    useScore: true, 
                    color: "blue",
                    logScale: true,
                    showBlocks: true,
                    height: 150,
                    // url: "/igv/rs947002423_hMSC.bedpe.txt"
                    features: [
                        {
                            chr: "chr7",
                            start: 260000,
                            end: 262000,
                            score: 7.66958622650809
                        },
                        {
                            chr: "chr7",
                            start: 244000,
                            end: 246000,
                            score: 7.66958622650809
                        },
                        // {
                        //     chr1: "chr7",
                        //     start1: 260000,
                        //     end1: 262000,
                        //     chr2: "chr7",
                        //     start2: 244000,
                        //     end2: 246000,
                        //     score: 31.73754891026957
                        // },
                        // {
                        //     chr1: "chr7",
                        //     start1: 260000,
                        //     end1: 262000,
                        //     chr2: "chr7",
                        //     start2: 254000,
                        //     end2: 256000,
                        //     score: 23.603800652944265
                        // },
                        // {
                        //     chr1: "chr7",
                        //     start1: 260000,
                        //     end1: 262000,
                        //     chr2: "chr7",
                        //     start2: 254000,
                        //     end2: 256000,
                        //     score: 94.08941028970075
                        // },
                        // {
                        //     chr1: "chr7",
                        //     start1: 260000,
                        //     end1: 262000,
                        //     chr2: "chr7",
                        //     start2: 256000,
                        //     end2: 258000,
                        //     score: 8.789965388637482
                        // },
                        // {
                        //     chr1: "chr7",
                        //     start1: 260000,
                        //     end1: 262000,
                        //     chr2: "chr7",
                        //     start2: 256000,
                        //     end2: 258000,
                        //     score: 38.1681302257195
                        // }
                    ]
                },
                {
                    type: "annotation",
                    format: "bed",
                    features: [
                        {
                            chr: `chr${variant.Chr}`,
                            start: variant.Start,
                            end: variant.End,
                            name: `${variant.RSID}`
                        }
                    ],
                    name: `${variant.RSID}`,
                    height: 50,
                },
                {
                    type: "annotation",
                    format: "bed",
                    url: promoter_like_url,
                    height: 50,
                    name: "Promoter-like-region",
                    displayMode: "EXPANDED",
                },
                    {
                      type: "annotation",
                      format: "gff3",
                    //   format: "gft",
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
                    name: "ATAC-seq",
                },
                {
                    type: "wig",
                    format: "bigwig",
                    url: dnase_url,
                    height: 50,
                    name: "DNase-seq",
                },
                {
                    type: "annotation",
                    format: "bed",
                    url: chromHMM_url,
                    height: 50,
                    name: "ChromHMM",
                    displayMode: "EXPANDED",
                },
                {
                    type: "wig",
                    format: "bigwig",
                    url: H3k27ac_url,
                    height: 50,
                    name: "H3k27ac",
                    color: "rgb(252, 202, 3)",
                },
                {
                    type: "wig",
                    format: "bigwig",
                    url: H3k4me1_url,
                    height: 50,
                    name: "H3k4me1",
                    color: "rgb(252, 202, 3)",
                },
                {
                    type: "wig",
                    format: "bigwig",
                    url: H3k4me3_url,
                    height: 50,
                    name: "H3k4me3",
                    color: "rgb(252, 74, 3)",
                },
                {
                    type: "wig",
                    format: "bigwig",
                    url: rnaseq_url,
                    height: 50,
                    name: "RNA-seq",
                },
                {
                    url: "/igv/GeneHancer.bb",
                    type: "annotation",
                    format: "bb",
                    name: "GeneHancer",
                    showBlocks: true,
                    height: 50
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
            // showCursorTrackingGuide: true,  // Add this line to enable cursor tracking
            // showCenterGuide: true,  // Add this line to enable the center guide
            log: true
        };

        igv.createBrowser(igvDiv.current, options)
            .then(function (browser) {
            console.log("Created IGV browser");
            // console.log("ROI", options.roi);
        });

    }, [variant, celltype, locus])

    return (
        <div>
            <div ref={igvDiv} style={{ height: '500px', width: '100%',  marginBottom: '500px' }}></div>
        </div>
    )
};

export default IgvVariantWithPromoter;