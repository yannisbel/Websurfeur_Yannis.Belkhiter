import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IStrategy } from './istrategy';
import { Graph } from 'src/app/models/Graph/graph';

export class Strat2Goat implements IStrategy {
  [x: string]: any;

  action(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]) {
    let goat_node = graph.nodes(goat_position_index);
    let closest;
    let alfa = [];
    let distance = graph.nodes.length;
    let edges = graph.edges(this.actual_place);
    edges.push(this.actual_place);
    edges = edges.filter(e => !(goat_position_index === e.index))
    for(const e of edges) {
        let globalDist = 0;
        for(const t of cabbage_positions_index) {
          let c = 0
          const d = graph.distance(e, t);
          for(const n of graph.links(t)){
            c += 1
          }
          alfa.push({c, d, e});
        }
    }
        let liste_noeuds = []
        let liste_diff = []
        for (const x of alfa){
          if (x[1] <= (x[0]/collect_speed)){
            return x[2]
          }
          else{
            liste_diff.push(x[1] - (x[0]/collect_speed))
            liste_noeuds.push(x[2])
          }
          let liste_diff_ord = liste_diff.sort()
          let h = liste_diff.findIndex(liste_diff_ord[0])
          return liste_noeuds.indexOf(h)
        }
  }
  
  placement(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]) {
    this.actual_place = graph.getRandomEdge();
    return this.actual_place;
  }
}
