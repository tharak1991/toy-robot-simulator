import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IGame } from 'src/app/core/interface/robot';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-home-toy-new',
    templateUrl: './home-toy-new.component.html',
    styleUrls: ['./home-toy.scss'],
})
export class HomeToyNewComponent implements OnInit {

    // robot model
    robot: IGame;

    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    //canvas object
    ctx: any;

    toyForm: FormGroup;
    showFallError = false;

    constructor(public formBuilder: FormBuilder) { }

    ngOnInit() {
        this.robot = {
            value: '',
            location: {},
            facing: {},
            placed: false,
            actions: []

        }
        this.showFallError = false;
        this.toyForm = this.formBuilder.group({
            userInput: [''],
        });

        //Initial table drawing
        this.drawTable(0, 0, false, '');
    }

    //Commands reset
    reset = () => {
        this.robot = {
            value: "",
            location: null,
            facing: { x: 0, y: 0 },
            placed: false,
            actions: []
        };
        this.toyForm.reset();
        this.showFallError = false;
    }

    executeCommand = () => {
        this.showFallError = false;

        //Coordinate dimensions
        let xCoord = 0;
        let yCoord = 0;

        const inputCommand = this.toyForm.controls.userInput.value.trim().toUpperCase();
        const inputFormatted = inputCommand.split(/[\s,]+/);

        // If the first word isn't a command, we ignore it
        let command = inputFormatted[0];

        //place the robot
        if (command === "PLACE") {
            this.placeRobot(inputFormatted);
        }

        // Ignore everything else until robot is placed
        if (this.robot.placed) {
            if (command === "MOVE") {
                this.moveRobot();
            } else if (command === "LEFT") {
                this.turnRobot('LEFT');

            } else if (command === "RIGHT") {
                this.turnRobot('RIGHT');

            } else if (command === "REPORT") {
                this.report();
            }
        }
        // Reset value in input
        this.robot.value = '';
    }

    placeRobot = (inputFormatted) => {
        let xCoord = 0;
        let yCoord = 0;
        if (inputFormatted.length === 4) {
            let x = parseInt(inputFormatted[1], 10),
                y = parseInt(inputFormatted[2], 10),
                f = inputFormatted[3];
            const facing = orientation[f];
            // Check if the robot is still on the table, and valid direction
            if (x > -1 && x < 5 && y > -1 && y < 5 && facing) {
                xCoord = this.getposition(x);
                yCoord = this.getposition(y);
                this.robot = {
                    value: this.robot.value,
                    location: { x, y },
                    facing: facing,
                    placed: true,
                    actions: [...this.robot.actions, `PLACE ${x},${y},${f}`]
                }
            }
        }
        this.changeImagePosition(xCoord, yCoord, true, '');
    }

    moveRobot = () => {

        let xCoord = 0;
        let yCoord = 0;
        const moveX = this.robot.facing.x;
        const moveY = this.robot.facing.y;
        // Make sure the robot won't fall off the table
        const nextX = this.robot.location.x + moveX;
        const nextY = this.robot.location.y + moveY;

        if (nextX > -1 && nextX < 5 && nextY > -1 && nextY < 5) {
            this.robot.location = { x: nextX, y: nextY };
            this.robot.actions = [...this.robot.actions, "MOVE"];
            this.showFallError = false;
            xCoord = this.getposition(nextX);
            yCoord = this.getposition(nextY);
            this.changeImagePosition(xCoord, yCoord, true, '');
        } else {
            //robot out of table
            this.showFallError = true;
        }
    }

    turnRobot = (rotation) => {

        let xCoord = 0;
        let yCoord = 0;

        const x = this.robot.facing.x;
        const y = this.robot.facing.y;

        xCoord = this.getposition(this.robot.location.x);
        yCoord = this.getposition(this.robot.location.y);

        if (rotation == 'LEFT') {
            this.robot.facing = { x: -y, y: x },
                this.robot.actions = [...this.robot.actions, rotation];

        } else if (rotation == 'RIGHT') {
            this.robot.facing = { x: y, y: -x },
                this.robot.actions = [...this.robot.actions, rotation];
        }

    }

    report = () => {
        const location = this.robot.location;
        var report = `Output: ${location.x},${location.y},${
            direction.x[this.robot.facing.x.toString()].y[
            this.robot.facing.y.toString()
            ]
            }`;
        this.robot.actions = [...this.robot.actions, "REPORT", report];
    }

    getposition(x) {
        let xcord = 0;
        switch (x) {
            case 0:
                xcord = 0;
                break;
            case 1:
                xcord = 50;
                break;
            case 2:
                xcord = 100;
                break;
            case 3:
                xcord = 150;
                break;
            case 4:
                xcord = 200;
                break;
            case 5:
                xcord = 250;
                break;
        }
        return xcord;
    }

    drawTable(x = 0, y = 0, isUpdate = false, rotate = '') {

        if (rotate != '') {
            this.ctx.clearRect(0, 0, 300, 300);

        }

        this.ctx = this.canvas.nativeElement.getContext('2d');

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.ctx.moveTo(0, 60 * j);
                this.ctx.lineTo(300, 60 * j);
                this.ctx.stroke();

                this.ctx.moveTo(60 * i, 0);
                this.ctx.lineTo(60 * i, 300);
                this.ctx.stroke();
                var left = 0;
                for (var a = 0; a < 5; a++) {
                    for (var b = 0; b < 5; b += 2) {
                        var startX = b * 60;
                        if (a % 2 == 0) startX = (b + 1) * 60;
                        this.ctx.fillRect(startX + left, (a * 60), 60, 60);
                    }
                }
            }
        }

        var img = new Image();
        img.onload = () => {
            let buffer = 0;
            if (isUpdate) {
                buffer = 35;
            }
            this.ctx.drawImage(img, x - buffer, y - buffer, 60, 60);
            // do other canvas handling here!
        }
        img.src = "assets/img/robot.png";
    }

    changeImagePosition(x, y, isUpdate = false, rotate) {
        this.ctx.clearRect(0, 0, 300, 300);
        this.drawTable(x, y, isUpdate, rotate);
    }
}

//Orientation
const orientation = {
    NORTH: { x: 0, y: 1 },
    SOUTH: { x: 0, y: -1 },
    WEST: { x: -1, y: 0 },
    EAST: { x: 1, y: 0 }
};

// Used to get direction for output
const direction = {
    x: {
        "0": {
            y: {
                "1": "NORTH",
                "-1": "SOUTH"
            }
        },
        "1": {
            y: {
                "0": "EAST"
            }
        },
        "-1": {
            y: {
                "0": "WEST"
            }
        }
    }
};


    // rotateCanvas(x, y, isUpdate = false, rotate = '') {
    //   this.ctx.clearRect(0, 0, 300, 300);
    //   this.drawTable(x, y, isUpdate, rotate,);
    // }

    //   if(rotate == 'LEFT') {
    //   this.ctx.rotate(90 * Math.PI / 180);
    // }else if (rotate == 'RIGHT') {
    //   this.ctx.rotate(180 * Math.PI / 180);
    // }
