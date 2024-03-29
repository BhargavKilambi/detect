import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import * as Tessaract from 'tesseract.js';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { NgProgress } from '@ngx-progressbar/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
//import { NativeStorage } from '@ionic-native/native-storage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedImage:string;
  imageText:string;
  ncount:number;
  constructor(public toss:ToastController,
    //private ns:NativeStorage,
    private tts:TextToSpeech,
    private loading:LoadingController,
    public navCtrl: NavController,private actionsh:ActionSheetController,private camera:Camera,public progress:NgProgress) {
      
  }
  refresh(){
    this.selectedImage = "";
    this.imageText = "";
  }

  chooseImage(){
    let actionSheet = this.actionsh.create({
      buttons: [
        {
          text: 'Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Capture Picture',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
 
    actionSheet.present();
  }
 
  getPicture(source:PictureSourceType){
    this.camera.getPicture({
      quality:100,
      destinationType:this.camera.DestinationType.DATA_URL,
      allowEdit:true,
      correctOrientation:true,
      sourceType:source,
      saveToPhotoAlbum:false,
    }).then(imageData=>{
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
      
    })
    .catch(reason=>{
      alert(reason);
    })
  }

  speak(){
    this.tts.speak(this.imageText)
    .then(response=>{

    })
    .catch(error=>{
      alert(error)
    })
  }

  
  //Tesseract OCR used here
  recog(){
    let lc = this.loading.create({
      content:'Recognizing...',
      spinner:'ios',
    })
    lc.present();
    
    Tessaract.recognize(this.selectedImage)
    .progress(result=>{
      if(result.status=='recognizing text'){
        this.progress.set(result.progress);
      }
    })
    .catch(e=>{
      alert(e)
    })
    .then(result=>{
      this.imageText = result.text;
    })
    .finally(ress=>{
      this.progress.complete();
      lc.dismiss();
    })
  }
}
