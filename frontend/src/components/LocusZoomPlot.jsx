import React, { useEffect, useRef } from "react";
import LocusZoom from "locuszoom";
import "locuszoom/dist/locuszoom.css";

// Regional association plot of one locus (LocusZoom.js): -log10 p coloured by r2 to the locus lead, credible-set PIPs,
// and genes. `assoc` is the columnar locus data from /phenotypes/loci/:id/assoc.
const LD_BREAKS = [0, 0.2, 0.4, 0.6, 0.8];
const LD_COLORS = ["#357ebd", "#46b8da", "#5cb85c", "#eea236", "#d43f3a"];

const LocusZoomPlot = ({ assoc, onVariantClick }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!assoc || !ref.current) return;
        const records = assoc.pos.map((p, i) => ({
            variant: `${assoc.chrom}:${p}_${assoc.nea[i]}/${assoc.ea[i]}`,
            position: p,
            rsid: assoc.rsid[i],
            log_pvalue: assoc.log_pvalue[i],
            r2: assoc.r2[i],
            pip: assoc.pip[i],
            is_ld_ref: p === assoc.ld_ref_pos,
        }));

        const sources = new LocusZoom.DataSources()
            .add("assoc", ["StaticSource", { data: records }])
            .add("gene", ["GeneLZ", { url: "https://portaldev.sph.umich.edu/api/v1/annotation/genes/", build: "GRCh38" }]);

        const tooltip = {
            closable: true,
            show: { or: ["highlighted", "selected"] },
            hide: { and: ["unhighlighted", "unselected"] },
            html: "<strong>{{assoc:rsid}}</strong> ({{assoc:variant}})<br>"
                + "-log10 p: {{assoc:log_pvalue}}<br>r&sup2; to lead: {{assoc:r2}}<br>PIP: {{assoc:pip}}",
        };
        const behaviors = {
            onmouseover: [{ action: "set", status: "highlighted" }],
            onmouseout: [{ action: "unset", status: "highlighted" }],
            onclick: [{ action: "toggle", status: "selected", exclusive: true }],
        };
        const ldColor = [
            { scale_function: "if", field: "assoc:is_ld_ref", parameters: { field_value: true, then: "#9632b8" } },
            { scale_function: "numerical_bin", field: "assoc:r2",
              parameters: { breaks: LD_BREAKS, values: LD_COLORS, null_value: "#B8B8B8" } },
        ];
        const legend = [
            { shape: "diamond", color: "#9632b8", size: 40, label: "LD ref", class: "lz-data_layer-scatter" },
            ...LD_COLORS.slice().reverse().map((c, i) => ({
                shape: "circle", color: c, size: 40, class: "lz-data_layer-scatter",
                label: `${LD_BREAKS[4 - i].toFixed(1)}–${(LD_BREAKS[4 - i] + 0.2).toFixed(1)}`,
            })),
            { shape: "circle", color: "#B8B8B8", size: 40, label: "no r² info", class: "lz-data_layer-scatter" },
        ];

        const genes = LocusZoom.Layouts.get("panel", "genes");
        genes.data_layers[0].namespace = { gene: "gene" };
        genes.data_layers[0].data_operations = [{ type: "fetch", from: ["gene"] }];

        const layout = {
            width: 900,
            responsive_resize: true,
            state: { chr: assoc.chrom, start: assoc.start, end: assoc.end },
            panels: [
                {
                    id: "association",
                    height: 300,
                    margin: { top: 35, right: 55, bottom: 40, left: 55 },
                    inner_border: "rgb(210, 210, 210)",
                    axes: {
                        x: { label: `Chromosome ${assoc.chrom} (Mb, GRCh38)`, label_offset: 32, tick_format: "region", extent: "state" },
                        y1: { label: "-log10 p", label_offset: 30 },
                    },
                    interaction: { drag_background_to_pan: true, scroll_to_zoom: true, x_linked: true },
                    legend: { orientation: "vertical", origin: { x: 60, y: 40 }, hidden: false },
                    data_layers: [
                        { id: "significance", type: "orthogonal_line", orientation: "horizontal", offset: 7.30103 },
                        {
                            id: "associationpvalues",
                            namespace: { assoc: "assoc" },
                            type: "scatter",
                            id_field: "assoc:variant",
                            x_axis: { field: "assoc:position" },
                            y_axis: { axis: 1, field: "assoc:log_pvalue", floor: 0, upper_buffer: 0.1 },
                            point_shape: [{ scale_function: "if", field: "assoc:is_ld_ref", parameters: { field_value: true, then: "diamond" } }, "circle"],
                            point_size: 40,
                            color: ldColor,
                            legend,
                            tooltip,
                            behaviors,
                        },
                    ],
                },
                {
                    id: "pip",
                    height: 130,
                    margin: { top: 15, right: 55, bottom: 20, left: 55 },
                    inner_border: "rgb(210, 210, 210)",
                    axes: { x: { extent: "state", render: false }, y1: { label: "PIP", label_offset: 30 } },
                    interaction: { drag_background_to_pan: true, scroll_to_zoom: true, x_linked: true },
                    data_layers: [
                        {
                            id: "pipvalues",
                            namespace: { assoc: "assoc" },
                            type: "scatter",
                            id_field: "assoc:variant",
                            filters: [{ field: "assoc:pip", operator: "!=", value: null }],
                            x_axis: { field: "assoc:position" },
                            y_axis: { axis: 1, field: "assoc:pip", floor: 0, ceiling: 1 },
                            point_size: 40,
                            color: ldColor,
                            tooltip,
                            behaviors,
                        },
                    ],
                },
                genes,
            ],
        };

        ref.current.innerHTML = "";
        const id = `lz-${assoc.locus_id}`;
        ref.current.id = id;
        const plot = LocusZoom.populate(`#${id}`, sources, layout);
        if (onVariantClick) {
            plot.on("element_clicked", (e) => {
                const d = e.data && e.data.data;
                if (d && d["assoc:rsid"]) onVariantClick(d["assoc:rsid"]);
            });
        }
        return () => {
            if (ref.current) ref.current.innerHTML = "";
        };
    }, [assoc]);

    return <div ref={ref} className="locuszoom-container" />;
};

export default LocusZoomPlot;
