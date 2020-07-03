import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IGame } from 'src/app/core/interface/robot';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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

@Component({
  selector: 'app-home-toy-new',
  templateUrl: './home-toy-new.component.html',
  styleUrls: ['./copy.scss'],
})
export class HomeToyNewComponent implements OnInit {

  robot: IGame;
  boxCountArray = new Array(25);

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  // @ViewChild('toy', { static: true })
  // toy: ElementRef<HTMLCanvasElement>;

  ctx: any;
  // toyRobot: any;


  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.robot = {
      value: '',
      location: {},
      facing: {},
      placed: false,
      actions: []

    }
    this.showError = false;
    this.loginForm = this.formBuilder.group({
      userInput: [''],
    })

    this.drawTable(5,5);
    // this.submitForm();
  }

  loginForm: FormGroup;
  isSubmitted = false;
  showError = false;

  reset = () => {

    this.robot = {
      value: "",
      location: null,
      facing: { x: 0, y: 0 },
      placed: false,
      actions: []
    };
    this.loginForm.reset();
    this.showError = false;

  }

  submitForm = () => {

    

    this.showError = false;
    const sampleInput = this.loginForm.controls.userInput.value.trim();

    const inputLine = sampleInput.split(/[\s,]+/);
    // If the first word isn't a command, we ignore it
    let command = inputLine[0];
    if (command === "PLACE") {
      if (inputLine.length === 4) {
        const x = parseInt(inputLine[1], 10),
          y = parseInt(inputLine[2], 10),
          f = inputLine[3];
        const facing = orientation[f];
        // Check if the robot is still on the table, and valid direction
        if (x > -1 && x < 5 && y > -1 && y < 5 && facing) {

          this.robot = {
            value: this.robot.value,
            location: { x, y },
            facing: facing,
            placed: true,
            actions: [...this.robot.actions, `PLACE ${x},${y},${f}`]

          }
        }
      }
    }
    // Ignore everything else until robot is placed
    if (this.robot.placed) {
      if (command === "MOVE") {
        debugger;
        const moveX = this.robot.facing.x;
        const moveY = this.robot.facing.y;
        // Make sure the robot won't fall off the table
        const nextX = this.robot.location.x + moveX;
        const nextY = this.robot.location.y + moveY;
        if (nextX > -1 && nextX < 5 && nextY > -1 && nextY < 5) {
          this.robot.location = { x: nextX, y: nextY };
          this.robot.actions = [...this.robot.actions, "MOVE"];
          this.showError = false;
          this.changeImagePosition(this.robot.location.x  , this.robot.location.y  );
        } else {
          //robot out of table
          this.showError = true;
        }
      } else if (command === "LEFT") {
        const x = this.robot.facing.x;
        const y = this.robot.facing.y;

        this.robot.facing = { x: -y, y: x },
          this.robot.actions = [...this.robot.actions, "LEFT"];

      } else if (command === "RIGHT") {
        const x = this.robot.facing.x;
        const y = this.robot.facing.y;


        this.robot.facing = { x: y, y: -x },
          this.robot.actions = [...this.robot.actions, "RIGHT"];

      } else if (command === "REPORT") {

        const location = this.robot.location;
        var report = `Output: ${location.x},${location.y},${
          direction.x[this.robot.facing.x.toString()].y[
          this.robot.facing.y.toString()
          ]
          }`;
        this.robot.actions = [...this.robot.actions, "REPORT", report];

      }
      
     
    }
    // Reset value in input
    this.robot.value = '';


  }

  drawTable(x=1,y=1) {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    // var c = document.getElementById("myCanvas");
    // var ctx = this.canvas.getContext("2d");

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
      this.ctx.drawImage(img, x + 20, y + 20, 20, 20);
      // do other canvas handling here!
    }
    img.src = "assets/img/toy2.jpeg";

  }


  changeImagePosition(x, y){
    this.ctx.clearRect(0, 0, 300, 300);
    this.drawTable(50,0);
    // this.ctx.moveTo(x, y);
    // this.ctx.lineTo(x, y);
    // var img = new Image();
   
    // img.onload = () => {
    //   this.ctx.drawImage(img, 200, 200, 40, 40);
    //   // do other canvas handling here!
    // }

    // img.src = "assets/img/toy2.jpeg";
    
  }






}
