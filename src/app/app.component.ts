import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import '@ionic/pwa-elements';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  showTopBar: boolean ;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router
  ) {
    this.initializeApp();
  }

  ngOnInit(){
    const url = this.router.url ;  
    this.showTopBar = true ;
    if(url == '/'){
      this.showTopBar = false ;
    }else {
      this.showTopBar = true ;
    }

  }

  initializeApp() {
    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     
    });
    defineCustomElements(window);
  }
}
