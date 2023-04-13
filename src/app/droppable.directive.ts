import { Directive, HostListener } from '@angular/core';
import { SVGService } from './svg.service';

@Directive({
  selector: '[appDroppable]'
})
export class DroppableDirective {
  private draggingElement: any;

  constructor(private svgService: SVGService) { }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: any): void {
    if (this.draggingElement) {
      const svgPoint = this.svgService.getSVGPoint(event, this.draggingElement);
      this.setPosition(this.draggingElement, { x: svgPoint.x, y: svgPoint.y });
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: any): void {
    if (event.target.getAttribute('draggable')) {
      this.draggingElement = event.target;
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: any): void {
    this.draggingElement = null;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: any): void {
    this.draggingElement = null;
  }

  private setPosition(element: any, coord: { x: any, y: any }) {
    if (element.tagName === 'rect') {
      element.setAttribute('x', coord.x);
      element.setAttribute('y', coord.y);
    }
    else{
      element.setAttribute('cx', coord.x);
      element.setAttribute('cy', coord.y);
    }
  }
}