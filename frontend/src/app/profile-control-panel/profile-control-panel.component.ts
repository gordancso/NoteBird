import { Component, OnInit } from "@angular/core";
import { Bookmark } from "../Bookmark";
import { UserInformService } from "../user-inform.service";
import { BookmarkService } from "../bookmark.service";
import  swal  from "sweetalert2";


@Component({
  selector: "app-profile-control-panel",
  templateUrl: "./profile-control-panel.component.html",
  styleUrls: ["./profile-control-panel.component.css"]
})
export class ProfileControlPanelComponent implements OnInit {
  User: any;
  bookmarks: Bookmark[] = [];
  selectedBookmark: Bookmark;
  

  constructor(private userInformService: UserInformService, private bookmarkService: BookmarkService) {}

  ngOnInit() {
    let english = new Bookmark("English");
    let animal = new Bookmark("Animal");
    this.bookmarks.push(english);
    this.bookmarks.push(animal);
    this.userInformService.getUserInfo().subscribe(res => {
      this.User = res[0];
      console.log(this.User);
    });

    this.bookmarkService.BookmarkFormStyle = {
      'display':'none',
      'z-index':'-1'
    }
  }

  saveBookmarkName(e){
    let newBM = new Bookmark(e);
    this.bookmarks.push(newBM);
  }


}
