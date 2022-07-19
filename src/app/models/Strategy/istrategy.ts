import { Graph } from "../Graph/graph";

export interface IStrategy {

    // Return an edge from the graph pass in argument
    action(graph: Graph, goat_node: Node, cabbage_positions: Node[]): any;

    placement(graph: Graph, goat_node: Node, cabbage_positions: Node[]): any;

}