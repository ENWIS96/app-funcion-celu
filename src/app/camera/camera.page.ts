import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { camera, qrCode, imagesOutline, qrCodeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class CameraPage implements OnInit {
  capturedPhoto: string | undefined;

  constructor() {
    addIcons({ camera, qrCode, imagesOutline, qrCodeOutline });
  }

  ngOnInit() {
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      
      this.capturedPhoto = image.dataUrl;
    } catch (error) {
      console.error('Error al tomar foto:', error);
    }
  }

  async selectFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      
      this.capturedPhoto = image.dataUrl;
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
    }
  }

}
