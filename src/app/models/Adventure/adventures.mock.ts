import { Adventure } from "./adventure"
import { AdventureLevel } from "./AdventureLevel/adventure-level"
import { Difficulty } from "./difficulty";
import { Mode } from "./mode";

// Introduction
const intro: Adventure = new Adventure('Introduction', Mode.CLASSIC, 'intro', [
    new AdventureLevel('path', [10, 1], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('cycle', [10, 1], 1, 'goat', Difficulty.NORMAL),
    new AdventureLevel('grid', [4, 4], 1, 'cabbage', Difficulty.NORMAL),
    new AdventureLevel('tree', [15, 3], 1, 'goat', Difficulty.NORMAL),
    new AdventureLevel('cycle', [10, 1], 1, 'cabbage', Difficulty.NORMAL),
], 'assets/menu/graph-img/introduction.svg')

// Graphs with dominants
const dominant: Adventure = new Adventure('Dominants', Mode.CLASSIC, 'dominant', [
    new AdventureLevel('visible-dominant', [-1, -1], 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('petersen', [-1, -1], 2, 'cops', Difficulty.NORMAL),
    new AdventureLevel('petersen', [-1, -1], 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('hidden-dominant-3', [-1, -1], 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('visible-dominant-3', [-1, -1], 1, 'thief', Difficulty.NORMAL),
], 'assets/menu/graph-img/dominant.svg')

// Grid Strategy Adventure
const grid: Adventure = new Adventure('Grilles (construction stratégies gagnantes)', Mode.CLASSIC, 'grid-strat', [
    new AdventureLevel('grid', [9, 9], 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 1, 'cops', Difficulty.DIFFICILE),
    new AdventureLevel('grid', [9, 9], 2, 'cops', Difficulty.DIFFICILE),
], 'assets/menu/graph-img/grid.svg');

// Chordal
const separator: Adventure = new Adventure('Séparateur', Mode.CLASSIC, 'separator', [
    new AdventureLevel('2-arbre', [-1, -1], 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('2-arbre', [-1, -1], 3, 'cops', Difficulty.NORMAL),
    new AdventureLevel('2-arbre', [-1, -1], 2, 'thief', Difficulty.NORMAL),
    new AdventureLevel('2-arbre-reduce', [-1, -1], 1, 'cops', Difficulty.NORMAL),
    new AdventureLevel('chordal', [-1, -1], 1, 'thief', Difficulty.EXTREME),
], 'assets/menu/graph-img/chordal.svg');

export const ADVENTURES: Adventure[] = [
    intro,
    dominant,
    grid,
    separator,
]
