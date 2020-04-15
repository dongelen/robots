import anime from "animejs/lib/anime.es.js";

export interface Position {
  x: number;
  y: number;
}

export class Robot {
  public position: Position;
  private element: Element;
  private widthCell: number;
  private heightCell: number;

  private animationTimeLine: any;

  private rotation: number = 0;

  constructor(
    element: HTMLElement,
    position: Position,
    widthCell: number,
    heightCell: number
  ) {
    this.position = position;
    this.element = element;
    this.widthCell = widthCell;
    this.heightCell = heightCell;
    this.animationTimeLine = anime.timeline({
      autoplay: false
    });
  }

  private calculateXMovement(): number {
    if (this.rotation >= 0 && this.rotation < 90) {
      return 1;
    } else if (this.rotation === 90) {
      return 0;
    } else if (this.rotation < 270) {
      return -1;
    }
    return 0;
  }

  private calculateYMovement(): number {
    if (this.rotation === 0 || this.rotation === 180) {
      return 0;
    } else if (this.rotation > 0 && this.rotation < 180) {
      return 1;
    }

    return -1;
  }

  forward() {
    this.position.x = this.position.x + this.calculateXMovement();
    this.position.y = this.position.y + this.calculateYMovement();

    this.animationTimeLine.add({
      targets: this.element,
      translateX: this.widthCell * this.position.x,
      translateY: this.widthCell * this.position.y,
      duration: 1500,
      easing: "easeInOutQuad"
    });
  }

  turn(direction: number = 1) {
    let angle = direction < 0 ? -90 : 90;
    this.rotation = this.rotation + angle;

    this.animationTimeLine.add({
      targets: this.element,
      rotate: this.rotation,
      duration: 1500,
      ease: "easeInOutQuad"
    });
  }

  findElement(name: string): HTMLElement {
    for (let element of this.element.childNodes) {
      if (element.id === name) {
        return element;
      }
    }
  }
  headlights(on: boolean) {
    let headlights = this.findElement("headlights");

    let opacitiyGoal = on ? 1 : 0;

    this.animationTimeLine.add({
      targets: headlights,
      opacity: opacitiyGoal,
      duration: 2500,
      easing: "linear"
    });
  }

  go() {
    this.animationTimeLine.play();
  }
  drawOnCanvas() {
    let newLeft = this.position.x * 100;
    let newLeftString = newLeft.toString() + "px;";
    this.element.style.left = newLeftString;
  }
}

export class CellType {}

export class Level {
  public fields: [CellType] = [];
  private canvases: [HTMLCanvasElement];
  private canvas: HTMLCanvasElement;
  readonly robot: Robot;

  private numberOColumns = 3;
  private numberOfRows = 3;

  constructor(
    canvases: [HTMLCanvasElement],
    numberOfRows: number,
    numberOfColumns: number
  ) {
    console.log("New level");
    this.canvas = canvases[0];
    this.fields = [new CellType()];
    this.numberOColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    let width = this.canvas.width;
    let height = this.canvas.height;
    let columnWidth = width / this.numberOColumns;
    let rowHeight = height / this.numberOfRows;

    this.robot = new Robot(canvases[1], { x: 0, y: 0 }, columnWidth, rowHeight);
  }

  draw() {
    let width = this.canvas.width;
    let height = this.canvas.height;

    let context = this.canvas.getContext("2d");

    let columnWidth = width / this.numberOColumns;
    let rowHeight = height / this.numberOfRows;

    for (let i = 0; i !== this.numberOColumns; i++) {
      for (let j = 0; j !== this.numberOfRows; j++) {
        context.beginPath();
        context.rect(i * columnWidth, j * rowHeight, columnWidth, rowHeight);
        context.stroke();
      }
    }

    this.robot.drawOnCanvas();
  }
}

export class Game {
  private height: number;
  private width: number;
  private numberOfColumns: number;
  private numberOfRows: number;

  constructor(
    width: number,
    height: number,
    numberOfColumns: number,
    numberOfRows: number
  ) {
    this.height = height;
    this.width = width;
    this.numberOfColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
  }

  makeLevel(element: HTMLElement): Level {
    let code = this.createHTMLContainer();
    element.innerHTML = code;

    let canvas1 = document.getElementById("layer1") as HTMLCanvasElement;
    let canvas2 = document.getElementById("robot") as HTMLCanvasElement;
    let l = new Level(
      [canvas1, canvas2],
      this.numberOfColumns,
      this.numberOfRows
    );

    l.draw();
    return l;
  }

  createHTMLContainer(): string {
    let middle = this.width / this.numberOfColumns / 2 - 30;
    let verticalCenter = this.height / this.numberOfRows / 2 - 15;

    let centerHeadLights = verticalCenter - 15;
    let topHeadLights = middle - 36;
    let htmlCode = `

    <style> 
    #robot {
      width: 60px;
      height: 30px;
      left: ${middle};
      top: ${verticalCenter};
      position: relative;
  
    }

    #car {
      position: relative;
      background-image: url("./public/car3.png");
      background-size: 60px 30px; 
      width: 60px;
      height: 30px;
    }

    #headlights {
      width: 60px;
      height: 30px;
      left: ${centerHeadLights};
      top: ${topHeadLights};
      position: absolute;
      opacity : 0;
      background-image: url("./public/lights.png");
      background-size: 60px 30px; 
    }

    #layer1 {
      //display: none;
    }
    </style>

    <div style="position: relative;">
     <canvas id="layer1" width="${this.width}" height="${this.height}" 
       style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>

      <div id="robot">  
        <div id="headlights"></div>

        <div id="car"> </div>
        
      </div>
     </div>
    `;

    return htmlCode;
  }
}
