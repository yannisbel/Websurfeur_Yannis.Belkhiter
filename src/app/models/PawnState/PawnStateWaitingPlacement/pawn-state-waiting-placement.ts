import * as d3 from 'd3';
import { environment } from 'src/environments/environment';
import { PawnState } from '../pawn-state';
import { PawnStateOnTurn } from '../PawnStateOnTurn/pawn-state-on-turn';
import { PawnStateWaitingTurn } from '../PawnStateWaitingTurn/pawn-state-waiting-turn';

export class PawnStateWaitingPlacement implements PawnState {

    edges: any = null;

    dragstarted(event: any, d: any) {
        d.lastPosX = event.x
        d.lastPosY = event.y
        d.settedPosition = false;
        d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event: any, d: any) {
        d3.select("."+d.role).attr("cx", event.x).attr("cy", event.y);
        if(d.graphService.gameMode === "easy"){
            let edges = this.edges
            d3.selectAll(".circle")
                .each((nodeData:any, id:any, elements:any) => {
                    let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
                    let distance = d.detectRadius;
                    if (h <= distance) {
                        d.graphService.showPossibleMove(elements[id]);
                    }
                })
        }
    }
    dragended(event: any, d: any): PawnState {

        d3.select(event.sourceEvent.target).attr("stroke", null);
        
        let position = {
            x: d.lastPosX,
            y: d.lastPosY,
        }

        let distance = d.detectRadius;
        let node;
        d3.selectAll(".circle").each((nodeData:any, id:any, elements:any) => {
            let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
            if (h <= distance 
                && ((d.role.includes('thief') && d.gameManager.copsArePlaced()) || d.role.includes('cops')) ) {
                node = nodeData;
                distance = h;
                position.x = nodeData.x;
                position.y = nodeData.y;
                d.settedPosition = true;
                d.possiblePoints = d.graphService.showPossibleMove(elements[id]);
                d.lastSlot = elements[id]
            }
        })

        d3.select("."+d.role).attr("cx", d.x = position.x).attr("cy", d.y = position.y);
        d.updatePosition(node)

        if (!d.settedPosition) {
            return this;
        } else {
            return environment.waitingTurnState; 
        }
    }
}
