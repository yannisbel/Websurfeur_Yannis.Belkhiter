import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IStrategy } from './istrategy';
import { Graph } from 'src/app/models/Graph/graph';


export class NaiveCabbage implements IStrategy {

  actual_place: any;

  public placement(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]) {
    let edges = graph.edges(this.actual_place);
    edges.push(this.actual_place)
    edges = edges.filter(e => !(goat_position_index === e))
    return edges;
  }

  public action(graph: Graph, goat_position: Node, cabbage_positions: Node[], collectSpeed: number) {
    let closest = graph.edges(goat_position);
    let s = collectSpeed;
    let collect = [];
    for (const x of graph.nodes){
      if (x.index !== goat_position.index && s !== 0 && cabbage_positions.includes(x.index)){
        collect.push(x);
        s -= 1;
      }
      if (s === 0){
        return collect;
      }
    }
    return collect;
  }
}

