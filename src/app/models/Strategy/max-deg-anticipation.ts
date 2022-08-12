import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IStrategy } from './istrategy';
import { Graph } from 'src/app/models/Graph/graph';
import * as d3 from 'd3';


export class MaxDegAnticipation implements IStrategy {
  [x: string]: any;
  mark: number[] = [];

  actual_place: any;

  public placement(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]) {
    let edges = graph.edges(this.actual_place);
    edges.push(this.actual_place)
    edges = edges.filter(e => !(goat_position_index === e))
    return edges;
  }

  public action(graph: Graph, goat_position: { index: number, x: number, y: number }, cabbage_positions: { index: number, x: number, y: number }[], collectSpeed: number) {
    let res = [];
    let marked: number[];
    marked = this.mark
    let s = collectSpeed;
    let voisins = graph.edges(goat_position)
    for (const cabbage of cabbage_positions){
      for (const v of voisins){
        if(goat_position.index !== cabbage.index && s !== 0 && v.index === cabbage.index){
          marked.push(cabbage.index)
          const selected_target = d3.select('#'+'cabbage'+cabbage.index);
          res.push(selected_target);
          s = s-1
        }
      }
    }
    while (s !== 0){
      let h = cabbage_positions.filter(e => !(marked.includes(e.index)));
      let max = this.maxDeg(graph)
      console.log("links", max)
      console.log("liste of links", graph.links)
      let cabbage_max = cabbage_positions.find(e => e.index === max)
      const voisins_max = graph.edges(cabbage_max);
      for (const cabbage of cabbage_positions){
        for (const v_max of voisins_max){
          if(goat_position.index !== cabbage.index && s !== 0 && v_max.index === cabbage.index){
            marked.push(cabbage.index)
            const selected_target = d3.select('#'+'cabbage'+cabbage.index);
            res.push(selected_target);
            s = s-1
          }
        }
        if (s !== 0){
          let k = cabbage_positions.filter(e => !(marked.includes(e.index)));
          let rand = Math.floor(Math.random() * h.length)
          const cabbage = k[rand]
          if(goat_position.index !== cabbage.index && s !== 0 && !(marked.includes(cabbage.index))){
            marked.push(cabbage.index)
            const selected_target = d3.select('#'+'cabbage'+cabbage.index);
            res.push(selected_target);
            s = s-1
          }
        }
      }
    }
  return res;
  }

maxDeg(graph: Graph){
  let links = graph.links;
  let occurence = []
  for (let x = 0; x < links.length; x++){
    occurence.push(0)
  }
  for (const l of links){
    occurence[l.source] += 1
  }
  let max = Math.max.apply(null, occurence);
  return occurence.indexOf(max)
}

}

