import { Component, Input, OnInit } from '@angular/core';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
 import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member : Member | any;
  faTrash: any;
  uploader: FileUploader= new FileUploader({});
  hasBaseDropzoneOver = false;
  baseUrl = environment.user;
  user: User | any;
  faUpload: any;

  constructor(private accountService: AccountService, private memberService: MembersService) { 
    this.faTrash = faTrash;
    this.faUpload = faUpload;
   this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
     this.user = user;
   })
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any){
      this.hasBaseDropzoneOver = e;
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach((p : Photo) => {
        if(p.isMain) photo.isMain = false;
        if(p.id === photo.id) photo.isMain = true;
      });
    });
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url : this.baseUrl + "/add-photo",
      authToken: 'Bearer '+ this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10*1024*1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      this.member.photos.push(photo)
    }
  }

  deletePhoto(photoId: number){
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter((p: any) => p.id != photoId);
    });
  }
}
