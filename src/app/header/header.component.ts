import { Component, OnInit, ɵɵelementContainerStart } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Flattener } from 'pdf-flatten';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {

  constructor(private httpClient: HttpClient) { }

  selectedFile: File;
  retrievedFile: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  fileName: any;

  public onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }
  onUpload() {
    console.log(this.selectedFile);
    if(this.isImageOrText(this.selectedFile)){
      this.handleImageOrText();
    }

  }

  handleImageOrText(){
    const uploadFileData = new FormData();
    uploadFileData.append('file', this.selectedFile, this.selectedFile.name);
    this.httpClient.post('http://localhost:8080/api/upload', uploadFileData, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 200) {
          this.message = 'Fila curatata';
        } else {
          this.message = 'Eroare';
        }
        this.saveFile(response)
      }
      );

  }

  saveFile(response){
    this.retrievedFile = 'data:'+response.body.type+';base64,' + response.body.bytes;
    saveAs(this.retrievedFile,"clean");
  }


  isImageOrText(file: File){
    const extensions: String[] = ['txt','jpg','bmp','gif','png','wbmp','jpeg','pdf','docx','xlsx','zip'];
    let extension = file.name.split('.').pop().toLowerCase();
    return this.contains(extensions,extension);
  }

  contains(array: any[],target: any): boolean{
    for(let element of array ){
      if(element === target) return true;
    }
    return false;
  }

}

