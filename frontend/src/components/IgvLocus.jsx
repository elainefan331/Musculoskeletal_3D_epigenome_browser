import React, { useEffect, useRef } from "react";
import igv from "igv";

// 3D view of a locus in one cell type: the cell's accessibility and H3K27ac, credible-set variants (shaded by PIP) and
// CisLink-Base links from each credible set's driving variant to the TSS of its candidate genes (arc height = score).
// Genes: one row per protein-coding gene (GENCODE v29, as CisLink), instead of IGV's default "Refseq All", which puts
// every transcript on its own row so most genes and their names fall outside the track.
const IgvLocus = ({ chrom, start, end, variants, genes, cell }) => {
    const igvDiv = useRef(null);

    useEffect(() => {
        if (!igvDiv.current) return;
        const base = `${import.meta.env.VITE_EXPRESS_URL}/public/igv/bigwig/${cell.igv}`;
        const csFeatures = variants.map((v) => ({
            chr: `chr${chrom}`,
            start: v.pos38 - 1,
            end: v.pos38,
            name: `${v.rsid} PIP ${v.pip.toFixed(3)}`,
            color: `rgba(150, 50, 184, ${Math.max(0.15, v.pip)})`,
        }));
        const arcs = genes
            .filter((g) => g.cell === cell.key && g.tss)
            .map((g) => {
                const p = Number(g.driver_variant.split("-")[1]);
                const [a, b] = p < g.tss ? [p, g.tss] : [g.tss, p];
                return {
                    chr: `chr${chrom}`, start: a - 1, end: b,
                    chr1: `chr${chrom}`, start1: p - 1, end1: p,
                    chr2: `chr${chrom}`, start2: g.tss - 1, end2: g.tss,
                    name: `${g.gene} ${g.score.toFixed(2)}`,
                    score: g.score,
                };
            });
        const signal = [
            { name: `ATAC-seq (${cell.label})`, url: `${base}/ATAC_seq_${cell.igv}_pvalue.bigwig` },
            { name: `H3K27ac (${cell.label})`, url: `${base}/H3K27ac_${cell.igv}_pvalue.bigWig` },
        ];
        let browser;
        let cancelled = false;
        // keep only signal tracks the server has (not every cell type has every track yet); IGV shows an error
        // dialog for a missing file
        Promise.all(signal.map((t) => fetch(t.url, { method: "HEAD" }).then((r) => r.ok).catch(() => false)))
            .then((ok) => {
                if (cancelled) return null;
                const options = {
                    genome: "hg38",
                    locus: `chr${chrom}:${start}-${end}`,
                    tracks: [
                        ...signal.filter((t, i) => ok[i]).map((t) => ({ ...t, type: "wig", format: "bigwig", height: 50 })),
                        { name: "Credible-set variants (PIP)", type: "annotation", displayMode: "EXPANDED", features: csFeatures, height: 60 },
                        { name: `CisLink-Base links (${cell.label})`, type: "interact", features: arcs, arcType: "proportional",
                          useScore: true, min: 0, max: 1, color: "rgb(34, 78, 140)", height: 120 },
                        { name: "Genes (GENCODE v29, protein-coding)", type: "annotation", format: "bed",
                          url: `${import.meta.env.VITE_EXPRESS_URL}/public/igv/annotation/gencode_v29_protein_coding_genes.bed.gz`,
                          displayMode: "EXPANDED", color: "rgb(0, 0, 150)", height: 90 },
                    ],
                };
                return igv.createBrowser(igvDiv.current, options);
            })
            .then((b) => {
                if (b) b.removeTrackByName("Refseq All");
                return b;
            })
            .then((b) => {
                if (b && cancelled) igv.removeBrowser(b);
                else browser = b;
            });
        return () => {
            cancelled = true;
            if (browser) igv.removeBrowser(browser);
        };
    }, [chrom, start, end, variants, genes, cell]);

    return <div ref={igvDiv} style={{ width: "100%" }} />;
};

export default IgvLocus;
