import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  TemplateRef,
  HostListener
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as data from '../assets/workflow/nodes.json';
import { SvgService } from '../services/svg.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('tooltip') tooltip!: ElementRef;
  @ViewChild('topDiv') topDiv!: ElementRef;
  @ViewChild('myDialog')
  myDialog!: TemplateRef<any>;

  menuArray: any = [1, 2];
  title = 'demoFlowChart';

  oldClientX: any = 0;
  oldClientY: any = 0;

  screenWidth = '';
  screenHeight = '';

  nodeWidth = 120;
  nodeHeight = 40;
  arrowHead = 5;
  fontSize: any = 18;
  decisionWidth = 70;
  circleWidth = 110;
  circleEventWidth = 80;
  decisionRotate = 45;

  arrows: any = [];
  processNodes: any = [];
  startEndNodes: any = [];
  ioNodes: any = [];
  decisionNodes: any = [];
  startCircleNodes: any = [];
  intermediateCircleNodes: any = [];
  endCircleNodes: any = [];

  rectCallNodes: any = [];
  rectTransactionNodes: any = [];
  rectSubProcessNodes: any = [];

  circleEvents: any = [];
  poolNodes: any = [];
  poolLineNodes: any = [];
  freeTextNodes: any = [];
  freetextVerticalNodes: any = [];
  divStyle: any = '';
  patternList: any = [];
  linetoarrowList: any = [];
  rex = [0];

  nodes: any = (data as any).default;

  constructor(private renderer: Renderer2, private dialog: MatDialog, private svgService: SvgService) { }

  ngOnInit(): void {
    this.screenWidth = '1800px'; // window.innerWidth + 'px';
    this.screenHeight = '1200px'; // window.innerHeight - 125 + 'px';
    this.divStyle =
      'margin: 5px;overflow-x: scroll;width:' + this.screenWidth + ';';
    this.initMethod();
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
    console.log(event.target.id);
    this.isSymbolSelected = true;
    this.selectedSymbolType = 'start';
    this.createSelectedSymbol(event);
    return;
    // selectSymbol
    if (event.target.id === "mainSVG" || event.target.parentElement.id === "mainSVG") {

      const dropzone = event.target;

      const droppedElementId = event.dataTransfer.getData('text');
      const droppedElement = document.getElementById(droppedElementId) as any;

      if (droppedElement.tagName === "rect") {
        this.rex.push(0);
      }
      else if (droppedElement.tagName === "circle") {
        // this.circleshape.push(0);
      }

      if (droppedElement.viewportElement != null) {
        dropzone.appendChild(droppedElement);
        droppedElement.setAttribute('draggable', true);
        const svgPoint = this.svgService.getSVGPoint(event, droppedElement);
        this.setPosition(droppedElement, { x: svgPoint.x, y: svgPoint.y });
      }
    }
  }

  private setPosition(element: any, coord: { x: any, y: any }) {
    if (element.tagName === 'rect') {
      element.setAttribute('rx', 50);
      element.setAttribute('x', coord.x);
      element.setAttribute('y', coord.y);
      element.setAttribute('width', 120);
      element.setAttribute('height', 40);
      element.style.stroke= "#d7dbdd";
      element.style.fill=" #88EAEA";
      
    }
    else {
      element.setAttribute('cx', coord.x);
      element.setAttribute('cy', coord.y);
    }
  }


  //#endregion


  initMethod() {
    this.sort_by_key(this.nodes, 'name');
    this.generateNodes();
    this.getClosestPoints();
    this.getPoints();
    this.getLines();
  }

  generateNodes() {
    this.processNodes = this.nodes.filter((m: any) => m.nodeType == 'process');
    this.startEndNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'startend'
    );
    this.ioNodes = this.nodes.filter((m: any) => m.nodeType == 'io');
    this.decisionNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'decision'
    );
    this.startCircleNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'startcircle'
    );
    this.intermediateCircleNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'intermediatecircle'
    );
    this.endCircleNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'endcircle'
    );
    this.rectSubProcessNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'rectsubprocess'
    );
    this.rectCallNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'rectcall'
    );
    this.rectTransactionNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'recttransaction'
    );
    this.circleEvents = this.nodes.filter(
      (m: any) => m.nodeType == 'circleevent'
    );
    this.poolNodes = this.nodes.filter((m: any) => m.nodeType == 'pool');
    this.poolLineNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'poolline'
    );
    this.linetoarrowList = this.nodes.filter(
      (m: any) => m.nodeType == 'linetoarrow'
    );
    this.freeTextNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'freetext'
    );
    this.freetextVerticalNodes = this.nodes.filter(
      (m: any) => m.nodeType == 'freetextvertical'
    );
    this.patternList = this.nodes
      .filter((m: any) => m.patternId != '')
      .map((m: any) => ({
        patternId: m.patternId,
        patternImage: m.patternImage,
      }));
  }

  getPoints() {
    this.nodes.forEach((currentnode: any) => {
      const parents = currentnode.parents;
      const childs = currentnode.childs;
      let parentIds: any[] = parents.map((m: any) => m.id);
      let childIds: any[] = childs.map((m: any) => m.id);
      const newChildpoints = this.getNewChildPoints(
        currentnode,
        childIds,
        parentIds
      );

      childs.forEach((child: any) => {
        const points = this.getMinimumDistanceObjectByChildId(
          newChildpoints,
          currentnode.nodeId,
          child.id
        );
        child.x1 = points.x1;
        child.y1 = points.y1;
        child.x2 = points.x2;
        child.y2 = points.y2;
      });

      parentIds.forEach((parentId) => {
        this.nodes
          .filter((node: any) => node.nodeId == parentId)
          .map((m: any) => m.childs)
          .forEach((child: any) => {
            child
              .filter((o: any) => o.id == currentnode.nodeId)
              .forEach((n: any) => {
                const points = this.getMinimumDistanceObjectByChildId(
                  newChildpoints,
                  n.id,
                  parentId
                );
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
    var newX =
      (x - centerx) * Math.cos((degrees * Math.PI) / 180) -
      (y - centery) * Math.sin((degrees * Math.PI) / 180) +
      centerx;
    var newY =
      (x - centerx) * Math.sin((degrees * Math.PI) / 180) +
      (y - centery) * Math.cos((degrees * Math.PI) / 180) +
      centery;
    return { newX, newY };
  }

  getClosestPoints() {
    this.nodes.forEach((node: any) => {
      const x = node.nodeX;
      const y = node.nodeY;
      const nodeType = node.nodeType;

      switch (nodeType) {
        case 'pool':
          const height = node.height;
          const width = node.width;
          node.touchPoints.mid.x = x + width / 2;
          node.touchPoints.mid.y = y + height / 2;

          node.touchPoints.topCenter.x = node.touchPoints.mid.x;
          node.touchPoints.topCenter.y = node.touchPoints.mid.y - height / 2;

          node.touchPoints.rightCenter.x = node.touchPoints.mid.x + width / 2;
          node.touchPoints.rightCenter.y = node.touchPoints.mid.y;

          node.touchPoints.bottomCenter.x = node.touchPoints.mid.x;
          node.touchPoints.bottomCenter.y = node.touchPoints.mid.y + height / 2;

          node.touchPoints.leftCenter.x = node.touchPoints.mid.x - width / 2;
          node.touchPoints.leftCenter.y = node.touchPoints.mid.y;

          break;
        case 'circleevent':
          node.touchPoints.mid.x = x + this.circleEventWidth / 2;
          node.touchPoints.mid.y = y + this.circleEventWidth / 2;

          node.touchPoints.topCenter.x = node.touchPoints.mid.x;
          node.touchPoints.topCenter.y =
            node.touchPoints.mid.y - this.circleEventWidth / 2;

          node.touchPoints.rightCenter.x =
            node.touchPoints.mid.x + this.circleEventWidth / 2;
          node.touchPoints.rightCenter.y = node.touchPoints.mid.y;

          node.touchPoints.bottomCenter.x = node.touchPoints.mid.x;
          node.touchPoints.bottomCenter.y =
            node.touchPoints.mid.y + this.circleEventWidth / 2;

          node.touchPoints.leftCenter.x =
            node.touchPoints.mid.x - this.circleEventWidth / 2;
          node.touchPoints.leftCenter.y = node.touchPoints.mid.y;

          break;
        case 'startcircle':
        case 'intermediatecircle':
        case 'endcircle':
        case 'circlemail':
          node.touchPoints.mid.x = x + this.circleWidth / 2;
          node.touchPoints.mid.y = y + this.circleWidth / 2;

          node.touchPoints.topCenter.x = node.touchPoints.mid.x;
          node.touchPoints.topCenter.y =
            node.touchPoints.mid.y - this.circleWidth / 2;

          node.touchPoints.rightCenter.x =
            node.touchPoints.mid.x + this.circleWidth / 2;
          node.touchPoints.rightCenter.y = node.touchPoints.mid.y;

          node.touchPoints.bottomCenter.x = node.touchPoints.mid.x;
          node.touchPoints.bottomCenter.y =
            node.touchPoints.mid.y + this.circleWidth / 2;

          node.touchPoints.leftCenter.x =
            node.touchPoints.mid.x - this.circleWidth / 2;
          node.touchPoints.leftCenter.y = node.touchPoints.mid.y;

          break;
        case 'decision':
          const decisionTC = this.rotatePoint(
            x,
            y,
            x + this.decisionWidth / 2,
            y + this.decisionWidth / 2,
            this.decisionRotate
          );
          node.touchPoints.topCenter.x = decisionTC.newX;
          node.touchPoints.topCenter.y = decisionTC.newY;

          const decisionRC = this.rotatePoint(
            x + this.decisionWidth,
            y,
            x + this.decisionWidth / 2,
            y + this.decisionWidth / 2,
            this.decisionRotate
          );
          node.touchPoints.rightCenter.x = decisionRC.newX;
          node.touchPoints.rightCenter.y = decisionRC.newY;

          const decisionBC = this.rotatePoint(
            x + this.decisionWidth,
            y + this.decisionWidth,
            x + this.decisionWidth / 2,
            y + this.decisionWidth / 2,
            this.decisionRotate
          );
          node.touchPoints.bottomCenter.x = decisionBC.newX;
          node.touchPoints.bottomCenter.y = decisionBC.newY;

          const decisionLC = this.rotatePoint(
            x,
            y + this.decisionWidth,
            x + this.decisionWidth / 2,
            y + this.decisionWidth / 2,
            this.decisionRotate
          );
          node.touchPoints.leftCenter.x = decisionLC.newX;
          node.touchPoints.leftCenter.y = decisionLC.newY;

          const decisionMID = this.rotatePoint(
            x + this.decisionWidth,
            y + this.decisionWidth,
            x + this.decisionWidth / 2,
            y + this.decisionWidth / 2,
            this.decisionRotate
          );
          node.touchPoints.mid.x = decisionMID.newX;
          node.touchPoints.mid.y = decisionMID.newY;

          break;
        default:
          node.touchPoints.topCenter.x = x + this.nodeWidth / 2;
          node.touchPoints.topCenter.y = y;

          node.touchPoints.rightCenter.x = x + this.nodeWidth;
          node.touchPoints.rightCenter.y = y + this.nodeHeight / 2;

          node.touchPoints.bottomCenter.x = x + this.nodeWidth / 2;
          node.touchPoints.bottomCenter.y = y + this.nodeHeight;

          node.touchPoints.leftCenter.x = x;
          node.touchPoints.leftCenter.y = y + this.nodeHeight / 2;

          node.touchPoints.mid.x = x + this.nodeWidth / 2;
          node.touchPoints.mid.y = y + this.nodeHeight / 2;
      }
    });
  }

  getLines() {
    this.arrows = [];
    this.nodes.forEach((node: any) => {
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

  isPoolLineClicked: boolean = false;
  isSelectedLineStart: boolean = false;
  selectedLineId: any = 0;

  isL2AClicked: boolean = false;
  isSelectedL2AStart: boolean = false;
  selectedL2AId: any = 0;
  mouseDown(
    $event: any,
    data: any,
    className: any,
    isPoolDrag: boolean = false,
    isLineStart: boolean = false
  ): void {
    const currentnode = this.nodes.find((m: any) => m.nodeId == data);
    const nodeType = currentnode.nodeType;
    this.isPoolLineClicked = false;
    this.isL2AClicked = false;
    if (nodeType == 'poolline') {
      this.isPoolLineClicked = true;
      this.isSelectedLineStart = isLineStart;
      this.selectedLineId = data;
    } else if (nodeType == 'linetoarrow') {
      this.isL2AClicked = true;
      this.isSelectedL2AStart = isLineStart;
      this.selectedL2AId = data;
    }
    this.oldClientX = $event.clientX;
    this.oldClientY = $event.clientY;

    this.nodeDisplay(false, className, '', isPoolDrag);
  }

  mouseUp(
    $event: any,
    data: any,
    className: any,
    isPoolDrag: boolean = false,
    isLineStart: boolean = false
  ): void {
    if (data != this.selectedLineId && this.isPoolLineClicked) {
      data = this.selectedLineId;
      isPoolDrag = true;
      this.selectedLineId = 0;
      this.isPoolLineClicked = false;
    }
    if (data != this.selectedL2AId && this.isL2AClicked) {
      const selectedLineObj = this.nodes.find(
        (m: any) => m.nodeId == this.selectedL2AId
      );
      if (this.isSelectedL2AStart) {
        selectedLineObj.childs.push({ id: data });
      } else {
        selectedLineObj.parents.push({ id: data });
      }
      data = this.selectedL2AId;
      isPoolDrag = true;
      if (
        selectedLineObj.childs.length > 0 &&
        selectedLineObj.parents.length > 0
      ) {
        const parentId = selectedLineObj.parents[0].id;
        const childId = selectedLineObj.childs[0].id;
        const parentNode = this.nodes.find((m: any) => m.nodeId == parentId);
        const childNode = this.nodes.find((m: any) => m.nodeId == childId);
        parentNode.childs.push({
          id: childId,
          lineStyle: 'stroke: #5DADE2; stroke-width: 4;',
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
          className: 'class' + childId + 'HS Line',
        });
        childNode.parents.push({ id: parentId });
        this.nodes = this.nodes.filter(
          (m: any) => m.nodeId != this.selectedL2AId
        );
        this.selectedL2AId = 0;
        this.isL2AClicked = false;
        this.initMethod();
      }
    }
    const currentnode = this.nodes.find((m: any) => m.nodeId == data);
    if (currentnode) {
      const nodeType = currentnode.nodeType;
      const parents = currentnode.parents;
      const childs = currentnode.childs;
      let parentIds: any[] = parents.map((m: any) => m.id);
      let childIds: any[] = childs.map((m: any) => m.id);
      const nodeStyle = currentnode.style;

      if (isPoolDrag) {
        if (nodeType == 'poolline' || nodeType == 'linetoarrow') {
          if (isLineStart) {
            currentnode.lineCordinates.x1 += $event.clientX - this.oldClientX;
            currentnode.lineCordinates.y1 += $event.clientY - this.oldClientY;
          } else {
            currentnode.lineCordinates.x2 += $event.clientX - this.oldClientX;
            currentnode.lineCordinates.y2 += $event.clientY - this.oldClientY;
          }
        } else {
          currentnode.width += $event.clientX - this.oldClientX;
          currentnode.height += $event.clientY - this.oldClientY;
        }
      } else {
        currentnode.nodeX += $event.clientX - this.oldClientX;
        currentnode.nodeY += $event.clientY - this.oldClientY;
      }

      this.getClosestPoints();

      const newChildpoints = this.getNewChildPoints(
        currentnode,
        childIds,
        parentIds
      );

      childs.forEach((child: any) => {
        const points = this.getMinimumDistanceObjectByChildId(
          newChildpoints,
          currentnode.nodeId,
          child.id
        );
        child.x1 = points.x1;
        child.y1 = points.y1;
        child.x2 = points.x2;
        child.y2 = points.y2;
      });

      parentIds.forEach((parentId) => {
        this.nodes
          .filter((node: any) => node.nodeId == parentId)
          .map((m: any) => m.childs)
          .forEach((child: any) => {
            child
              .filter((o: any) => o.id == currentnode.nodeId)
              .forEach((n: any) => {
                const points = this.getMinimumDistanceObjectByChildId(
                  newChildpoints,
                  n.id,
                  parentId
                );
                n.x1 = points.x2;
                n.y1 = points.y2;
                n.x2 = points.x1;
                n.y2 = points.y1;
              });
          });
      });

      this.getLines();
      this.nodeDisplay(true, className, nodeStyle, isPoolDrag);
    }
  }

  nodeDisplay(
    isVisible: boolean,
    className: any,
    nodeStyle: any,
    isPoolDrag: any
  ) {
    if (!isPoolDrag) {
      if (isVisible) {
        const fillArr = nodeStyle
          .split(';')
          .find((m: any) => m.includes('fill'));
        const stylesArr = fillArr ? fillArr.split(':')[1].trim() : '';
        Array.from(document.getElementsByClassName(className + 'HS')).forEach(
          (element: any) => {
            element.style.display = '';
          }
        );
        Array.from(document.getElementsByClassName(className)).forEach(
          (element: any) => {
            element.style.fill = stylesArr; //'#f4f6f7';
          }
        );
      } else {
        Array.from(document.getElementsByClassName(className + 'HS')).forEach(
          (element: any) => {
            element.style.display = 'none';
          }
        );

        Array.from(document.getElementsByClassName(className)).forEach(
          (element: any) => {
            element.style.fill = '#0B5345';
          }
        );
      }
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
        let childnode = this.nodes.find((m: any) => m.nodeId == childId);
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.topCenter.x,
          y1: touchPoint.topCenter.y,
          x2: childnode.touchPoints.topCenter.x,
          y2: childnode.touchPoints.topCenter.y,
          distance: this.getDistance(
            touchPoint.topCenter.x,
            touchPoint.topCenter.y,
            childnode.touchPoints.topCenter.x,
            childnode.touchPoints.topCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.topCenter.x,
          y1: touchPoint.topCenter.y,
          x2: childnode.touchPoints.rightCenter.x,
          y2: childnode.touchPoints.rightCenter.y,
          distance: this.getDistance(
            touchPoint.topCenter.x,
            touchPoint.topCenter.y,
            childnode.touchPoints.rightCenter.x,
            childnode.touchPoints.rightCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.topCenter.x,
          y1: touchPoint.topCenter.y,
          x2: childnode.touchPoints.bottomCenter.x,
          y2: childnode.touchPoints.bottomCenter.y,
          distance: this.getDistance(
            touchPoint.topCenter.x,
            touchPoint.topCenter.y,
            childnode.touchPoints.bottomCenter.x,
            childnode.touchPoints.bottomCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.topCenter.x,
          y1: touchPoint.topCenter.y,
          x2: childnode.touchPoints.leftCenter.x,
          y2: childnode.touchPoints.leftCenter.y,
          distance: this.getDistance(
            touchPoint.topCenter.x,
            touchPoint.topCenter.y,
            childnode.touchPoints.leftCenter.x,
            childnode.touchPoints.leftCenter.y
          ),
        });

        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.rightCenter.x,
          y1: touchPoint.rightCenter.y,
          x2: childnode.touchPoints.topCenter.x,
          y2: childnode.touchPoints.topCenter.y,
          distance: this.getDistance(
            touchPoint.rightCenter.x,
            touchPoint.rightCenter.y,
            childnode.touchPoints.topCenter.x,
            childnode.touchPoints.topCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.rightCenter.x,
          y1: touchPoint.rightCenter.y,
          x2: childnode.touchPoints.rightCenter.x,
          y2: childnode.touchPoints.rightCenter.y,
          distance: this.getDistance(
            touchPoint.rightCenter.x,
            touchPoint.rightCenter.y,
            childnode.touchPoints.rightCenter.x,
            childnode.touchPoints.rightCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.rightCenter.x,
          y1: touchPoint.rightCenter.y,
          x2: childnode.touchPoints.bottomCenter.x,
          y2: childnode.touchPoints.bottomCenter.y,
          distance: this.getDistance(
            touchPoint.rightCenter.x,
            touchPoint.rightCenter.y,
            childnode.touchPoints.bottomCenter.x,
            childnode.touchPoints.bottomCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.rightCenter.x,
          y1: touchPoint.rightCenter.y,
          x2: childnode.touchPoints.leftCenter.x,
          y2: childnode.touchPoints.leftCenter.y,
          distance: this.getDistance(
            touchPoint.rightCenter.x,
            touchPoint.rightCenter.y,
            childnode.touchPoints.leftCenter.x,
            childnode.touchPoints.leftCenter.y
          ),
        });

        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.bottomCenter.x,
          y1: touchPoint.bottomCenter.y,
          x2: childnode.touchPoints.topCenter.x,
          y2: childnode.touchPoints.topCenter.y,
          distance: this.getDistance(
            touchPoint.bottomCenter.x,
            touchPoint.bottomCenter.y,
            childnode.touchPoints.topCenter.x,
            childnode.touchPoints.topCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.bottomCenter.x,
          y1: touchPoint.bottomCenter.y,
          x2: childnode.touchPoints.rightCenter.x,
          y2: childnode.touchPoints.rightCenter.y,
          distance: this.getDistance(
            touchPoint.bottomCenter.x,
            touchPoint.bottomCenter.y,
            childnode.touchPoints.rightCenter.x,
            childnode.touchPoints.rightCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.bottomCenter.x,
          y1: touchPoint.bottomCenter.y,
          x2: childnode.touchPoints.bottomCenter.x,
          y2: childnode.touchPoints.bottomCenter.y,
          distance: this.getDistance(
            touchPoint.bottomCenter.x,
            touchPoint.bottomCenter.y,
            childnode.touchPoints.bottomCenter.x,
            childnode.touchPoints.bottomCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.bottomCenter.x,
          y1: touchPoint.bottomCenter.y,
          x2: childnode.touchPoints.leftCenter.x,
          y2: childnode.touchPoints.leftCenter.y,
          distance: this.getDistance(
            touchPoint.bottomCenter.x,
            touchPoint.bottomCenter.y,
            childnode.touchPoints.leftCenter.x,
            childnode.touchPoints.leftCenter.y
          ),
        });

        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.leftCenter.x,
          y1: touchPoint.leftCenter.y,
          x2: childnode.touchPoints.topCenter.x,
          y2: childnode.touchPoints.topCenter.y,
          distance: this.getDistance(
            touchPoint.leftCenter.x,
            touchPoint.leftCenter.y,
            childnode.touchPoints.topCenter.x,
            childnode.touchPoints.topCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.leftCenter.x,
          y1: touchPoint.leftCenter.y,
          x2: childnode.touchPoints.rightCenter.x,
          y2: childnode.touchPoints.rightCenter.y,
          distance: this.getDistance(
            touchPoint.leftCenter.x,
            touchPoint.leftCenter.y,
            childnode.touchPoints.rightCenter.x,
            childnode.touchPoints.rightCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.leftCenter.x,
          y1: touchPoint.leftCenter.y,
          x2: childnode.touchPoints.bottomCenter.x,
          y2: childnode.touchPoints.bottomCenter.y,
          distance: this.getDistance(
            touchPoint.leftCenter.x,
            touchPoint.leftCenter.y,
            childnode.touchPoints.bottomCenter.x,
            childnode.touchPoints.bottomCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: childId,
          x1: touchPoint.leftCenter.x,
          y1: touchPoint.leftCenter.y,
          x2: childnode.touchPoints.leftCenter.x,
          y2: childnode.touchPoints.leftCenter.y,
          distance: this.getDistance(
            touchPoint.leftCenter.x,
            touchPoint.leftCenter.y,
            childnode.touchPoints.leftCenter.x,
            childnode.touchPoints.leftCenter.y
          ),
        });
      });
    }

    if (parentIds.length > 0) {
      parentIds.forEach((parentId: any) => {
        let parentnode = this.nodes.find((m: any) => m.nodeId == parentId);

        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.topCenter.x,
          y1: touchPoint.topCenter.y,
          x2: parentnode.touchPoints.topCenter.x,
          y2: parentnode.touchPoints.topCenter.y,
          distance: this.getDistance(
            touchPoint.topCenter.x,
            touchPoint.topCenter.y,
            parentnode.touchPoints.topCenter.x,
            parentnode.touchPoints.topCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.topCenter.x,
          y1: touchPoint.topCenter.y,
          x2: parentnode.touchPoints.rightCenter.x,
          y2: parentnode.touchPoints.rightCenter.y,
          distance: this.getDistance(
            touchPoint.topCenter.x,
            touchPoint.topCenter.y,
            parentnode.touchPoints.rightCenter.x,
            parentnode.touchPoints.rightCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.topCenter.x,
          y1: touchPoint.topCenter.y,
          x2: parentnode.touchPoints.bottomCenter.x,
          y2: parentnode.touchPoints.bottomCenter.y,
          distance: this.getDistance(
            touchPoint.topCenter.x,
            touchPoint.topCenter.y,
            parentnode.touchPoints.bottomCenter.x,
            parentnode.touchPoints.bottomCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.topCenter.x,
          y1: touchPoint.topCenter.y,
          x2: parentnode.touchPoints.leftCenter.x,
          y2: parentnode.touchPoints.leftCenter.y,
          distance: this.getDistance(
            touchPoint.topCenter.x,
            touchPoint.topCenter.y,
            parentnode.touchPoints.leftCenter.x,
            parentnode.touchPoints.leftCenter.y
          ),
        });

        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.rightCenter.x,
          y1: touchPoint.rightCenter.y,
          x2: parentnode.touchPoints.topCenter.x,
          y2: parentnode.touchPoints.topCenter.y,
          distance: this.getDistance(
            touchPoint.rightCenter.x,
            touchPoint.rightCenter.y,
            parentnode.touchPoints.topCenter.x,
            parentnode.touchPoints.topCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.rightCenter.x,
          y1: touchPoint.rightCenter.y,
          x2: parentnode.touchPoints.rightCenter.x,
          y2: parentnode.touchPoints.rightCenter.y,
          distance: this.getDistance(
            touchPoint.rightCenter.x,
            touchPoint.rightCenter.y,
            parentnode.touchPoints.rightCenter.x,
            parentnode.touchPoints.rightCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.rightCenter.x,
          y1: touchPoint.rightCenter.y,
          x2: parentnode.touchPoints.bottomCenter.x,
          y2: parentnode.touchPoints.bottomCenter.y,
          distance: this.getDistance(
            touchPoint.rightCenter.x,
            touchPoint.rightCenter.y,
            parentnode.touchPoints.bottomCenter.x,
            parentnode.touchPoints.bottomCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.rightCenter.x,
          y1: touchPoint.rightCenter.y,
          x2: parentnode.touchPoints.leftCenter.x,
          y2: parentnode.touchPoints.leftCenter.y,
          distance: this.getDistance(
            touchPoint.rightCenter.x,
            touchPoint.rightCenter.y,
            parentnode.touchPoints.leftCenter.x,
            parentnode.touchPoints.leftCenter.y
          ),
        });

        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.bottomCenter.x,
          y1: touchPoint.bottomCenter.y,
          x2: parentnode.touchPoints.topCenter.x,
          y2: parentnode.touchPoints.topCenter.y,
          distance: this.getDistance(
            touchPoint.bottomCenter.x,
            touchPoint.bottomCenter.y,
            parentnode.touchPoints.topCenter.x,
            parentnode.touchPoints.topCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.bottomCenter.x,
          y1: touchPoint.bottomCenter.y,
          x2: parentnode.touchPoints.rightCenter.x,
          y2: parentnode.touchPoints.rightCenter.y,
          distance: this.getDistance(
            touchPoint.bottomCenter.x,
            touchPoint.bottomCenter.y,
            parentnode.touchPoints.rightCenter.x,
            parentnode.touchPoints.rightCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.bottomCenter.x,
          y1: touchPoint.bottomCenter.y,
          x2: parentnode.touchPoints.bottomCenter.x,
          y2: parentnode.touchPoints.bottomCenter.y,
          distance: this.getDistance(
            touchPoint.bottomCenter.x,
            touchPoint.bottomCenter.y,
            parentnode.touchPoints.bottomCenter.x,
            parentnode.touchPoints.bottomCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.bottomCenter.x,
          y1: touchPoint.bottomCenter.y,
          x2: parentnode.touchPoints.leftCenter.x,
          y2: parentnode.touchPoints.leftCenter.y,
          distance: this.getDistance(
            touchPoint.bottomCenter.x,
            touchPoint.bottomCenter.y,
            parentnode.touchPoints.leftCenter.x,
            parentnode.touchPoints.leftCenter.y
          ),
        });

        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.leftCenter.x,
          y1: touchPoint.leftCenter.y,
          x2: parentnode.touchPoints.topCenter.x,
          y2: parentnode.touchPoints.topCenter.y,
          distance: this.getDistance(
            touchPoint.leftCenter.x,
            touchPoint.leftCenter.y,
            parentnode.touchPoints.topCenter.x,
            parentnode.touchPoints.topCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.leftCenter.x,
          y1: touchPoint.leftCenter.y,
          x2: parentnode.touchPoints.rightCenter.x,
          y2: parentnode.touchPoints.rightCenter.y,
          distance: this.getDistance(
            touchPoint.leftCenter.x,
            touchPoint.leftCenter.y,
            parentnode.touchPoints.rightCenter.x,
            parentnode.touchPoints.rightCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.leftCenter.x,
          y1: touchPoint.leftCenter.y,
          x2: parentnode.touchPoints.bottomCenter.x,
          y2: parentnode.touchPoints.bottomCenter.y,
          distance: this.getDistance(
            touchPoint.leftCenter.x,
            touchPoint.leftCenter.y,
            parentnode.touchPoints.bottomCenter.x,
            parentnode.touchPoints.bottomCenter.y
          ),
        });
        res.push({
          currentnodeId: currentnode.nodeId,
          childnodeId: parentId,
          x1: touchPoint.leftCenter.x,
          y1: touchPoint.leftCenter.y,
          x2: parentnode.touchPoints.leftCenter.x,
          y2: parentnode.touchPoints.leftCenter.y,
          distance: this.getDistance(
            touchPoint.leftCenter.x,
            touchPoint.leftCenter.y,
            parentnode.touchPoints.leftCenter.x,
            parentnode.touchPoints.leftCenter.y
          ),
        });
      });
    }

    return res;
  }

  getMinimumDistanceObjectByChildId(
    res: any,
    currentnodeId: any,
    childId: any
  ) {
    res = res.filter(
      (m: any) => m.childnodeId == childId && m.currentnodeId == currentnodeId
    );
    const minDistance = this.sort_by_key(res, 'distance');
    return minDistance[0];
  }

  sort_by_key(array: any, key: any) {
    return array.sort(function (a: any, b: any) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  onPrint() {
    const printContents = this.topDiv.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  openForm() {
    this.dialog.open(this.myDialog, {
      disableClose: true,
      panelClass: 'selectParticipants',
    });
  }

  SaveRecord() { }

  close() {
    this.dialog.closeAll();
  }

  isSymbolSelected: boolean = false;
  selectedSymbolType: string = '';

  selectSymbol(symbolType: any) {
    this.isSymbolSelected = true;
    this.selectedSymbolType = symbolType;
  }

  createSelectedSymbol($event: any) {
    if (this.isSymbolSelected) {
      let newNode: any;
      switch (this.selectedSymbolType) {
        case 'start':
          newNode = JSON.parse(
            '{"nodeId":1,"nodeType":"startend","nodeY":100,"nodeX":50,"height":0,"width":0,"name":"Start","className":"StartClass","bg":"","patternId":"","patternImage":"","lineCordinates":{"x1":0,"y1":0,"x2":0,"y2":0},"touchPoints":{"topCenter":{"x":0,"y":0},"rightCenter":{"x":0,"y":0},"bottomCenter":{"x":0,"y":0},"leftCenter":{"x":0,"y":0},"mid":{"x":0,"y":0}},"parents":[],"style":"fill: #88EAEA; stroke-width: 1; stroke: #d7dbdd","childs":[]}'
          );
          break;
      }
      const newNodeId = Math.max(...this.nodes.map((m: any) => m.nodeId)) + 1;
      newNode.nodeId = newNodeId;

      newNode.nodeX = $event.offsetX;
      newNode.nodeY = $event.offsetY;
      this.nodes.push(newNode);
      this.initMethod();
      this.isSymbolSelected = false;
      //this.openForm();
    }
  }

  lineMouseLeave(className: any) {
    Array.from(document.getElementsByClassName(className + 'HS')).forEach(
      (element: any) => {
        element.style.display = 'none';
      }
    );
  }

  lineMouseOver(className: any) {
    Array.from(document.getElementsByClassName(className + 'HS')).forEach(
      (element: any) => {
        element.style.display = 'block';
      }
    );
  }
}
