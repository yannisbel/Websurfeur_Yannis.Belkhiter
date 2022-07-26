import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphConstructorService } from 'src/app/services/graph-constructor/graph-constructor.service';
import { TranslateService } from 'src/app/services/translate/translate.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-graph-constructor',
  templateUrl: './graph-constructor.component.html',
  styleUrls: ['./graph-constructor.component.scss']
})
export class GraphConstructorComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  public selected_tool: string = 'add-node';
  public tools: string[] = [];
  public zoom_level: number = 0;
  private graphConstructorID = 'graphConstructorSvg';
  private graphConstructorSVG;
  private lineLayer;
  private circleLayer;

  private links = []
  private placing_link = false;
  private from = null;

  private movingCircleOriginalPosition = null

  constructor(private translator: TranslateService,
    private graphConstructorService: GraphConstructorService) { }

  ngOnInit(): void {
    this.tools = this.graphConstructorService.tools;
    this.initGraphEdition()
  }

  private initGraphEdition() {
    this.graphConstructorService.reset();
    this.selected_tool = this.tools[0];
    d3.select('#canvas')
      .append('svg')
      .attr('id', this.graphConstructorID)
      .attr('width', '100%')
      .attr('height', '100%')
      .on('click', this.toolAction.bind(this))
    this.graphConstructorSVG = d3.select(`#${this.graphConstructorID}`);
    this.lineLayer = this.graphConstructorSVG.append('g').attr('id', 'lineLayer');
    this.circleLayer = this.graphConstructorSVG.append('g').attr('id', 'circleLayer')
    //console.log(this.graphConstructorSVG)
  }

  toolAction(event: MouseEvent) {
    /* console.log('click event on svg', event); */
    const clickPosition = { x: event.clientX, y: event.clientY };
    switch (this.selected_tool) {
      case 'add-node':
        this.drawNode(clickPosition);
        break;
      default:
        break;
    }
  }

  drawNode(position) {
    this.graphConstructorService.toolAction(this.selected_tool, position)
    this.circleLayer.append('circle')
      .attr('r', 20)
      .attr('class', position.index)
      .style('fill', this.graphConstructorService.originalNodeColor)
      .attr('cx', position.x)
      .attr('cy', position.y)
      .attr('id', position.index)
      .style('z-index', 1)
      .call(
        d3.drag()
          .on('start', (event: DragEvent) => {
            this.dragstarted(event)
          })
          .on('drag', (event: DragEvent) => {
            this.dragged(event)
          })
          .on('end', (event: DragEvent) => {
            this.dragended(event)
          })
      )
      .on('click', (event: MouseEvent) => {
        this.handleClickOnNode(event.target)
      })
  }

  private handleClickOnNode(circle) {
    switch (this.selected_tool) {
      case 'add-link':
        if (!this.placing_link) {
          circle.style.fill = this.graphConstructorService.selectedNodeColor;
          this.from = circle
        } else {
          if (this.from !== circle) {
            this.drawLink(this.from, circle);
          }
          this.from = null;
          this.resetNodeColor();
        }
        this.placing_link = !this.placing_link
        break;
      case 'remove':
        this.removeCircle(circle);
        break;
    }
  }

  private removeCircle(circle) {
    const toDelete = this.links.filter(link => link.source === circle || link.target === circle).map(link => link.line);
    for (const l of toDelete) {
      this.removeLine(l)
    }
    d3.select(circle).remove();
    this.graphConstructorService.toolAction(this.selected_tool, this.convertCircleToPosition(circle));
  }

  private removeLine(line) {
    let l = this.links.find(link => link.line === line);
    l = { source: this.convertCircleToPosition(l.source), target: this.convertCircleToPosition(l.target) }
    this.links = this.links.filter(link => link.line !== line);
    line.remove();
    this.graphConstructorService.toolAction(this.selected_tool, l.source, l.target)
  }

  private resetNodeColor() {
    d3.selectAll('circle').style('fill', this.graphConstructorService.originalNodeColor)
  }

  drawLink(from, to) {
    const fromPosition = this.convertCircleToPosition(from);
    const toPosition = this.convertCircleToPosition(to);
    this.graphConstructorService.toolAction(this.selected_tool, fromPosition, toPosition)
    const line = this.lineLayer.append('line')
      .attr('class', 'line')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 3)
      .attr('x1', fromPosition.x)
      .attr('y1', fromPosition.y)
      .attr('x2', toPosition.x)
      .attr('y2', toPosition.y)
      .on('click', (event: MouseEvent) => {
        this.handleClickOnLink(event.target)
      })
    this.links.push({ source: from, target: to, line: line._groups[0][0] })
  }

  private convertCircleToPosition(circle) {
    return { x: circle.cx.baseVal.value, y: circle.cy.baseVal.value }
  }

  private handleClickOnLink(line) {
    if (this.selected_tool === 'remove') {
      this.removeLine(line);
    }
  }

  isSelectedTool(tool: string) {
    return this.selected_tool === tool ? `${tool} selected` : `${tool}`;
  }

  selectTool(tool: string) {
    if (this.selected_tool === tool) return;
    this.resetNodeColor();
    this.placing_link = false;
    this.selected_tool = tool;
    console.log(this.selected_tool)
  }

  getToolName(tool: string) {
    return this.translator.graphConstructorToolsName(tool);
  }

  saveGraph() {
    /* this.graphConstructorService.selectGraphType().then(success => {
      if(success === true) this.resetGraphEdition();
    }) */
    this.graphConstructorService.save().then(success => {
      if(success === true) this.resetGraphEdition();
    })
  }

  // Drag & Drop Functions
  dragstarted(event) {
    if (this.selected_tool === 'move') {
      this.movingCircleOriginalPosition = {
        x: event.sourceEvent.target.cx.baseVal.value,
        y: event.sourceEvent.target.cy.baseVal.value
      }
      d3.select(event.sourceEvent.target).attr('stroke', 'black');
    }
  }

  dragged(event) {
    if (this.selected_tool === 'move') {
      const circle = event.sourceEvent.target
      d3.select(circle).raise().attr("cx", event.x).attr("cy", event.y);
      this.links.forEach(link => {
        if (link.source === circle) {
          d3.select(link.line).attr('x1', event.x).attr('y1', event.y)
        } else if (link.target === circle) {
          d3.select(link.line).attr('x2', event.x).attr('y2', event.y)
        }
      })
    }
  }

  dragended(event) {
    if (this.selected_tool === 'move') {
      const circle = d3.select(event.sourceEvent.target)
      circle.attr('stroke', null);
      const endPositon = {
        x: +circle.attr('cx'),
        y: +circle.attr('cy')
      }
      this.graphConstructorService.toolAction(this.selected_tool, this.movingCircleOriginalPosition, endPositon)
    }
  }

  resetGraphEdition() {
    this.graphConstructorSVG.remove();
    this.initGraphEdition();
  }

}
