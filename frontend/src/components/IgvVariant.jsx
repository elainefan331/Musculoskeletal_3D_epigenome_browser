import React, { useEffect, useRef, useState } from 'react';
import igv from 'igv';

const IgvVariant = ({variant, celltype}) => {
  const igvDiv = useRef(null);
  // const [browser, setBrowser] = useState(null);
  const start = variant.Start - 50000;
  const end = variant.End + 50000;
  const locus = `chr${variant.Chr}:${start}-${end}`;
  console.log("celltype", celltype);
  let promoter_like_url = "/igv/promoter/promoter_like_regions_annotation_sorted.bed";
  let genecode_url = "/igv/gencode.v35.annotation.sort.gtf.gz";
  let genecode_index_url = "/igv/gencode.v35.annotation.sort.gtf.gz.tbi";
  let atac_url = `/igv/bigwig/${celltype}/ATAC_seq_${celltype}_pvalue.bigwig`;
  let dnase_url = `/igv/bigwig/${celltype}/DNase_seq_${celltype}.bigWig`;
  let chromHMM_url = `/igv/bigwig/${celltype}/imputed12marks_hg38lift_dense.bed`;
  let H3k27ac_url = `/igv/bigwig/${celltype}/H3K27ac_${celltype}_pvalue.bigWig`;
  let H3k4me3_url = `/igv/bigwig/${celltype}/H3K4me3_${celltype}_pvalue.bigWig`;
  let H3k4me1_url = `/igv/bigwig/${celltype}/H3K4me1_${celltype}_pvalue.bigWig`;
  let rnaseq_url = `/igv/bigwig/${celltype}/rep1PE_stranded_genome_plusAll.bw`;
  console.log("locus", locus)


  useEffect(() => {
    const options = {
      genome: "hg38",
      // locus: "chr8:127,736,588-127,739,371",
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
        // {
        //   type: "annotation",
        //   format: "gtf",
        //   url: genecode_url,
        //   indexURL: genecode_index_url,
        //   displayMode: "EXPANDED",
        //   name: "Gencode v35 (gtf)",
        //   visibilityWindow: 10000000,
        //   height: 150,
        // },
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
      // showCenterGuide: true,  // Add this line to enable the center guide
      // showCursorTrackingGuide: true,  // Add this line to enable cursor tracking
      log: true
    };

    igv.createBrowser(igvDiv.current, options)
      .then(function (browser) {
        console.log("Created IGV browser");
        console.log("ROI", options.roi);
      });
    // const createBrowser = async () => {
    //   if (igvDiv.current) {
    //     if(browser) {
    //       await browser.removeAllTracks();
    //       browser.dispose();
    //     }
    //     const newBrowser = await igv.createBrowser(igvDiv.current, options);
    //     setBrowser(newBrowser);
    //     console.log("Created IGV browser");
    //   }
    // };
    
    // createBrowser();

    // return () => {
    //   if (browser) {
    //       browser.removeAllTracks();
    //       browser.dispose();
    //       setBrowser(null);
    //   }
    // };

  }, [variant, celltype, locus]);

  return (
    <div>
      <div ref={igvDiv} style={{ height: '500px', width: '100%',  marginBottom: '150px' }}></div>
    </div>
  );
};

export default IgvVariant;
