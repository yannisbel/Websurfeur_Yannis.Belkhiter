import { NgModule } from '@angular/core';
import { IStrategy } from './istrategy';
import { CommonModule } from '@angular/common';
import { Graph } from 'src/app/models/Graph/graph';
import { GraphService } from 'src/app/services/graph/graph.service';
import { GameService } from 'src/app/services/game/game.service';
import { InvokeMethodExpr } from '@angular/compiler';
import { SimulationNodeDatum } from 'd3';

export class MaxPathGoat implements IStrategy {
  [x: string]: any;

  actual_place: any;
  first: number;
  dist: [];
  visited: []

  public action(graph: Graph, goat_position: { index: number, x: number, y: number }, cabbage_positions: { index: number, x: number, y: number }[], collectSpeed: number): any {
    let index_voisin_target: number;
    let chemin = this.chemin(graph, goat_position, cabbage_positions[4]);
    console.log("bientot la fin du stage", chemin)
    let voisins = graph.edges(goat_position);
    let liste_plus_court_chemin: number[] | -1;
    console.log("c la cible !!!", this.voisinsChoux(graph, goat_position, cabbage_positions))
    if (this.voisinsChoux(graph, goat_position, cabbage_positions) === true){
      return voisins.filter(vois => vois.index === this.first)[0]
    }
    else{
      let min_glob = -1
      let target: number[];
      for (const v of voisins){
        let min = -1
        let pos_voisin = {index: v.index, x: v.x, y: v.y}
        for (const c of cabbage_positions){
          if (min === -1){
            min = this.distance(graph, pos_voisin, c)
            this.first = pos_voisin.index
          }
          if (min >= this.distance(graph, pos_voisin, c)){
            this.first = pos_voisin.index
          }
        }
        if (min_glob === -1){
          min_glob = min
          this.first = pos_voisin.index
        }
        if (min <= min_glob){
          min_glob = min
          this.first = pos_voisin.index
        }
      }
    }
    return voisins.find(e => e.index === this.first)
  }

  public placement(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]) {
    this.actual_place = graph.getRandomEdge();
    return this.actual_place;
  }

  public voisinsChoux(graph: Graph, start: { index: number, x: number, y: number }, cabbage_positions: { index: number, x: number, y: number }[]){
    let voisins = graph.edges(start);
    for (const v of voisins){
      for (const c of cabbage_positions){
        if(v.index === c.index){
          this.first = v.index;
          return true;
        }
      }
    }
  return false;
  }

  /*
  voisins(node, speed = 1, exclude= [], graph: Graph): { index: number, x: number, y: number}[] {
    const edges = [];
    for(const l of graph.links) {
        if(l.source.index === node.index) {
            let n = this._nodes.find((n: any) => n.index === l.target.index)
            edges.push({index: n.index, x: n.x, y: n.y})
        } else if (l.target.index === node.index) {
            let n = this._nodes.find((n: any) => n.index === l.source.index)
            edges.push({index: n.index, x: n.x, y: n.y})
        } else if (l.source === node.index) {
            let n = this._nodes.find((n: any) => n.index === l.target)
            edges.push({index: n.index, x: n.x, y: n.y})
        } else if (l.target === node.index) {
            let n = this._nodes.find((n: any) => n.index === l.source)
            edges.push({index: n.index, x: n.x, y: n.y})
        }
    }
    if(speed > 1) {
        return this.globalEdges(edges, --speed, exclude)
    }
    return edges;
}
*/

  distance(graph : Graph, n1: { index: number, x: number, y: number }, n2: { index: number, x: number, y: number }) {

    let distance = 0;
    let marked = [];
    marked.push(n1.index);
    if(n1.index===n2.index) {
        return distance;
    }
    
    let edges = graph.edges(n1).filter(e => !(marked.includes(e.index)));
    
    while(edges.length > 0) {
        distance++;
        for(const e of edges) {
            if(e.index == n2.index) return distance;
        }
        const save =  edges;
        edges = []
        for(const e of save) {
            const temp = graph.edges({index: e.index, x: e.x, y: e.y}).filter(i => !(marked.includes(i.index))).forEach(edge => {
                let isIn = false
                for(const i of edges) {
                    if(i.index === edge.index) {
                        isIn = true;
                    }
                }
                if(!isIn) edges.push(edge)
            })
            marked.push(e.index);
        }
    }
    return -1;
}

chemin(graph : Graph, n1: { index: number, x: number, y: number }, n2: { index: number, x: number, y: number }) {

  let shortest_distance = -1;
  let unseennodes: { index: number, x: number, y: number }[];
  unseennodes = graph.nodes
  let visited = [];
  let infinity = 999999;
  let path = []

  for (const node of unseennodes){
    shortest_distance[node.index+1] = infinity
  shortest_distance[n1.index+1] = 0

  }

  while (unseennodes.length !== 0){
    let min_distance_node = undefined

    for (const n of unseennodes){
      if (min_distance_node === undefined){
        min_distance_node = n
      }
      else if (shortest_distance[n.index+1] < shortest_distance[min_distance_node.index+1]){
        min_distance_node = n
      }  
    }

    let path_options = graph.edges(min_distance_node)

    for (const child_node of path_options){
      if (shortest_distance[min_distance_node.index+1]+1 < shortest_distance[child_node.index+1]){
        shortest_distance[child_node.index+1] = shortest_distance[min_distance_node.index+1]+1;
        visited[child_node.index+1] = min_distance_node.index
      }
    }

    unseennodes = unseennodes.filter(e => e.index !== min_distance_node.index)

  }

  let currentNode = n2  

  while (currentNode.index !== n1.index){
    path = [currentNode.index+1].concat(path)
    currentNode = visited[currentNode.index+1]
  }

  path = [n1.index].concat(path)

  return path
  }

}
