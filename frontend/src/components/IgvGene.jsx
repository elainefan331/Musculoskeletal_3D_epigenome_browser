import { useEffect, useRef } from 'react';
import igv from 'igv';

const IgvGene = () => {
    const igvDiv = useRef(null);
    const igvBrowser = useRef(null);

    useEffect(() => {
        const options = {
            genome: "hg38",
            
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