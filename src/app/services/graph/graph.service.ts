import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Router } from '@angular/router';
import { Graph } from 'src/app/models/Graph/graph';
import { Tree } from 'src/app/models/Graph/Tree/tree';
import { Grid } from 'src/app/models/Graph/Grid/grid';
import { Tore } from 'src/app/models/Graph/Grid/Tore/tore';
import { Cycle } from 'src/app/models/Graph/Cycle/cycle';
import { Common } from 'src/app/models/Graph/Common/common';
import { Specific } from 'src/app/models/Graph/Specific/specific';


@Injectable({
  providedIn: 'root'
})
export class GraphService {
  static generateGraph(type_graph: any, param_graph: any) {
    throw new Error('Method not implemented.');
  }
  [x: string]: any;

  private graph: Graph | undefined;

  private inputFile!: File;

  constructor(private router: Router, private http: HttpClient) {
    if (localStorage.getItem("method") !== null) {
      switch(localStorage.getItem("method")) {
        case "import":
          if (localStorage.getItem("config") !== null) {
            const config = JSON.parse(localStorage.getItem("config"))
            this.importGraph(config);
          }
          break;
      }
    }
  }

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
      case 'rope':
        this.graph = this.oneCopsGraph(args[0]);
        break;
      case 'the':
        this.graph = this.generateTheOne();
        break;
      case 'dodecahedron':
      default:
        this.graph = this.generateFromFile(type);
        break;
      }
    return this.graph;
  }


  // Generate a random number between "start" (include) and "end" (exclude)
  private randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start) + start);
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

  private neighbors(index, links = []) {
    const result = [];
    for(let i = 0; i < links.length; i++) {
      if(links[i].source === index) {
        result.push(links[i].target);
      } else if (links[i].target === index) {
        result.push(links[i].source);
      }
    }
    return result;
  }

  private subset(set = []) {
    const tmp_set = [...set]
    const subset = [];
    const size = this.randomInRange(1, tmp_set.length);
    for(let i = 0; i < size; i++) {
      const index = this.randomInRange(0, tmp_set.length);
      const element = tmp_set.splice(index, 1)[0];
      subset.push(element);
    }
    return subset;
  }

  private oneCopsGraph(n): Common {
    let nodes = this.generatesNodes(n)
    let links = [];

    for(let i=n-2; i>=0; i--) {
      let index = this.randomInRange(i, n);
      while(index === i) { // Check if random selected node is not the current node
        index = this.randomInRange(i, n);
      }
      const neighbors = this.neighbors(index, links);
      const neighbors_subset = this.subset(neighbors);
      for(const neighbor of neighbors_subset) {
        if(neighbor !== i) {
          links.push({source: i, target: neighbor})
        }
      }
      links.push({source: i, target: index});
    }
    return new Common(nodes, links, 'copsAlwaysWin');
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

  generateTheOne(): Tree {

    let nodes = this.generatesNodes(12);
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
      source: 2,
      target: 4
    });
    links.push({
      source: 3,
      target: 5
    });
    links.push({
      source: 4,
      target: 6
    });
    links.push({
      source: 5,
      target: 7
    });
    links.push({
      source: 5,
      target: 8
    });
    links.push({
      source: 5,
      target: 9
    });
    links.push({
      source: 5,
      target: 10
    });
    links.push({
      source: 5,
      target: 11
    });
    links.push({
      source: 6,
      target: 7
    });
    links.push({
      source: 6,
      target: 8
    });
    links.push({
      source: 6,
      target: 9
    });
    links.push({
      source: 6,
      target: 10
    });
    links.push({
      source: 6,
      target: 11
    });
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

  private async generatePetersen() {
    const blob = await this.downloadAssets('petersen');
    const file = new File([blob], 'petersen.json');
    /* console.log('FILE',file); */
    return this.loadGraphFromFile(file);
    /* console.log('HERE'); */
  }

  async generateDodecahedron() {
    const blob = await this.downloadAssets('dodecahedron');
    const file = new File([blob], 'dodecahedron.json');
    /* console.log('FILE',file); */
    await this.loadGraphFromFile(file);
    /* console.log('HERE'); */
  }

  async generateFromFile(filename: string) {
    const blob = await this.downloadAssets(filename);
    const file = new File([blob], `${filename}.json`);
    await this.loadGraphFromFile(file);
  }

  downloadAssets(name: string): Promise<Blob> {
    return new Promise((resolve) => {
      this.http.get(`assets/${name}.json`, {responseType: 'blob'}).subscribe(data => {
        /* console.log(data) */
        resolve(data)
      })
    })
    
  }

  readAsync(file: File): Promise<Graph> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        let config = JSON.parse(reader.result.toString());
        resolve(config);
      };
      reader.onerror = () => {
        reject (new Error ('Unable to read..'));
      };
      reader.readAsText(file);
    });
  }
  
  async loadGraphFromFile(file: File) {
    this.inputFile = file;
    const config = await this.readAsync(file);
    this.importGraph(config);
    /* console.log('THERE'); */
  }

  importGraph(config) {
    this.graph = null;
    localStorage.setItem("method", "import");
    localStorage.setItem("config", JSON.stringify(config));
    switch(config.typology) {
      case 'grid':
        this.graph = new Grid(config.nodes, config.links, config.width, config.height);
        break;
      case 'cycle':
        this.graph = new Cycle(config.nodes, config.links);
        break;
      case 'tree':
        this.graph = new Tree(config.nodes, config.links);
        break;
      case 'random':
        this.graph = new Common(config.nodes, config.links);
        break;
      case 'specific':
        this.graph = new Specific(config.nodes, config.links);
        break;
    }
  }


}

