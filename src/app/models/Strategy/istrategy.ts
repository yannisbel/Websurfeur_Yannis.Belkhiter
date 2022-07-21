import { Graph } from "../Graph/graph";

export interface IStrategy {

    // Return an edge from the graph pass in argument
    action(graph: Graph, goat_position: { index: number, x: number, y: number }, cabbage_positions: Node[], collectSpeed: number): any;

    placement(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]): any;

}