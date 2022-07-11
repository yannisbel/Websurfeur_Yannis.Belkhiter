import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Router } from '@angular/router';
import { Graph } from 'src/app/models/Graph/graph';
import { Tree } from 'src/app/models/Graph/Tree/tree';
import { Grid } from 'src/app/models/Graph/Grid/grid';
import { Tore } from 'src/app/models/Graph/Grid/Tore/tore';
import { Cycle } from 'src/app/models/Graph/Cycle/cycle';


@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private graph: Graph | undefined;

  constructor() { }

  drawGraph(svg: any): void {
    /* console.log('GRAPH', this.graph); */
    this.graph?.draw(svg);
  }

  stop(): void {
    this.graph?.stop();
  }

  generateGraph(type: string, args: any[]) {
    switch (type) {
      case 'tree':
        this.graph = this.generateTree(args[0], args[1]);
        break;
      case 'conf2':
        this.graph = this.generateTree(args[0], 2);
        break;
      case 'conf3':
        this.graph = this.generateTree(args[0], args[1]);
        break;
      case 'grid':
        this.graph = this.generateGrid(args[0], args[1]);
        break;
      case 'tore':
        this.graph = this.generateTore(args[0], args[1]);
         break;
      case 'cycle':
        this. graph = this.generateCycle(args[0]);
        break;
      case 'tree':
        this.graph = this.generateTree(args[0], args[1]);
        break;
      case 'peterson':
    }
    return this.graph;
  }

  generatesNodes(n: number): any[] {
    let nodes = [];
    for(let i=0 ; i < n ; ++i) {
      nodes.push({
        index: i,
      });
    }
    return nodes;
  }

  generateGrid(width: number, height: number): Grid {

    const size = width*height;
    let nodes = this.generatesNodes(size);
    let links = [];

    // LINKS HORIZONTALS
    for (let i = 0 ; i < height*width ; i += width) {
      for (let j = 0 ; j < width-1 ; ++j) {
        links.push({
          source: i+j,
          target: (i+j)+1
        })
      }
    }

    // LINKS VERTICAL
    for (let i = 0 ; i < (height-1)*width ; ++i) {
      links.push({
        source: i,
        target: i+width
      })
    }

    return new Grid(nodes, links, width, height);
  }

  generateTore(width: number, height: number) {
    const size = width*height;
    let nodes = this.generatesNodes(size);
    let links = [];

    // LINKS HORIZONTALS
    for (let i = 0 ; i < height*width ; i += width) {
      for (let j = 0 ; j < width-1 ; ++j) {
        links.push({
          source: i+j,
          target: (i+j)+1
        })
      }
    }

    // LINKS VERTICAL
    for (let i = 0 ; i < (height-1)*width ; ++i) {
      links.push({
        source: i,
        target: i+width
      })
    }

    // VERTICAL TORE
    for (let i = 0 ; i < width ; ++i) {
      links.push({
        source: i,
        target: i+((width*height)-width)
      })
    }

    // HORIZONTAL TORE
    for (let i = 0 ; i < height*width ; i += width) {
      links.push({
        source: i,
        target: i+(width-1)
      })
    }

    return new Tore(nodes, links, width, height);
  }

  generateTree(size: number, arity: number): Tree {

    let nodes = this.generatesNodes(size);
    let links = [];

    for(let i = 0 ; i < size ; ++i) {
      for(let j = 1 ; j <= arity && (i*arity)+j < size ; ++j) {
        links.push({
          source: i,
          target: (i*arity) + j
        });
      }
    }

    return new Tree(nodes, links);
  }


/*  generatePetersen(): Common{
    let nodes = this.generatesNodes(10);
    let links = [];

    links.push({
      source: 0,
      target: 1
    });
    links.push({
      source: 1,
      target: 2
    });
    links.push({
      source: 2,
      target: 3
    });
    links.push({
      source: 3,
      target: 4
    });
    links.push({
      source: 4,
      target: 0
    });
    links.push({
      source: i,
      target: i+1
    });
    links.push({
      source: i,
      target: i+1
    });
    links.push({
      source: i,
      target: i+1
    });
    links.push({
      source: i,
      target: i+1
    });
    links.push({
      source: i,
      target: i+1
    });
    links.push({
      source: i,
      target: i+1
    });

    for(let i: number = 0 ; i < 4 ; ++i) {
      links.push({
        source: i,
        target: i+1
      });
      links.push({
        source: i,
        target: i+5
      });
    }

  for(let i: number = 5 ; i < 6 ; ++i) {
    links.push({
      source: i,
      target: i+2
    });
    links.push({
      source: i,
      target: i+3
    });
  }
  links.push({
    source: 0,
    target: 4
  });

  return new Common(nodes, links);

  }
  */

  generateCycle(size: number): Cycle {
    let nodes = this.generatesNodes(size);
    let links = [];

    for(let i: number = 0 ; i < size-1 ; ++i) {
      links.push({
        source: i,
        target: i+1
      })
    }
    links.push({
      source: 0,
      target: size-1
    })

    return new Cycle(nodes, links);
  }


}
