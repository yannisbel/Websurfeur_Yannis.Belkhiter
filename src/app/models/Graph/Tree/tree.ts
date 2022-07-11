import * as d3 from 'd3';
import { Graph } from '../graph';

export class Tree extends Graph {
    constructor(nodes: any, links: any) {
        super(nodes, links, "tree");
    }

    /**
     * Initialise the d3 force simulation to work with a network
     * @param svg d3 selection of an html svg
     */
    simulate(svg: any) {
        const width = parseInt(svg.style("width"), 10);
        const height = parseInt(svg.style("height"), 10);
        this.simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink()
                .links(this.links)
            )
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("charge", d3.forceManyBody().strength(-500))
            .on("tick", this.ticked.bind(this));
    }

    stop() {
        this.simulation.stop();
    }
    
    /**
     * Function needed for the placement of the nodes and links in the d3 force simulation
     */
    ticked() {
        this.svgLinks
            .attr("x1", function(d: any) { return d.source.x; })
            .attr("y1", function(d: any) { return d.source.y; })
            .attr("x2", function(d: any) { return d.target.x; })
            .attr("y2", function(d: any) { return d.target.y; });

        this.svgNodes
            .attr("cx", function (d: any) { return d.x; })
            .attr("cy", function(d: any) { return d.y; });
    }
}
