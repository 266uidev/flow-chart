import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { SVGService } from './svg.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  nodeForm: FormGroup | any;
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};

  @ViewChild('tooltip') tooltip!: ElementRef;
  @ViewChild('topDiv') topDiv!: ElementRef;

  title = 'demoFlowChart';

  oldClientX: any = 0;
  oldClientY: any = 0;

  screenWidth = '';
  screenHeight = '';

  nodeWidth = 250;
  nodeHeight = 100;
  arrowHead = 5;

  arrows: any = [];
  processNodes: any = [];
  startEndNodes: any = [];
  ioNodes: any = [];
  decisionNodes: any = [];
  circleNodes: any = [];

  ioTransform = 'skewX(-15)';
  ioReflect = 20;
  ioNodeReflect = 150;
  decisionWidth = 200;
  decisionRotate = 45;

  nodes: any[] = [
    {
      nodeId: 1,
      nodeType: 'startend',
      nodeY: 100,
      nodeX: 50,
      name: 'Start',
      className: 'StartClass',
      touchPoints: {
        topCenter: {
          x: 0, y: 0
        }, rightCenter: {
          x: 0, y: 0
        }, bottomCenter: {
          x: 0, y: 0
        }, leftCenter: {
          x: 0, y: 0
        }, mid: {
          x: 0, y: 0
        }
      },
      parents: [],
      style: 'fill: #88EAEA; stroke-width: 1; stroke: #d7dbdd',
      childs: [
        {
          id: 2,
          lineStyle: 'stroke: #5DADE2; stroke-width: 4;',
          x1: 50 + this.nodeWidth,
          y1: 200 + (this.nodeHeight / 2),
          x2: 500 - this.arrowHead,
          y2: 100 + (this.nodeHeight / 2 - 3),
          className: 'FinanceClassHS Line'
        },
        {
          id: 3,
          lineStyle: 'stroke: #99a3a4; stroke-width: 4; stroke-dasharray: 5,5;',
          x1: 50 + this.nodeWidth,
          y1: 200 + (this.nodeHeight / 2),
          x2: 500 - this.arrowHead,
          y2: 300 + (this.nodeHeight / 2 - 3),
          className: 'EndPayrollClassHS Line'
        },
        {
          id: 5,
          lineStyle: 'stroke: #99a3a4; stroke-width: 4; stroke-dasharray: 5,5;',
          x1: 50 + this.nodeWidth,
          y1: 200 + (this.nodeHeight / 2),
          x2: 500 - this.arrowHead,
          y2: 700 + (this.nodeHeight / 2 - 3),
          className: 'MyProcessClassHS Line'
        },
        {
          id: 6,
          lineStyle: 'stroke: #99a3a4; stroke-width: 4; stroke-dasharray: 5,5;',
          x1: 50 + this.nodeWidth,
          y1: 200 + (this.nodeHeight / 2),
          x2: 500 - this.arrowHead,
          y2: 700 + (this.nodeHeight / 2 - 3),
          className: 'HRClassHS Line'
        },
        {
          id: 7,
          lineStyle: 'stroke: #99a3a4; stroke-width: 4; stroke-dasharray: 5,5;',
          x1: 50 + this.nodeWidth,
          y1: 200 + (this.nodeHeight / 2),
          x2: 500 - this.arrowHead,
          y2: 900 + (this.nodeHeight / 2 - 3),
          className: 'SureClassHS Line'
        }
      ]
    },
    {
      nodeId: 2,
      nodeType: 'process',
      nodeY: 100,
      nodeX: 500,
      name: 'Finance',
      className: 'FinanceClass',
      touchPoints: {
        topCenter: {
          x: 0, y: 0
        }, rightCenter: {
          x: 0, y: 0
        }, bottomCenter: {
          x: 0, y: 0
        }, leftCenter: {
          x: 0, y: 0
        }, mid: {
          x: 0, y: 0
        }
      },
      style: 'fill: #8CEE9F; stroke-width: 1; stroke: #d7dbdd;',
      parents: [
        {
          id: 1,
        }
      ],
      childs: [
        {
          id: 4,
          lineStyle: 'stroke: #5DADE2; stroke-width: 4;',
          x1: 500 + this.nodeWidth,
          y1: 100 + (this.nodeHeight / 2),
          x2: 950 - this.arrowHead,
          y2: 200 + (this.nodeHeight / 2 - 3),
          className: 'CompletedClassHS Line'
        },
      ]
    },
    {
      nodeId: 3,
      nodeType: 'process',
      nodeY: 300,
      nodeX: 500,
      name: 'End Payroll',
      className: 'EndPayrollClass',
      touchPoints: {
        topCenter: {
          x: 0, y: 0
        }, rightCenter: {
          x: 0, y: 0
        }, bottomCenter: {
          x: 0, y: 0
        }, leftCenter: {
          x: 0, y: 0
        }, mid: {
          x: 0, y: 0
        }
      },
      style: 'fill: #8CEE9F; stroke-width: 1; stroke: #d7dbdd',
      parents: [{
        id: 1,
      }, {
        id: 7,
      }],
      childs: [
        {
          id: 4,
          lineStyle: 'stroke: #5DADE2; stroke-width: 4;',
          x1: 500 + this.nodeWidth,
          y1: 300 + (this.nodeHeight / 2),
          x2: 950 - this.arrowHead,
          y2: 200 + (this.nodeHeight / 2 - 3),
          className: 'CompletedClassHS Line'
        },
      ]
    },
    {
      nodeId: 4,
      nodeType: 'startend',
      nodeY: 200,
      nodeX: 950,
      name: 'Completed',
      className: 'CompletedClass',
      touchPoints: {
        topCenter: {
          x: 0, y: 0
        }, rightCenter: {
          x: 0, y: 0
        }, bottomCenter: {
          x: 0, y: 0
        }, leftCenter: {
          x: 0, y: 0
        }, mid: {
          x: 0, y: 0
        }
      },
      style: 'fill: #88EAEA; stroke-width: 1; stroke: #d7dbdd',
      parents: [
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 5,
        },
        {
          id: 6,
        },
        {
          id: 7,
        }
      ],
      childs: []
    },
    {
      nodeId: 5,
      nodeType: 'circle',
      nodeY: 500,
      nodeX: 100,
      name: 'My Process',
      className: 'MyProcessClass',
      touchPoints: {
        topCenter: {
          x: 0, y: 0
        }, rightCenter: {
          x: 0, y: 0
        }, bottomCenter: {
          x: 0, y: 0
        }, leftCenter: {
          x: 0, y: 0
        }, mid: {
          x: 0, y: 0
        }
      },
      style: 'fill: #88EAEA; stroke-width: 1; stroke: #d7dbdd',
      parents: [
        {
          id: 1,
        },
      ],
      childs: [{
        id: 4,
        lineStyle: 'stroke: #5DADE2; stroke-width: 4;',
        x1: 500 + this.nodeWidth,
        y1: 700 + (this.nodeHeight / 2),
        x2: 950 - this.arrowHead,
        y2: 200 + (this.nodeHeight / 2 - 3),
        className: 'CompletedClassHS Line'
      },]
    },
    {
      nodeId: 6,
      nodeType: 'process',
      nodeY: 700,
      nodeX: 500,
      name: 'HR2',
      className: 'HR2Class',
      touchPoints: {
        topCenter: {
          x: 0, y: 0
        }, rightCenter: {
          x: 0, y: 0
        }, bottomCenter: {
          x: 0, y: 0
        }, leftCenter: {
          x: 0, y: 0
        }, mid: {
          x: 0, y: 0
        }
      },
      style: 'fill: #8CEE9F; stroke-width: 1; stroke: #d7dbdd',
      parents: [{
        id: 1,
      }],
      childs: [
        {
          id: 4,
          lineStyle: 'stroke: #5DADE2; stroke-width: 4;',
          x1: 500 + this.nodeWidth,
          y1: 700 + (this.nodeHeight / 2),
          x2: 950 - this.arrowHead,
          y2: 200 + (this.nodeHeight / 2 - 3),
          className: 'CompletedClassHS Line'
        },
      ]
    },
    {
      nodeId: 7,
      nodeType: 'decision',
      nodeY: 500,
      nodeX: 900,
      name: 'Sure',
      className: 'SureClass',
      touchPoints: {
        topCenter: { x: 0, y: 0 },
        rightCenter: { x: 0, y: 0 },
        bottomCenter: { x: 0, y: 0 },
        leftCenter: { x: 0, y: 0 },
        mid: { x: 0, y: 0 }
      },
      style: 'fill: #9B59B6; stroke-width: 1; stroke: #d7dbdd',
      parents: [{
        id: 1,
      }],
      childs: [
        {
          id: 4,
          lineStyle: 'stroke: #5DADE2; stroke-width: 4;',
          x1: 500 + this.nodeWidth,
          y1: 900 + (this.nodeHeight / 2),
          x2: 950 - this.arrowHead,
          y2: 200 + (this.nodeHeight / 2 - 3),
          className: 'CompletedClassHS Line'
        },
        {
          id: 3,
          lineStyle: 'stroke: #5DADE2; stroke-width: 4;stroke-dasharray: 5,5;',
          x1: 500 + this.nodeWidth,
          y1: 900 + (this.nodeHeight / 2),
          x2: 950 - this.arrowHead,
          y2: 200 + (this.nodeHeight / 2 - 3),
          className: 'CompletedClassHS Line'
        },
      ]
    },
  ];

  rex = [0];
  circleshape = [0];

  constructor(private renderer: Renderer2, private svgService: SVGService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth - 65 + 'px';
    this.screenHeight = window.innerHeight - 65 + 'px';
    this.processNodes = this.nodes.filter(m => m.nodeType == 'process');
    this.startEndNodes = this.nodes.filter(m => m.nodeType == 'startend');
    this.ioNodes = this.nodes.filter(m => m.nodeType == 'io');
    this.decisionNodes = this.nodes.filter(m => m.nodeType == 'decision');
    this.circleNodes = this.nodes.filter(m => m.nodeType == 'circle');
    this.getClosestPoints();
    this.getPointsForDecision();
    this.getLines();
    this.nodeForm = this.fb.group({
      Name: ['', [Validators.required]]
    });
  }

  addNode() {

  }

  //#region 

  @HostListener('dragstart', ['$event'])

  onDragStart(event: any) {
    let elementToBeDragged: any;
    var element = event.target as HTMLElement;
    elementToBeDragged = element.getElementsByTagName('circle')[0];
    if (!elementToBeDragged) {
      elementToBeDragged = element.getElementsByTagName('rect')[0];
    }
    event.dataTransfer.setData('text', elementToBeDragged.id);
  }

  @HostListener('document:dragover', ['$event'])
  onDragOver(event: any) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    
    $("#exampleModal").modal('show');

    const dropzone = event.target;

    const droppedElementId = event.dataTransfer.getData('text');
    const droppedElement = document.getElementById(droppedElementId) as any;

    if (droppedElement.tagName === "rect") {
      this.rex.push(0);
    }
    else if (droppedElement.tagName === "circle") {
      this.circleshape.push(0);
    }

    if (droppedElement.viewportElement != null) {
      dropzone.appendChild(droppedElement);
      droppedElement.setAttribute('draggable', true);
      const svgPoint = this.svgService.getSVGPoint(event, droppedElement);
      this.setPosition(droppedElement, { x: svgPoint.x, y: svgPoint.y });
    }
  }

  private setPosition(element: any, coord: { x: any, y: any }) {
    //  console.log("setPosition:-", element.tagName, element, coord);
    if (element.tagName === 'rect') {
      element.setAttribute('x', coord.x);
      element.setAttribute('y', coord.y);
    }
    else {
      element.setAttribute('cx', coord.x);
      element.setAttribute('cy', coord.y);
    }
  }


  //#endregion

  getPointsForDecision() {
    this.nodes.filter(m => m.nodeType == 'circle' || m.nodeType == 'decision').forEach((currentnode: any) => {
      const parents = currentnode.parents;
      const childs = currentnode.childs;
      let parentIds: any[] = parents.map((m: any) => m.id);
      let childIds: any[] = childs.map((m: any) => m.id);
      const newChildpoints = this.getNewChildPoints(currentnode, childIds, parentIds);

      childs.forEach((child: any) => {
        const points = this.getMinimumDistanceObjectByChildId(newChildpoints, currentnode.nodeId, child.id);
        child.x1 = points.x1;
        child.y1 = points.y1;
        child.x2 = points.x2;
        child.y2 = points.y2;
      });

      parentIds.forEach(parentId => {
        this.nodes.filter(node => node.nodeId == parentId).map(m => m.childs).forEach(child => {
          child.filter((o: any) => o.id == currentnode.nodeId).forEach((n: any) => {
            const points = this.getMinimumDistanceObjectByChildId(newChildpoints, n.id, parentId);
            n.x1 = points.x2;
            n.y1 = points.y2;
            n.x2 = points.x1;
            n.y2 = points.y1;
          });
        });
      });
    });
  }

  rotatePoint(x: any, y: any, centerx: any, centery: any, degrees: any) {
    var newX = (x - centerx) * Math.cos(degrees * Math.PI / 180) - (y - centery) * Math.sin(degrees * Math.PI / 180) + centerx;
    var newY = (x - centerx) * Math.sin(degrees * Math.PI / 180) + (y - centery) * Math.cos(degrees * Math.PI / 180) + centery;
    return { newX, newY };
  }

  getClosestPoints() {
    this.nodes.forEach((node: any) => {
      const x = node.nodeX;
      const y = node.nodeY;
      const nodeType = node.nodeType;

      switch (nodeType) {
        case 'circle':
          node.touchPoints.mid.x = x + (this.decisionWidth / 2);
          node.touchPoints.mid.y = y + (this.decisionWidth / 2);

          node.touchPoints.topCenter.x = node.touchPoints.mid.x;
          node.touchPoints.topCenter.y = node.touchPoints.mid.y - (this.decisionWidth / 2);

          node.touchPoints.rightCenter.x = node.touchPoints.mid.x + (this.decisionWidth / 2);
          node.touchPoints.rightCenter.y = node.touchPoints.mid.y;

          node.touchPoints.bottomCenter.x = node.touchPoints.mid.x;
          node.touchPoints.bottomCenter.y = node.touchPoints.mid.y + (this.decisionWidth / 2);

          node.touchPoints.leftCenter.x = node.touchPoints.mid.x - (this.decisionWidth / 2);;
          node.touchPoints.leftCenter.y = node.touchPoints.mid.y;

          break;
        case 'decision':
          const decisionTC = this.rotatePoint(x, y, x + (this.decisionWidth / 2), y + (this.decisionWidth / 2), this.decisionRotate);
          node.touchPoints.topCenter.x = decisionTC.newX;
          node.touchPoints.topCenter.y = decisionTC.newY;

          const decisionRC = this.rotatePoint(x + this.decisionWidth, y, x + (this.decisionWidth / 2), y + (this.decisionWidth / 2), this.decisionRotate);
          node.touchPoints.rightCenter.x = decisionRC.newX;
          node.touchPoints.rightCenter.y = decisionRC.newY;

          const decisionBC = this.rotatePoint(x + this.decisionWidth, y + this.decisionWidth, x + (this.decisionWidth / 2), y + (this.decisionWidth / 2), this.decisionRotate);
          node.touchPoints.bottomCenter.x = decisionBC.newX;
          node.touchPoints.bottomCenter.y = decisionBC.newY;

          const decisionLC = this.rotatePoint(x, y + this.decisionWidth, x + (this.decisionWidth / 2), y + (this.decisionWidth / 2), this.decisionRotate);
          node.touchPoints.leftCenter.x = decisionLC.newX;
          node.touchPoints.leftCenter.y = decisionLC.newY;

          const decisionMID = this.rotatePoint(x + this.decisionWidth, y + this.decisionWidth, x + (this.decisionWidth / 2), y + (this.decisionWidth / 2), this.decisionRotate);
          node.touchPoints.mid.x = decisionMID.newX;
          node.touchPoints.mid.y = decisionMID.newY;
          break;
        default:
          node.touchPoints.topCenter.x = x + (this.nodeWidth / 2);
          node.touchPoints.topCenter.y = y;

          node.touchPoints.rightCenter.x = x + this.nodeWidth;
          node.touchPoints.rightCenter.y = y + (this.nodeHeight / 2);

          node.touchPoints.bottomCenter.x = x + (this.nodeWidth / 2);
          node.touchPoints.bottomCenter.y = y + this.nodeHeight;

          node.touchPoints.leftCenter.x = x;
          node.touchPoints.leftCenter.y = y + (this.nodeHeight / 2);

          node.touchPoints.mid.x = x + (this.nodeWidth / 2);
          node.touchPoints.mid.y = y + (this.nodeHeight / 2);
      }
    });
  }

  getLines() {
    this.arrows = [];
    this.nodes.forEach(node => {
      node.childs.forEach((child: any) => {
        this.arrows.push(child);
      });
    });
  }

  mouseEnter($event: any, data: any): void {
    let circle = $event.target as HTMLElement;
    let coordinates = circle.getBoundingClientRect();
    let x = `${coordinates.left + 20}px`;
    let y = `${coordinates.top + 20}px`;
    this.renderer.setStyle(this.tooltip.nativeElement, 'left', x);
    this.renderer.setStyle(this.tooltip.nativeElement, 'top', y);
    this.renderer.setStyle(this.tooltip.nativeElement, 'display', 'block');
    this.renderer.setProperty(this.tooltip.nativeElement, 'innerHTML', data);
  }

  mouseLeave($event: any): void {
    this.renderer.setProperty(this.tooltip.nativeElement, 'innerHTML', '');
    this.renderer.setStyle(this.tooltip.nativeElement, 'display', 'none');
  }

  mouseDown($event: any, data: any, className: any): void {
    this.oldClientX = $event.clientX;
    this.oldClientY = $event.clientY;

    this.nodeDisplay(false, className, '');
  }

  mouseUp($event: any, data: any, className: any): void {
    const currentnode = this.nodes.find(m => m.name == data);
    const parents = currentnode.parents;
    const childs = currentnode.childs;
    const nodeStyle = currentnode.style;
    let parentIds: any[] = parents.map((m: any) => m.id);
    let childIds: any[] = childs.map((m: any) => m.id);

    currentnode.nodeX += $event.clientX - this.oldClientX;
    currentnode.nodeY += $event.clientY - this.oldClientY;

    this.getClosestPoints();

    const newChildpoints = this.getNewChildPoints(currentnode, childIds, parentIds);

    childs.forEach((child: any) => {
      const points = this.getMinimumDistanceObjectByChildId(newChildpoints, currentnode.nodeId, child.id);
      child.x1 = points.x1;
      child.y1 = points.y1;
      child.x2 = points.x2;
      child.y2 = points.y2;
    });

    parentIds.forEach(parentId => {
      this.nodes.filter(node => node.nodeId == parentId).map(m => m.childs).forEach(child => {
        child.filter((o: any) => o.id == currentnode.nodeId).forEach((n: any) => {
          const points = this.getMinimumDistanceObjectByChildId(newChildpoints, n.id, parentId);
          n.x1 = points.x2;
          n.y1 = points.y2;
          n.x2 = points.x1;
          n.y2 = points.y1;
        });
      });
    });

    this.getLines();
    this.nodeDisplay(true, className, nodeStyle);
  }

  nodeDisplay(isVisible: boolean, className: any, nodeStyle: any) {
    if (isVisible) {
      const stylesArr = nodeStyle.split(';').find((m: any) => m.includes('fill')).split(':')[1].trim();
      Array.from(document.getElementsByClassName(className + 'HS')).forEach((element: any) => {
        element.style.display = '';
      });
      Array.from(document.getElementsByClassName(className)).forEach((element: any) => {
        element.style.fill = stylesArr;//'#f4f6f7';
      });
    } else {
      Array.from(document.getElementsByClassName(className + 'HS')).forEach((element: any) => {
        element.style.display = 'none';
      });

      Array.from(document.getElementsByClassName(className)).forEach((element: any) => {
        element.style.fill = '#0B5345';
      });
    }
  }

  getDistance(x1: any, y1: any, x2: any, y2: any) {
    let y = x2 - x1;
    let x = y2 - y1;
    return Math.sqrt(x * x + y * y);
  }

  getNewChildPoints(currentnode: any, childIds: any, parentIds: any) {
    let res: any = [];
    let touchPoint = currentnode.touchPoints;
    if (childIds.length > 0) {
      childIds.forEach((childId: any) => {
        let childnode = this.nodes.find(m => m.nodeId == childId);
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.topCenter.x, y1: touchPoint.topCenter.y, x2: childnode.touchPoints.topCenter.x, y2: childnode.touchPoints.topCenter.y, distance: this.getDistance(touchPoint.topCenter.x, touchPoint.topCenter.y, childnode.touchPoints.topCenter.x, childnode.touchPoints.topCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.topCenter.x, y1: touchPoint.topCenter.y, x2: childnode.touchPoints.rightCenter.x, y2: childnode.touchPoints.rightCenter.y, distance: this.getDistance(touchPoint.topCenter.x, touchPoint.topCenter.y, childnode.touchPoints.rightCenter.x, childnode.touchPoints.rightCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.topCenter.x, y1: touchPoint.topCenter.y, x2: childnode.touchPoints.bottomCenter.x, y2: childnode.touchPoints.bottomCenter.y, distance: this.getDistance(touchPoint.topCenter.x, touchPoint.topCenter.y, childnode.touchPoints.bottomCenter.x, childnode.touchPoints.bottomCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.topCenter.x, y1: touchPoint.topCenter.y, x2: childnode.touchPoints.leftCenter.x, y2: childnode.touchPoints.leftCenter.y, distance: this.getDistance(touchPoint.topCenter.x, touchPoint.topCenter.y, childnode.touchPoints.leftCenter.x, childnode.touchPoints.leftCenter.y) });

        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.rightCenter.x, y1: touchPoint.rightCenter.y, x2: childnode.touchPoints.topCenter.x, y2: childnode.touchPoints.topCenter.y, distance: this.getDistance(touchPoint.rightCenter.x, touchPoint.rightCenter.y, childnode.touchPoints.topCenter.x, childnode.touchPoints.topCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.rightCenter.x, y1: touchPoint.rightCenter.y, x2: childnode.touchPoints.rightCenter.x, y2: childnode.touchPoints.rightCenter.y, distance: this.getDistance(touchPoint.rightCenter.x, touchPoint.rightCenter.y, childnode.touchPoints.rightCenter.x, childnode.touchPoints.rightCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.rightCenter.x, y1: touchPoint.rightCenter.y, x2: childnode.touchPoints.bottomCenter.x, y2: childnode.touchPoints.bottomCenter.y, distance: this.getDistance(touchPoint.rightCenter.x, touchPoint.rightCenter.y, childnode.touchPoints.bottomCenter.x, childnode.touchPoints.bottomCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.rightCenter.x, y1: touchPoint.rightCenter.y, x2: childnode.touchPoints.leftCenter.x, y2: childnode.touchPoints.leftCenter.y, distance: this.getDistance(touchPoint.rightCenter.x, touchPoint.rightCenter.y, childnode.touchPoints.leftCenter.x, childnode.touchPoints.leftCenter.y) });

        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.bottomCenter.x, y1: touchPoint.bottomCenter.y, x2: childnode.touchPoints.topCenter.x, y2: childnode.touchPoints.topCenter.y, distance: this.getDistance(touchPoint.bottomCenter.x, touchPoint.bottomCenter.y, childnode.touchPoints.topCenter.x, childnode.touchPoints.topCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.bottomCenter.x, y1: touchPoint.bottomCenter.y, x2: childnode.touchPoints.rightCenter.x, y2: childnode.touchPoints.rightCenter.y, distance: this.getDistance(touchPoint.bottomCenter.x, touchPoint.bottomCenter.y, childnode.touchPoints.rightCenter.x, childnode.touchPoints.rightCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.bottomCenter.x, y1: touchPoint.bottomCenter.y, x2: childnode.touchPoints.bottomCenter.x, y2: childnode.touchPoints.bottomCenter.y, distance: this.getDistance(touchPoint.bottomCenter.x, touchPoint.bottomCenter.y, childnode.touchPoints.bottomCenter.x, childnode.touchPoints.bottomCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.bottomCenter.x, y1: touchPoint.bottomCenter.y, x2: childnode.touchPoints.leftCenter.x, y2: childnode.touchPoints.leftCenter.y, distance: this.getDistance(touchPoint.bottomCenter.x, touchPoint.bottomCenter.y, childnode.touchPoints.leftCenter.x, childnode.touchPoints.leftCenter.y) });

        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.leftCenter.x, y1: touchPoint.leftCenter.y, x2: childnode.touchPoints.topCenter.x, y2: childnode.touchPoints.topCenter.y, distance: this.getDistance(touchPoint.leftCenter.x, touchPoint.leftCenter.y, childnode.touchPoints.topCenter.x, childnode.touchPoints.topCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.leftCenter.x, y1: touchPoint.leftCenter.y, x2: childnode.touchPoints.rightCenter.x, y2: childnode.touchPoints.rightCenter.y, distance: this.getDistance(touchPoint.leftCenter.x, touchPoint.leftCenter.y, childnode.touchPoints.rightCenter.x, childnode.touchPoints.rightCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.leftCenter.x, y1: touchPoint.leftCenter.y, x2: childnode.touchPoints.bottomCenter.x, y2: childnode.touchPoints.bottomCenter.y, distance: this.getDistance(touchPoint.leftCenter.x, touchPoint.leftCenter.y, childnode.touchPoints.bottomCenter.x, childnode.touchPoints.bottomCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: childId, x1: touchPoint.leftCenter.x, y1: touchPoint.leftCenter.y, x2: childnode.touchPoints.leftCenter.x, y2: childnode.touchPoints.leftCenter.y, distance: this.getDistance(touchPoint.leftCenter.x, touchPoint.leftCenter.y, childnode.touchPoints.leftCenter.x, childnode.touchPoints.leftCenter.y) });
      });
    }

    if (parentIds.length > 0) {
      parentIds.forEach((parentId: any) => {
        let parentnode = this.nodes.find(m => m.nodeId == parentId);

        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.topCenter.x, y1: touchPoint.topCenter.y, x2: parentnode.touchPoints.topCenter.x, y2: parentnode.touchPoints.topCenter.y, distance: this.getDistance(touchPoint.topCenter.x, touchPoint.topCenter.y, parentnode.touchPoints.topCenter.x, parentnode.touchPoints.topCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.topCenter.x, y1: touchPoint.topCenter.y, x2: parentnode.touchPoints.rightCenter.x, y2: parentnode.touchPoints.rightCenter.y, distance: this.getDistance(touchPoint.topCenter.x, touchPoint.topCenter.y, parentnode.touchPoints.rightCenter.x, parentnode.touchPoints.rightCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.topCenter.x, y1: touchPoint.topCenter.y, x2: parentnode.touchPoints.bottomCenter.x, y2: parentnode.touchPoints.bottomCenter.y, distance: this.getDistance(touchPoint.topCenter.x, touchPoint.topCenter.y, parentnode.touchPoints.bottomCenter.x, parentnode.touchPoints.bottomCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.topCenter.x, y1: touchPoint.topCenter.y, x2: parentnode.touchPoints.leftCenter.x, y2: parentnode.touchPoints.leftCenter.y, distance: this.getDistance(touchPoint.topCenter.x, touchPoint.topCenter.y, parentnode.touchPoints.leftCenter.x, parentnode.touchPoints.leftCenter.y) });

        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.rightCenter.x, y1: touchPoint.rightCenter.y, x2: parentnode.touchPoints.topCenter.x, y2: parentnode.touchPoints.topCenter.y, distance: this.getDistance(touchPoint.rightCenter.x, touchPoint.rightCenter.y, parentnode.touchPoints.topCenter.x, parentnode.touchPoints.topCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.rightCenter.x, y1: touchPoint.rightCenter.y, x2: parentnode.touchPoints.rightCenter.x, y2: parentnode.touchPoints.rightCenter.y, distance: this.getDistance(touchPoint.rightCenter.x, touchPoint.rightCenter.y, parentnode.touchPoints.rightCenter.x, parentnode.touchPoints.rightCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.rightCenter.x, y1: touchPoint.rightCenter.y, x2: parentnode.touchPoints.bottomCenter.x, y2: parentnode.touchPoints.bottomCenter.y, distance: this.getDistance(touchPoint.rightCenter.x, touchPoint.rightCenter.y, parentnode.touchPoints.bottomCenter.x, parentnode.touchPoints.bottomCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.rightCenter.x, y1: touchPoint.rightCenter.y, x2: parentnode.touchPoints.leftCenter.x, y2: parentnode.touchPoints.leftCenter.y, distance: this.getDistance(touchPoint.rightCenter.x, touchPoint.rightCenter.y, parentnode.touchPoints.leftCenter.x, parentnode.touchPoints.leftCenter.y) });

        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.bottomCenter.x, y1: touchPoint.bottomCenter.y, x2: parentnode.touchPoints.topCenter.x, y2: parentnode.touchPoints.topCenter.y, distance: this.getDistance(touchPoint.bottomCenter.x, touchPoint.bottomCenter.y, parentnode.touchPoints.topCenter.x, parentnode.touchPoints.topCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.bottomCenter.x, y1: touchPoint.bottomCenter.y, x2: parentnode.touchPoints.rightCenter.x, y2: parentnode.touchPoints.rightCenter.y, distance: this.getDistance(touchPoint.bottomCenter.x, touchPoint.bottomCenter.y, parentnode.touchPoints.rightCenter.x, parentnode.touchPoints.rightCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.bottomCenter.x, y1: touchPoint.bottomCenter.y, x2: parentnode.touchPoints.bottomCenter.x, y2: parentnode.touchPoints.bottomCenter.y, distance: this.getDistance(touchPoint.bottomCenter.x, touchPoint.bottomCenter.y, parentnode.touchPoints.bottomCenter.x, parentnode.touchPoints.bottomCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.bottomCenter.x, y1: touchPoint.bottomCenter.y, x2: parentnode.touchPoints.leftCenter.x, y2: parentnode.touchPoints.leftCenter.y, distance: this.getDistance(touchPoint.bottomCenter.x, touchPoint.bottomCenter.y, parentnode.touchPoints.leftCenter.x, parentnode.touchPoints.leftCenter.y) });

        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.leftCenter.x, y1: touchPoint.leftCenter.y, x2: parentnode.touchPoints.topCenter.x, y2: parentnode.touchPoints.topCenter.y, distance: this.getDistance(touchPoint.leftCenter.x, touchPoint.leftCenter.y, parentnode.touchPoints.topCenter.x, parentnode.touchPoints.topCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.leftCenter.x, y1: touchPoint.leftCenter.y, x2: parentnode.touchPoints.rightCenter.x, y2: parentnode.touchPoints.rightCenter.y, distance: this.getDistance(touchPoint.leftCenter.x, touchPoint.leftCenter.y, parentnode.touchPoints.rightCenter.x, parentnode.touchPoints.rightCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.leftCenter.x, y1: touchPoint.leftCenter.y, x2: parentnode.touchPoints.bottomCenter.x, y2: parentnode.touchPoints.bottomCenter.y, distance: this.getDistance(touchPoint.leftCenter.x, touchPoint.leftCenter.y, parentnode.touchPoints.bottomCenter.x, parentnode.touchPoints.bottomCenter.y) });
        res.push({ currentnodeId: currentnode.nodeId, childnodeId: parentId, x1: touchPoint.leftCenter.x, y1: touchPoint.leftCenter.y, x2: parentnode.touchPoints.leftCenter.x, y2: parentnode.touchPoints.leftCenter.y, distance: this.getDistance(touchPoint.leftCenter.x, touchPoint.leftCenter.y, parentnode.touchPoints.leftCenter.x, parentnode.touchPoints.leftCenter.y) });
      });
    }

    return res;
  }

  getMinimumDistanceObjectByChildId(res: any, currentnodeId: any, childId: any) {
    res = res.filter((m: any) => m.childnodeId == childId && m.currentnodeId == currentnodeId);
    const minDistance = this.sort_by_key(res, 'distance');
    return minDistance[0];
  }

  sort_by_key(array: any, key: any) {
    return array.sort(function (a: any, b: any) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  onPrint() {
    const printContents = this.topDiv.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }
}
