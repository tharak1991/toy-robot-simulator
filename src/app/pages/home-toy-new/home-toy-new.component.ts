import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./home-toy-new.component.scss'],
})
export class HomeToyNewComponent implements OnInit {

  robot: IGame ;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.robot = {
      value: '',
      location: { },
      facing: {},
      placed: false,
      actions: []

    }
    this.showError = false ;
    this.loginForm = this.formBuilder.group({
      userInput: [''],
    })
    // this.submitForm();
  }

  loginForm: FormGroup;
  isSubmitted = false;
  showError = false ;

  reset = () => {

    this.robot = {
      value: "",
      location: null,
      facing: { x: 0, y: 0 },
      placed: false,
      actions: []
    };

  }

  submitForm = () =>{
    debugger ;


    const sampleInput = this.loginForm.controls.userInput.value.trim() ;

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
            facing: facing ,
            placed: true,
            actions: [...this.robot.actions, `PLACE ${x},${y},${f}`]

          }
        }
      }
    }
    // Ignore everything else until robot is placed
    if (this.robot.placed) {
      if (command === "MOVE") {
        const moveX = this.robot.facing.x;
        const moveY = this.robot.facing.y;
        // Make sure the robot won't fall off the table
        const nextX = this.robot.location.x + moveX;
        const nextY = this.robot.location.y + moveY;
        if (nextX > -1 && nextX < 5 && nextY > -1 && nextY < 5) {
          this.robot.location =  { x: nextX, y: nextY } ;
          this.robot.actions = [...this.robot.actions, "MOVE"];
          this.showError = false ;
        }else{
          //robot out of table
          this.showError = true ;
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
        this.robot.actions =[...this.robot.actions, "REPORT", report];
  
      }
    }
    // Reset value in input
    this.robot.value = '' ;


  }

}
