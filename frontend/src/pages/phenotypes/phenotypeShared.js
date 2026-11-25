// Shared settings for the phenotype search pages.

// key: cell name in the phenotype-search data; label: shown on the page; igv: cell-type folder of the IGV tracks
export const CELLS = [
    { key: "hMSC", label: "hMSC", igv: "hMSC" },
    { key: "osteoblast", label: "Osteoblast", igv: "Osteoblast" },
    { key: "osteocyte", label: "Osteocyte-lineage", igv: "Osteocyte" },
    { key: "myoblast", label: "Myoblast", igv: "Myoblast" },
    { key: "myotube", label: "Myotube", igv: "Myotube" },
];

// CisLink-Base recall-based thresholds (CisLink v1.5)
export const T70 = 0.23;
export const T50 = 0.476;

// white -> dark blue by CisLink score (0-1)
export const scoreColor = (s) => {
    if (s === undefined || s === null) return "#f5f5f5";
    const t = Math.max(0, Math.min(1, s));
    const c = (a, b) => Math.round(a + (b - a) * t);
    return `rgb(${c(255, 34)}, ${c(255, 78)}, ${c(255, 140)})`;
};

export const textColor = (s) => (s !== undefined && s !== null && s > 0.55 ? "white" : "black");

export const fmtScore = (s) => (s === undefined || s === null ? "" : s.toFixed(2));
