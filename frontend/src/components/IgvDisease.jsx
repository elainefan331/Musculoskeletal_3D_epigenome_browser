import { useEffect, useRef } from 'react';
import igv from 'igv';

const IgvDisease = ({variant, celltype}) => {
    const igvDiv = useRef(null);
    const igvBrowser = useRef(null);
    const chr = variant.Variant.split(":")[0];
    
    
    const locus = `chr${chr}:${start}-${end}`;

    useEffect(() => {
        const options = {
            genome: "hg38",
            locus: locus,
            roi: [
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
    }, [variant, celltype, locus]);

    return (
        <div>
            <div ref={igvDiv} style={{ height: '500px', width: '100%',  marginBottom: '150px' }}></div>
        </div>
    )
}

export default IgvDisease;