import { Game } from "./level.ts";

let game = new Game(400, 400, 3, 3);
let level = game.makeLevel(document.getElementById("app") as HTMLElement);
let robot = level.robot;

// Vanaf hier is de student aan de beurt

robot.headlights(true);
robot.forward();
robot.headlights(false);
// robot.frontLightsOn();

robot.turn();
robot.forward();

// robot.leftLightOn();
// robot.rightLightOn();

robot.go();
