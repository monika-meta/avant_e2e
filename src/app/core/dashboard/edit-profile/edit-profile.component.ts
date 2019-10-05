import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner'

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { AUTH_SERVICE } from 'src/app/core/auth/util/auth-service.token';
import { IAuthService } from 'src/app/core/auth/util/iauth-service.interface';

import { GlobalService } from 'src/app/shared/services/global.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'page-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditProfileComponent implements OnInit {

    userForm: FormGroup;
    nickName: string;
    firstName: string;
    lastName: string;
    email: string;
    userId: string;
    isUploading: boolean;
    updatePictureFlag: boolean = false;
    selectedPicture: File;  // File
    uploadedPicture: any;   // Base64
    uploadedPictureImgEle: HTMLImageElement;
    picture: string;
    @ViewChild('pic',{static: false})
    pic: any;
    compressedImage: any;
    userName: string;
    /**
     * Constructor
     *
     * @param {MatDialog} matDialogRef
     * @param _data
     * @param {MatDialog} _matDialog
     * @param {TagService} _tagService
     * @param {GlobalService} _globalService
     */
    constructor(
        @Inject(AUTH_SERVICE) private authService: IAuthService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _matDialog: MatDialog,
        private profileService: ProfileService,
        public matDialogRef: MatDialogRef<EditProfileComponent>,
        private alertService: AlertService,
        private _translateService: TranslateService,
        private _globalService: GlobalService) {
    }


    ngOnInit() {
        this.nickName = this._globalService.userInfo.nickName;
        this.email = this._globalService.userInfo.email;
        this.firstName = this._globalService.userInfo.firstName;
        this.lastName = this._globalService.userInfo.lastName;
        this.userId = this._globalService.userInfo.id;
        this.picture = this._globalService.userInfo.avatar;
        this.userName = this._globalService.userInfo.userName;
    }
   
    close() {
        this.matDialogRef.close();
    }


    onFileChanged(event) {
        if (event.target.files && event.target.files[0]) {
            this.selectedPicture = event.target.files[0]
            this.updatePictureFlag = true;
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.uploadedPicture = (event.target as any).result;
                //console.log("original image lenth:" + this.uploadedPicture.length);               
                this.uploadedPictureImgEle = new Image();
                this.uploadedPictureImgEle.src = this.uploadedPicture;
            }
        }

    }

    /**
    * Save user profile
    */
    save() {
        if (this.isUploading) return;
        
        let userObj: any = {};
        userObj.nickname = this.nickName;
        userObj.firstname = this.firstName;
        userObj.lastname = this.lastName;
        userObj.email = this.email;
        if (this.updatePictureFlag == true) {
            if (this.selectedPicture) {
                userObj.avatar =  this.compressImage();
                userObj.isPictureUpdated = true;
            }else{
                userObj.avatar = "";
                userObj.isPictureUpdated = true;
            }
        } else {
            userObj.isPictureUpdated = false;
        }
        // userName, status, mood are not send

        this.isUploading = true;
        this.profileService.updateProfile(userObj, this.userId).subscribe((res: any) => {
            // update user info
            this._globalService.setProfile(res);
            this._globalService.userInfo.nickName = res.nickname;
            this._globalService.userInfo.firstName = res.firstname;
            this._globalService.userInfo.lastName = res.lastname;
            this._globalService.userInfo.userName = res.userName;
            this._globalService.userInfo.avatar = res.avatar;
            
            this.isUploading = false;
            this.close();
        },
        (err) => {
            this.isUploading = false;
            this.alertService.showWarning(this._translateService.instant('editProfileError'));
            console.error(err);
        });
    }

    removePicture(){
        this.picture = undefined;
        this.selectedPicture = undefined;
        this.updatePictureFlag = true;
    }

    // compresses image to around 100-150 KB
    compressImage(){
        let maxWidth = 300;
        let maxHeight = 300;
      
        let img: any = this.pic.nativeElement;   
        let canvas = document.createElement('canvas');
        let width = this.uploadedPictureImgEle.width;
        let height = this.uploadedPictureImgEle.height;
      
        if (width > height) {
          if (width > maxWidth) {
            //height *= maxWidth / width;
            height = Math.round(height *= maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            //width *= maxHeight / height;
            width = Math.round(width *= maxHeight / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);      
        let temp = canvas.toDataURL("image/png",0.7);
        //console.log("compressed image length:" + temp.length);
        this.compressedImage = temp;
        return temp;
      }


    /**
    * save profile (form data payload)
    */
    // save() {
    //     if (this.isUploading) return;

    //     let formObj = new FormData();

    //     if (this.updatePictureFlag == true) {
    //         if (this.selectedPicture) {
    //             formObj.append('file', this.selectedPicture, this.selectedPicture.name);
    //         }
    //     } else {
    //         formObj.append('IsPictureUpdated', "false");
    //     }

    //     formObj.append('firstName', this.firstName);
    //     formObj.append('lastName', this.lastName);
    //     formObj.append('nickName', this.nickName);

    //     this.isUploading = true;
    //     this.profileService.updateProfile(formObj).subscribe((res: any) => {
    //         // update user info
    //         this._globalService.setProfile(res);
    //         this._globalService.userInfo.nickName = res.nickname;
    //         this._globalService.userInfo.avatar = res.avatar;

    //         this.isUploading = false;
    //         this.close();
    //     },
    //         (err) => {
    //             this.isUploading = false;
    //             this.alertService.showWarning(this._translateService.instant('editProfileError'));
    //             console.error(err);
    //         });
    // }

}

