import * as d3 from 'd3';
import { Graph } from '../graph';

export class Grid extends Graph {

    private _grid_width: number;
    get width(): number {
        return this._grid_width;
    }

    private _grid_height: number;
    get height(): number {
        return this._grid_height;
    }

    /**
     * Inner class to make a grid layer to help at positionate the nodes of the graph on it
     */
    private grid = {
        /**
         * list of the cells where the graph's nodes will be positionated
         */
        cells: [],

        /**
         * Function to initialise an inner grid object of a graph, it will divide a canvas into a proportionated grid
         * @param tab_width width of the grid
         * @param tab_height haight of the grid
         * @param canvas_width width of the d3 selection of an html svg canvas where the graph gonna be drawwed
         * @param canvas_height height of the d3 selection of an html svg canvas where the graph gonna be drawwed
         */
        init: function(tab_width, tab_height, canvas_width, canvas_height) {
            this.cells = [];
            for (let row = 0 ; row < tab_height ; ++row) {
                const y = row * canvas_height/tab_height + (canvas_height/tab_height)/2;
                for (let col = 0 ; col < tab_width ; ++col) {
                    const x = col * canvas_width/tab_width + (canvas_width/tab_width)/2;
                    this.cells.push({
                        id: row*tab_width+col,
                        x: x,
                        y: y,
                        occupied: false
                    })
                }
            }
        },
    
        /**
         * Get the cell corresponding to a node from the graph
         * @param d data extracted of a d3 node created with a d3.force simulation
         * @returns the cell wich correspond to the inputed data index
         */
        getCell: function (d) {
          return this.cells[d.index];
        }
    }

    constructor(nodes, links, width: number, height: number) {
        super(nodes, links, "grid");
        this._grid_width = width;
        this._grid_height = height;
    }

    /**
     * The draw() function is overrided here beacause we need a particular behavior to draw a grid
     * @param svg d3 selection of an html svg
     */
    draw(svg: any) {

        // Get the size of the canvas
        const canvas_width = parseInt(svg.style("width"), 10);
        const canvas_height = parseInt(svg.style("height"), 10);

        // Initialize the inner grid object
        this.grid.init(this._grid_width, this._grid_height, canvas_width, canvas_height);
        
        // Draw Horizontal lines
        for (let row = 0 ; row < this._grid_height ; ++row) {
            const y = row * canvas_height/this._grid_height + (canvas_height/this._grid_height)/2;
            const x1 = (canvas_width/this._grid_width)/2;
            const x2 = canvas_width - (canvas_width/this._grid_width)/2;
            svg.append('line')
                .attr('x1', x1)
                .attr('y1', y)
                .attr('x2', x2)
                .attr('y2', y)
                .style('stroke', 'rgb(170, 170, 170)')
        }

        //Draw vertical lines
        for (let col = 0 ; col < this._grid_width ; ++col) {
            const x = col * canvas_width/this._grid_width + (canvas_width/this._grid_width)/2;
            const y1 = (canvas_height/this._grid_height)/2;
            const y2 = canvas_height - (canvas_height/this._grid_height)/2;
            svg.append('line')
                .attr('x1', x)
                .attr('y1', y1)
                .attr('x2', x)
                .attr('y2', y2)
                .style('stroke', 'rgb(170, 170, 170)')
        }

        // Generates links for the d3 force simulation but don't draw them
        this.svgLinks = svg.selectAll("links")
            .data(this.links)
            .join("line")

        // Generates nodes for the d3 force simulation and draw them
        this.svgNodes = svg.selectAll("nodes")
            .data(this.nodes)
            .join("circle")
                .attr("r", 20)
                .attr("class", "circle")
                .style("fill", "#69b3a2")
                //.attr("index", d => d.index)
        
        // This function will positionnate all the nodes to the good place on the canvas
        this.simulate(svg);

    }

    /**
     * Initialise the d3 force simulation to work with a network
     * @param svg d3 selection of an html svg
     */
    simulate(svg: any) {
        this.simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink()
                .links(this.links)
            )
            .on("tick", this.ticked.bind(this));
    }

    stop() {

    }
    
    /**
     * For a grid, this function is important because it will place the nodes of the graph on the inner grid object
     * to have a good grid printed on the canvas screen
     */
    ticked() {
        this.svgLinks
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        this.svgNodes
            // Here the important placement of the graph nodes on the grid
            .each( (d) => {
                let gridpoint = this.grid.getCell(d);
                if (gridpoint) {
                d.x += (gridpoint.x - d.x);
                d.y += (gridpoint.y - d.y);
                }
            })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }
}