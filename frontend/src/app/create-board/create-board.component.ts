import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NoteImageService } from '../note-image.service';
import { NoteImage } from '../NoteImage';
import { environment } from "../../environments/environment";
import { AuthService } from "../auth.service";
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
import { NotePinService } from '../note-pin.service';
import { UploadService } from '../image-upload.service'
import { NotePin } from '../NotePin';
import { NoteInitService } from '../note-init.service';


@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css']
})

export class CreateBoardComponent implements OnInit {

  constructor(private noteImageService: NoteImageService,
    private notePinService: NotePinService,
    private noteInitService: NoteInitService,
    private http: HttpClient,
    private authService: AuthService,
    private uploadService: UploadService,
    private router: Router) {
    this.userID = localStorage.getItem('userID');
  }

//Set up variables
  userID: string = null;
  private imageList = this.noteImageService.imageList;
  private pinList = this.notePinService.pinList;
  private tagsList: string[]=[];
  private newTag: string;
  private selectedPin:NotePin;
  private currentService;
  noteCollapsed:boolean = false;
  imageCollapsed:boolean = true;
  pinCollapsed:boolean = true;
  publishCollapsed:boolean = true;
  tagsCollapsed:boolean = true;
  note={"title":"Enter the title here"};
  noteID: number = null;
  status = "init";

  ngOnInit() {
    this.currentService = this.noteInitService;
  }

  switchService(s: string) {
    if (s == "pin") {
      this.currentService = this.notePinService;
    } else if (s == "image") {
      this.currentService = this.noteImageService;
    } else{
      this.currentService = this.noteInitService;
    }
  }

  onSelect(pin: NotePin): void {
    this.selectedPin = this.notePinService.selectedPin;
  }
  setImageLayer() {
    let style;
    if (this.currentService == this.noteImageService) {
      style = {
        "z-index": "10"
      }
    } else {
      style = {
        "z-index": "9"
      }
    }
    return style;
  }

  setPinLayer() {
    let style;
    if (this.currentService == this.notePinService) {
      style = {
        "z-index": "10"
      }
    } else {
      style = {
        "z-index": "9"
      }
    }
    return style;
  }

  panelActive(panel: string) {
    if (panel == 'note') {
      this.noteCollapsed = false;
      this.imageCollapsed = true;
      this.pinCollapsed = true;
      this.publishCollapsed = true;
      this.tagsCollapsed = true;

      this.switchService("");
    }
    if (panel == 'image') {
      this.noteCollapsed = true;
      this.imageCollapsed = false;
      this.pinCollapsed = true;
      this.publishCollapsed = true;
      this.tagsCollapsed = true;
      //switch service to image
      this.switchService("image");
    }
    if (panel == 'pin') {
      this.noteCollapsed = true;
      this.imageCollapsed = true;
      this.pinCollapsed = false;
      this.publishCollapsed = true;
      this.tagsCollapsed = true;

      //switch service to pin
      this.switchService("pin");
    }
    if (panel == 'publish') {
      this.noteCollapsed = true;
      this.imageCollapsed = true;
      this.pinCollapsed = true;
      this.publishCollapsed = false;
      this.tagsCollapsed = true;

      this.switchService("");
    }
    if(panel=="tags"){
      this.noteCollapsed = true;
      this.imageCollapsed = true;
      this.pinCollapsed = true;
      this.publishCollapsed = true;
      this.tagsCollapsed = false;

      this.switchService("");
    }
  }

  // upload from image-upload service
  fileChangeEvent(event) {
    this.noteImageService.uploadAvatar(event);
  }

  saveDraft() {
    const pinNoteObj = {
      "userID": this.userID,
      "noteID": this.noteID,
      "status": "draft",
      "title": this.note.title,
      "pinList": this.pinList,
      "imageList": this.imageList,
      "tagsList": this.tagsList,
    };
    console.log(this.imageList)
    if(this.pinList.length != 0 && this.imageList.length != 0){
      this.notePinService.getNotePins(pinNoteObj).subscribe((res:any) =>{
        if(confirm(`Note is saved as ${res.status} with note ID ${res.noteID}`)){
          // reset create canvas
          this.noteID = null;
          this.pinList = [];
          this.imageList = [];
          this.tagsList = [];
          this.status = "init";
          this.router.navigate(['profile'])
        } else {
          this.noteID = res.noteID;
        }
      });
    } else {
      alert("Either no PIN or IMAGE is inserted! Draft note is not saved.")
    }
  }

  savePublish() {
    const pinNoteObj = {
      "userID": this.userID,
      "noteID": this.noteID,
      "status": "publish",
      "title": this.note.title,
      "pinList": this.pinList,
      "imageList": this.imageList,
      "tagsList": this.tagsList,
    };
    console.log(this.pinList)
    console.log(this.imageList)
    if(this.pinList.length != 0 && this.imageList.length != 0){
        this.notePinService.getNotePins(pinNoteObj).subscribe((res:any) =>{
          if(confirm(`Note is saved as ${res.status} with note ID ${res.noteID}`)){
            // reset create canvas
            this.noteID = null;
            this.pinList = [];
            this.imageList = [];
            this.tagsList = [];
            this.status = "init";
            this.router.navigate(['profile'])
          } else {
            this.noteID = res.noteID;
          }
        });
    } else {
      alert("Either no PIN or IMAGE is inserted! Note cannot be published.")
    }
  }

  addNewTag(){
    if(this.newTag){
    this.tagsList.push(this.newTag.replace(/\s/g,''));
    this.newTag = "";
    console.log(this.tagsList)
    }
  }

}
