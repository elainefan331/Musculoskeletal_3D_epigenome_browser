import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CELLS, T70, scoreColor, textColor, fmtScore } from "./phenotypeShared.js";
import "./phenotypes.css";

const PAGE_SIZE = 25;

// /phenotypes/:Id: the phenotype's fine-mapped loci, each with its best-scoring gene in every cell type
const Phenotype = () => {
    const { Id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(0);

    useEffect(() => {
        setData(null);
        fetch(`${import.meta.env.VITE_EXPRESS_URL}/phenotypes/${encodeURIComponent(Id)}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
            .then(setData)
            .catch((status) => setError(status === 404 ? `Phenotype not found: ${Id}` : "Could not load the phenotype"));
    }, [Id]);

    const loci = useMemo(() => {
        if (!data) return [];
        const q = filter.trim().toUpperCase();
        if (!q) return data.loci;
        return data.loci.filter((l) => l.lead_rsid?.toUpperCase().includes(q)
            || l.candidate_genes.some((g) => g.toUpperCase() === q || (q.length > 2 && g.toUpperCase().startsWith(q))));
    }, [data, filter]);

    if (error) return <h1 className="phenotype-h1">{error}</h1>;
    if (!data) return <h1 className="phenotype-h1">Loading...</h1>;
    const { phenotype } = data;
    const pages = Math.max(1, Math.ceil(loci.length / PAGE_SIZE));
    const shown = loci.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
        <div className="phenotype-page">
            <h1 className="phenotype-h1">{phenotype.name}</h1>
            <p className="phenotype-note">
                {phenotype.n_loci} loci, {phenotype.n_credible_sets} 95% credible sets. Fine-mapping: {phenotype.finemapping}
                {" "}(N = {phenotype.finemapping_n?.toLocaleString()}). Locus plots: {phenotype.locus_plot_sumstats}.
                {" "}<a className="phenotype-link" target="_blank" rel="noreferrer"
                    href={`https://msk.hugeamp.org/phenotype.html?phenotype=${phenotype.mskkp_phenotype}`}>
                    View in the Musculoskeletal Knowledge Portal</a>
            </p>
            <p className="phenotype-note">
                Each cell shows the best CisLink-Base target gene of the locus in that cell type (darker = higher score;
                bold = above the 70%-recall threshold). Scores rank candidate genes; they are not probabilities in these cells.
            </p>
            <div className="phenotype-toolbar">
                <input className="phenotype-filter" placeholder="Filter by candidate gene or lead rsID" value={filter}
                    onChange={(e) => { setFilter(e.target.value); setPage(0); }} />
                <span>{loci.length} loci</span>
            </div>
            <div className="table-wrapper">
                <table className="table phenotype-table">
                    <thead>
                        <tr>
                            <th>LOCUS</th>
                            <th>REGION (GRCh38)</th>
                            <th>LEAD</th>
                            <th>-LOG10 P</th>
                            <th>CREDIBLE SETS</th>
                            {CELLS.map((c) => <th key={c.key}>{c.label.toUpperCase()}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((l) => (
                            <tr key={l.locus_id}>
                                <td><Link className="phenotype-link" to={`/loci/${l.locus_id}`}>{l.locus_id}</Link></td>
                                <td>{l.chrom}:{l.start.toLocaleString()}-{l.end.toLocaleString()}</td>
                                <td>{l.lead_rsid}</td>
                                <td>{l.top_log_pvalue?.toFixed(1)}</td>
                                <td>{l.n_credible_sets}</td>
                                {CELLS.map((c) => {
                                    const t = l.top_genes[c.key];
                                    return (
                                        <td key={c.key} className="heat-cell"
                                            style={{ background: scoreColor(t?.score), color: textColor(t?.score),
                                                     fontWeight: t && t.score >= T70 ? "bold" : "normal" }}
                                            title={t ? `${t.gene} ${fmtScore(t.score)}` : ""}>
                                            {t?.gene}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="phenotype-pager">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                <span>Page {page + 1} of {pages}</span>
                <button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default Phenotype;
