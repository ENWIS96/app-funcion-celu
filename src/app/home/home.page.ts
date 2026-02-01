import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, bluetooth, navigate, phonePortraitOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonIcon],
})
export class HomePage {
  constructor(private router: Router) {
    addIcons({ camera, bluetooth, navigate, phonePortraitOutline });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
