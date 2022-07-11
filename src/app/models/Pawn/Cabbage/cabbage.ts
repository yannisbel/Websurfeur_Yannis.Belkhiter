import * as d3 from 'd3';
import { GameService } from 'src/app/services/game/game.service';
import { GraphService } from 'src/app/services/graph/graph.service';
import { RunawayStrategy } from '../../Strategy/Thief/RunawayStrategy/runaway-strategy';
import { Pawns } from '../pawn';

export class Cabbage extends Pawns {

    /**
     * Concrete Pawn object
     * @param gameM 
     * @param graphServ 
     * @param {number} x - X position of the pawn when drawed for the first time on a canvas
     * @param {number} y - Y position of the pawn when drawed for the first time on a canvas
     */
    constructor(private gameM: GameService, private graphServ: GraphService, x: number, y: number){
        super(gameM, graphServ, x, y);
        this.role = "cabbage"
        this.strategy = new RunawayStrategy();
        d3.select("svg")
        .append('circle')
            .datum(this)
            .attr("class", "pawns "+ this.role)
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.radius)
            .attr("fill", "url(#pawnThiefImage)")
            .call(d3.drag()
                .on("start", this.dragstarted.bind(this))
                .on("drag", this.dragged.bind(this))
                .on("end", this.dragended.bind(this)));

    }

    updatePosition(node) {
        if(node) this.gameM.updateCabbagePosition(this, node);
    }
}