import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./phenotypes.css";

// /phenotypes: musculoskeletal phenotypes grouped by category
const PhenotypeList = () => {
    const [phenotypes, setPhenotypes] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_EXPRESS_URL}/phenotypes`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
            .then(setPhenotypes)
            .catch(() => setError("Could not load phenotypes"));
    }, []);

    if (error) return <h1 className="phenotype-h1">{error}</h1>;
    if (!phenotypes) return <h1 className="phenotype-h1">Loading...</h1>;

    const byCategory = {};
    for (const p of phenotypes) {
        (byCategory[p.category] ??= []).push(p);
    }
    return (
        <div className="phenotype-page">
            <h1 className="phenotype-h1">Phenotypes</h1>
            <p className="phenotype-note">
                Musculoskeletal phenotypes curated by the Musculoskeletal Knowledge Portal. Tier 1 phenotypes have
                fine-mapped loci and predicted target genes in five cell types.
            </p>
            {Object.entries(byCategory).map(([category, list]) => (
                <section key={category}>
                    <h2 className="phenotype-h2">{category}</h2>
                    <ul className="phenotype-list">
                        {list.map((p) => (
                            <li key={p.phenotype_id}>
                                <Link to={`/phenotypes/${p.phenotype_id}`}>{p.name}</Link>
                                <span className="phenotype-meta">
                                    {p.n_loci} loci, {p.n_credible_sets} credible sets
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
};

export default PhenotypeList;
