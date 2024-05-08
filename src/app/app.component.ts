import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-end';
  constructor(private router:Router ) {
  }
  gotoregsiter() {

    this.router.navigate(['./register']);
    console.log("test");
  }
  gotoLoing() {
  
    this.router.navigate(['./login']);
    console.log("test");
  }
}
