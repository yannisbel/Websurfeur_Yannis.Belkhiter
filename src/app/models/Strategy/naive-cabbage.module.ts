import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IStrategy } from './istrategy';
import { Graph } from 'src/app/models/Graph/graph';


export class NaiveCabbage implements IStrategy {

  actual_place: any;

  public placement(graph: Graph, goat_node: Node, cabbage_positions: Node[]) {
    let edges = graph.edges(this.actual_place);
    edges.push(this.actual_place)
    edges = edges.filter(e => !(goat_node === e))
    return edges;
  }

  public action(graph: Graph, goat_node: Node, cabbage_positions: Node[]) {
    let closest;
    let distance = graph.nodes.length;
    let edges = graph.edges(this.actual_place);
    edges.push(this.actual_place);
    edges = edges.filter(e => !(goat_node === e))
    for(const e of edges) {
        let globalDist = 0;
        for(const t of cabbage_positions) {
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
}

