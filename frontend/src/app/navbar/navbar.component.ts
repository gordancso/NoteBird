import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FacebookAuthService } from "../facebook-auth.service";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { environment } from "../../environments/environment";
// double check
import { FilterService } from "../filter.service";
import { filter } from "rxjs/operator/filter";

import { UserInformService } from "../user-inform.service";

import { AfterViewChecked } from "@angular/core";


@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  token: string = null;
  userID: string = null;
  private User: Observable<any[]>;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private userInformService: UserInformService
  ) {
    this.userID = localStorage.getItem("userID");
    this.token = localStorage.getItem("myToken");
    // this.User = new Observable((observer) => {
    //   console.log('hi')
    //   setInterval(()=>{
    //     console.log('HI')
    //     if (this.token){
    //       this.userInformService.getUserInfo().subscribe(res => {
    //         observer.next(res[0]);
    //         console.log(this.User);
    //       });
    //     }
    //   },1000)
    // })
    this.User = new Observable((observer) => {
      let a = setInterval(() => {
        if(localStorage.getItem("myToken")){
          this.userInformService.getUserInfo().subscribe(res=>{
            // this.User = res[0];
            // console.log(this.User);
            observer.next(res[0]);
            clearInterval(a);
          })
        }
      }, 500)
      
    })
  }

  ngOnInit() {
    
    // if(this.token){
    //   this.userInformService.getUserInfo().subscribe(res=>{
    //     this.User = res[0];
    //     console.log(this.User);
    //   })
    // }
  }


  

  onLogout() {
    this.authService.logOut();
    this.router.navigate(["/"]);
  }
}

