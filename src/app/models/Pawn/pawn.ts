import * as d3 from 'd3';
import { GameService } from 'src/app/services/game/game.service';
import { environment } from 'src/environments/environment';
import { Graph } from '../Graph/graph';
import { PawnState } from '../PawnState/pawn-state';
import { PawnStateOnTurn } from '../PawnState/PawnStateOnTurn/pawn-state-on-turn';
import { IStrategy } from '../Strategy/istrategy';

/* Represent the main pawn (the goat, the web surfeur, etc.) */

export class Pawn {
    private role: string;
    private x: number;
    private y: number;
    private last_position: { index: number, x: number, y: number };
    private setted_position: boolean = false;
    private radius: number = 40;
    private detect_radius: number = 45;
    private state: PawnState
    private id: string;
    private graph: Graph;
    private gameService: GameService
    private strategy!: IStrategy;

    constructor(role: string, start_point: { index: number, x: number, y: number }, graph: Graph, gameService: GameService) {
        this.role = role;
        this.x = start_point.x;
        this.y = start_point.y;
        this.state = environment.pawnWaitingTurn;
        this.id = `${role}-pawn`
        this.graph = graph;
        this.gameService = gameService;

        this.last_position = start_point;

        d3.select('#mainBoard')
            .append('circle')
            .attr('class', role)
            .attr('id', this.id)
            .attr('fill', `url(#${role})`)
            .attr('r', 30)
            .attr('cx', this.x)
            .attr('cy', this.y)
            .call(d3.drag()
                    .on('start', this.dragstarted.bind(this))
                    .on('drag', this.dragged.bind(this))
                    .on('end', this.dragended.bind(this)) as any)
    }



    dragstarted(event: any) {
        this.state.dragstarted(event, this);
    }

    dragged(event: any) {
        this.state.dragged(event, this);
    }

    dragended(event: any) {
        this.state = this.state.dragended(event, this);
        /* console.log('STATE UPDATED'); */
    }

    setState(state: PawnState) {
        this.state = state;
    }

    getState(): PawnState {
        return this.state
    }

    getPosition(): {index: number, x: number, y: number} {
        return this.last_position
    }



    place(graph, goat, thiefs = []) {
        //console.log('PLACING')
        const pos = this.strategy.placement(graph, goat, thiefs);
        d3.select('.'+this.role)
            .attr("cx", this.x = pos.x)
            .attr("cy", this.y = pos.y)
            .raise();
        this.lastSlot = pos;
        this.settedPosition = true;
        this.firstMove = false;
        this.state = environment.waitingTurnState;
    }

    /**
     * TODO
     * @param graph 
     * @param cops 
     * @param thiefs 
     */
    move(graph, cops = [], thiefs = [], c = undefined) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.moveCallback(graph, cops, thiefs)
                resolve(true);
            }, 2000)
        })
    }

    protected moveCallback(graph, cops, thiefs) {
        const speed = this.role.includes('cabbage') ? this.gameManager.getCollectSpeed() : 1;
        const pos = this.strategy.move(graph, cops, thiefs, speed);
        /* console.log('THIS', this);
        console.log('POS', pos) */
        d3.select('.'+this.role)
            .attr("cx", this.x = pos.x)
            .attr("cy", this.y = pos.y)
            .raise();
        this.lastSlot = pos;
        this.settedPosition = true;
        this.firstMove = false;
        this.state = environment.waitingTurnState;
    }


}
