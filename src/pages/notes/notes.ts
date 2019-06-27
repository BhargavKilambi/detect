import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { TextToSpeech } from '@ionic-native/text-to-speech';


@IonicPage()
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {
  noteslist = [] as any;
  count:number;
  isThere:boolean = false;
  constructor(private ns:NativeStorage,
    private tts:TextToSpeech,
    public navCtrl: NavController, public navParams: NavParams) {
      this.ns.getItem('notecount').then(result=>{
        this.count = result.count;
        this.isThere = true;
        let i : number = 1;
        if(this.count == 0){
          this.isThere = false;
        }
        else{
          this.isThere = true;
          for(i;i<=this.count;i++){
            this.ns.getItem(`note${i}`)                                                                                                                                                                                                                                                                                                                      
          .then(result=>{
            this.noteslist.push(result);
          })
          .catch(err=>{
            alert(err)
          })
          }  
        }
      })
      .catch(_=>{
        
      })
  }
  speak(note:string){
    this.tts.speak(note)
    .then(_=>{})
    .catch(err=>{
      alert(err)
    })
  }

  ionViewDidLoad() {
    
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
