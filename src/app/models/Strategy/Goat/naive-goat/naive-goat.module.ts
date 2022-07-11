import { NgModule } from '@angular/core';
import { IStrategy } from '../../istrategy';
import { CommonModule } from '@angular/common';
import { Graph } from 'src/app/models/Graph/graph';
import { GraphService } from 'src/app/services/graph/graph.service';
import { GameService } from 'src/app/services/game/game.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class NaiveGoat implements IStrategy {

  actual_place: any;

  action(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]): void {
    let closest;
        let distance = graph.nodes.length;
        let edges = graph.edges(this.actual_place);
        edges.push(this.actual_place);
        edges = edges.filter(e => (cabbage_positions_index.findIndex(e.index) !== -1))
        for(const e of edges) {
            let globalDist = 0;
            for(const t of cabbage_positions_index) {
                const d = graph.distance(e, t);
                globalDist += d !== -1 ? d : 0;
            }

            if(!closest || globalDist <= distance) {
                closest = e;
                distance = globalDist;
            }
        }
        this.actual_place = closest;
        return this.actual_place;
  }

  placement(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]) {
    this.actual_place = graph.getRandomEdge();
    return this.actual_place;
  }
  
 
}
