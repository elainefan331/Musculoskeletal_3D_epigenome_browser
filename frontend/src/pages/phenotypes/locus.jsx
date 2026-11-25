import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import LocusZoomPlot from "../../components/LocusZoomPlot.jsx";
import IgvLocus from "../../components/IgvLocus.jsx";
import { CELLS, T70, T50, scoreColor, textColor, fmtScore } from "./phenotypeShared.js";
import "./phenotypes.css";

const VARIANTS_SHOWN = 10;

// /loci/:Id: locus plot, candidate genes x 5 cell types, credible sets, and the 3D view in one cell type
const Locus = () => {
    const { Id } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [assoc, setAssoc] = useState(null);
    const [error, setError] = useState("");
    const [csFilter, setCsFilter] = useState("all");
    const [cellKey, setCellKey] = useState(
        CELLS.find((c) => c.igv.toLowerCase() === (params.get("celltype") || "").toLowerCase())?.key || "osteoblast");
    const [openSets, setOpenSets] = useState({});

    useEffect(() => {
        setData(null);
        setAssoc(null);
        const api = import.meta.env.VITE_EXPRESS_URL;
        fetch(`${api}/phenotypes/loci/${encodeURIComponent(Id)}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
            .then(setData)
            .catch((status) => setError(status === 404 ? `Locus not found: ${Id}` : "Could not load the locus"));
        fetch(`${api}/phenotypes/loci/${encodeURIComponent(Id)}/assoc`)
            .then((res) => (res.ok ? res.json() : null))
            .then(setAssoc);
    }, [Id]);

    const cell = CELLS.find((c) => c.key === cellKey);

    // one row per gene: best score in each cell (within the chosen credible set), driving variant of the best score
    const geneRows = useMemo(() => {
        if (!data) return [];
        const rows = {};
        for (const g of data.genes) {
            if (csFilter !== "all" && g.cs_uid !== csFilter) continue;
            const r = (rows[g.gene] ??= { gene: g.gene, cells: {}, best: g });
            if (!r.cells[g.cell] || g.score > r.cells[g.cell].score) r.cells[g.cell] = g;
            if (g.score > r.best.score) r.best = g;
            r.is_nearest = r.is_nearest || g.is_nearest;
        }
        return Object.values(rows).sort((a, b) => b.best.score - a.best.score);
    }, [data, csFilter]);

    const variantsBySet = useMemo(() => {
        const m = {};
        for (const v of data?.variants || []) (m[v.cs_uid] ??= []).push(v);
        return m;
    }, [data]);

    if (error) return <h1 className="phenotype-h1">{error}</h1>;
    if (!data) return <h1 className="phenotype-h1">Loading...</h1>;
    const { phenotype, locus, variants, genes } = data;
    const pad = 50000;
    const view = { start: Math.max(1, locus.start - pad), end: locus.end + pad };
    const toVariant = (rsid) => navigate(`/variants/${rsid}?celltype=${cell.igv}`);

    return (
        <div className="phenotype-page">
            <h1 className="phenotype-h1">
                <Link className="phenotype-link" to={`/phenotypes/${phenotype.phenotype_id}`}>{phenotype.name}</Link>
                {" "}· {locus.locus_id}
            </h1>
            <p className="phenotype-note">
                {locus.chrom}:{locus.start.toLocaleString()}-{locus.end.toLocaleString()} (GRCh38) · lead {locus.lead_rsid}
                {" "}· -log10 p {locus.top_log_pvalue?.toFixed(1)} · {locus.n_credible_sets} credible set(s)
            </p>

            <h2 className="phenotype-h2">Regional association</h2>
            <p className="phenotype-note">
                Colour: r² to the lead variant (1000 Genomes EUR, for display). Lower panel: posterior inclusion
                probability (PIP) of credible-set variants. Click a point, then open it on the variant page.
            </p>
            {assoc ? <LocusZoomPlot assoc={assoc} onVariantClick={toVariant} /> : <p>Loading the locus plot...</p>}

            <h2 className="phenotype-h2">Candidate target genes (CisLink-Base)</h2>
            <div className="phenotype-toolbar">
                <label>Credible set{" "}
                    <select value={csFilter} onChange={(e) => setCsFilter(e.target.value)}>
                        <option value="all">All credible sets</option>
                        {locus.credible_sets.map((s, i) => (
                            <option key={s.cs_uid} value={s.cs_uid}>
                                {`#${i + 1}: lead ${s.lead_rsid}, ${s.n_variants} variants, max PIP ${s.max_pip.toFixed(2)}`}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="table-wrapper">
                <table className="table phenotype-table">
                    <thead>
                        <tr>
                            <th>GENE</th>
                            {CELLS.map((c) => <th key={c.key}>{c.label.toUpperCase()}</th>)}
                            <th>DRIVING VARIANT</th>
                            <th>PIP</th>
                            <th>DISTANCE TO TSS</th>
                            <th>NEAREST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {geneRows.map((r) => (
                            <tr key={r.gene}>
                                <td><Link className="phenotype-link" to={`/genes/${r.gene}?celltype=${cell.igv}`}>{r.gene}</Link></td>
                                {CELLS.map((c) => {
                                    const s = r.cells[c.key]?.score;
                                    return (
                                        <td key={c.key} className="heat-cell"
                                            style={{ background: scoreColor(s), color: textColor(s), fontWeight: s >= T70 ? "bold" : "normal" }}>
                                            {fmtScore(s)}{s >= T50 ? " ★" : ""}
                                        </td>
                                    );
                                })}
                                <td>{r.best.driver_variant}</td>
                                <td>{r.best.driver_pip?.toFixed(3)}</td>
                                <td>{r.best.distance?.toLocaleString()}</td>
                                <td>{r.is_nearest ? "yes" : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="phenotype-note">
                Bold: above the 70%-recall threshold ({T70}); ★ above the 50%-recall threshold ({T50}). A gene's score in a
                credible set is its best score over the set's variants. Scores rank candidates (K562 CRISPR scale) and are
                not probabilities in these cells. Osteocyte-lineage: H9-derived, in vitro differentiated cells.
            </p>

            <h2 className="phenotype-h2">Credible sets</h2>
            {locus.credible_sets.map((s, i) => {
                const vs = variantsBySet[s.cs_uid] || [];
                const open = openSets[s.cs_uid];
                return (
                    <div key={s.cs_uid} className="credible-set">
                        <button className="credible-set-toggle"
                            onClick={() => setOpenSets({ ...openSets, [s.cs_uid]: !open })}>
                            {open ? "▾" : "▸"} #{i + 1}: lead {s.lead_rsid} · {s.n_variants} variants · max PIP {s.max_pip.toFixed(3)}
                            {" "}· span {s.span_kb.toFixed(1)} kb{s.nearest_gene ? ` · nearest gene ${s.nearest_gene}` : ""}
                        </button>
                        {open && (
                            <table className="table phenotype-table">
                                <thead>
                                    <tr><th>RSID</th><th>VARIANT (GRCh38)</th><th>PIP (SuSiE)</th><th>PIP (FINEMAP)</th><th>MAF</th></tr>
                                </thead>
                                <tbody>
                                    {vs.slice(0, VARIANTS_SHOWN).map((v) => (
                                        <tr key={v.variant_hg38}>
                                            <td><Link className="phenotype-link" to={`/variants/${v.rsid}?celltype=${cell.igv}`}>{v.rsid}</Link></td>
                                            <td>{v.variant_hg38}</td>
                                            <td>{v.pip.toFixed(3)}</td>
                                            <td>{v.pip_finemap?.toFixed(3)}</td>
                                            <td>{v.maf?.toFixed(4)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {open && vs.length > VARIANTS_SHOWN && (
                            <p className="phenotype-note">Top {VARIANTS_SHOWN} of {vs.length} variants by PIP.</p>
                        )}
                    </div>
                );
            })}

            <h2 className="phenotype-h2">3D view</h2>
            <div className="phenotype-toolbar">
                <label>Cell type{" "}
                    <select value={cellKey} onChange={(e) => setCellKey(e.target.value)}>
                        {CELLS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                    </select>
                </label>
            </div>
            <IgvLocus chrom={locus.chrom.replace("chr", "")} start={view.start} end={view.end}
                variants={variants} genes={genes} cell={cell} />
        </div>
    );
};

export default Locus;
