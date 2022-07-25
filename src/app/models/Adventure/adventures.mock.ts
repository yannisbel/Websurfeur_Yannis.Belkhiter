import { Adventure } from "./adventure"
import { AdventureLevel } from "./AdventureLevel/adventure-level"
import { Difficulty } from "./difficulty";
import { Mode } from "./mode";

// Introduction
const intro: Adventure = new Adventure('Introduction', Mode.CLASSIC, 'intro', [
    new AdventureLevel('cycle', [10], 1, 'goat', Difficulty.NORMAL),
    new AdventureLevel('grid', [4, 4], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('tree', [15, 3], 1, 'goat', Difficulty.NORMAL),
    new AdventureLevel('cycle', [10, 1], 1, 'cabbage', Difficulty.NORMAL),
], 'assets/introduction.svg')

// Graphs with dominants
const dominant: Adventure = new Adventure('Dominants', Mode.CLASSIC, 'dominant', [
    new AdventureLevel('tore', [6, 6], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('tore', [6, 6], 2, 'goat', Difficulty.NORMAL),
    new AdventureLevel('tore', [6, 6], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('tore', [6, 6], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('tore', [6, 6], 1, 'cabbage', Difficulty.NORMAL),
], 'assets/dominant.svg')

// Grid Strategy Adventure
const grid: Adventure = new Adventure('Grilles (construction stratégies gagnantes)', Mode.CLASSIC, 'grid-strat', [
    new AdventureLevel('grid', [9, 9], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 1, 'goat', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 2, 'goat', Difficulty.NORMAL),
], 'assets/grid.svg');

// Chordal
const separator: Adventure = new Adventure('Séparateur', Mode.CLASSIC, 'separator', [
    new AdventureLevel('tree', [15, 3], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('tree', [15, 3], 3, 'goat', Difficulty.NORMAL),
    new AdventureLevel('tree', [15, 3], 2, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('tree', [15, 3], 1, 'goat', Difficulty.NORMAL),
    new AdventureLevel('tree', [15, 3], 1, 'cabbage', Difficulty.NORMAL),
], 'assets/chordal.svg');

export const ADVENTURES: Adventure[] = [
    intro,
    dominant,
    grid,
    separator,
]
