import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { Motion } from '@capacitor/motion';
import { addIcons } from 'ionicons';
import { navigate, location, compass, speedometer, locate, playCircle, stopCircle } from 'ionicons/icons';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface GyroData {
  x: number;
  y: number;
  z: number;
}

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.page.html',
  styleUrls: ['./sensors.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class SensorsPage implements OnInit, OnDestroy {
  location: LocationData | null = null;
  gyroscope: GyroData | null = null;
  accelerometer: GyroData | null = null;
  isGyroActive = false;
  private motionListener: any;

  constructor() {
    addIcons({ navigate, location, compass, speedometer, locate, playCircle, stopCircle });
  }

  ngOnInit() {
    // Iniciar acelerómetro automáticamente
    this.startAccelerometer();
  }

  ngOnDestroy() {
    if (this.motionListener) {
      this.motionListener.remove();
    }
  }

  async getLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.location = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy
      };
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      alert('Error al obtener ubicación. Asegúrate de tener los permisos habilitados.');
    }
  }

  async toggleGyroscope() {
    if (this.isGyroActive) {
      await this.stopGyroscope();
    } else {
      await this.startGyroscope();
    }
  }

  async startGyroscope() {
    try {
      this.isGyroActive = true;
      this.motionListener = await Motion.addListener('orientation', (event) => {
        this.gyroscope = {
          x: event.alpha,
          y: event.beta,
          z: event.gamma
        };
      });
    } catch (error) {
      console.error('Error al iniciar giroscopio:', error);
      this.isGyroActive = false;
    }
  }

  async stopGyroscope() {
    if (this.motionListener) {
      await this.motionListener.remove();
      this.isGyroActive = false;
    }
  }

  async startAccelerometer() {
    try {
      await Motion.addListener('accel', (event) => {
        this.accelerometer = {
          x: event.acceleration.x,
          y: event.acceleration.y,
          z: event.acceleration.z
        };
      });
    } catch (error) {
      console.error('Error al iniciar acelerómetro:', error);
    }
  }

}
