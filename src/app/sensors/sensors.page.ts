import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, IonBadge } from '@ionic/angular/standalone';
import { Motion } from '@capacitor/motion';
import { addIcons } from 'ionicons';
import { playForward, documentText, layers, time, playBack, phonePortrait, arrowForward, arrowBack, handLeft, speedometer, playCircle, stopCircle } from 'ionicons/icons';

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
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, IonBadge, CommonModule, FormsModule]
})
export class SensorsPage implements OnInit, OnDestroy {
  // Control de presentación
  currentSlide = 1;
  presentationTime = '00:00';
  private startTime: Date | null = null;
  private timeInterval: any;
  
  // Sensores
  gyroscope: GyroData | null = null;
  accelerometer: GyroData | null = null;
  isGyroActive = false;
  private gyroListener: any;
  private accelListener: any;
  
  // Control de gestos
  lastGesture: string | null = null;
  private lastSlideChange = 0;
  private readonly SLIDE_COOLDOWN = 1000; // 1 segundo entre cambios
  private readonly TILT_THRESHOLD = 1.5; // Umbral de inclinación

  constructor() {
    addIcons({ 
      playForward, documentText, layers, time, playBack, 
      phonePortrait, arrowForward, arrowBack, handLeft, 
      speedometer, playCircle, stopCircle 
    });
  }

  ngOnInit() {
    this.startPresentationTimer();
  }

  ngOnDestroy() {
    this.stopPresentationTimer();
    if (this.gyroListener) {
      this.gyroListener.remove();
    }
    if (this.accelListener) {
      this.accelListener.remove();
    }
  }

  // Control de tiempo de presentación
  private startPresentationTimer() {
    this.startTime = new Date();
    this.timeInterval = setInterval(() => {
      if (this.startTime) {
        const elapsed = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.presentationTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  private stopPresentationTimer() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  // Control manual de diapositivas
  previousSlide() {
    if (this.currentSlide > 1) {
      this.currentSlide--;
      this.lastGesture = 'left';
      console.log('Diapositiva anterior:', this.currentSlide);
      // Aquí se enviaría el comando Bluetooth para cambiar diapositiva
      setTimeout(() => this.lastGesture = null, 1000);
    }
  }

  nextSlide() {
    this.currentSlide++;
    this.lastGesture = 'right';
    console.log('Siguiente diapositiva:', this.currentSlide);
    // Aquí se enviaría el comando Bluetooth para cambiar diapositiva
    setTimeout(() => this.lastGesture = null, 1000);
  }

  // Control del giroscopio
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
      this.gyroListener = await Motion.addListener('orientation', (event) => {
        this.gyroscope = {
          x: event.alpha,
          y: event.beta,
          z: event.gamma
        };
        
        // Detectar gestos de inclinación
        this.detectTiltGesture(event.beta);
      });
    } catch (error) {
      console.error('Error al iniciar giroscopio:', error);
      this.isGyroActive = false;
    }
  }

  async stopGyroscope() {
    if (this.gyroListener) {
      await this.gyroListener.remove();
      this.isGyroActive = false;
      this.gyroscope = null;
    }
  }

  // Detectar inclinación y cambiar diapositivas
  private detectTiltGesture(beta: number) {
    const now = Date.now();
    
    // Cooldown para evitar cambios muy rápidos
    if (now - this.lastSlideChange < this.SLIDE_COOLDOWN) {
      return;
    }
    
    // Inclinación a la derecha -> siguiente
    if (beta > this.TILT_THRESHOLD) {
      this.nextSlide();
      this.lastSlideChange = now;
    }
    // Inclinación a la izquierda -> anterior
    else if (beta < -this.TILT_THRESHOLD) {
      this.previousSlide();
      this.lastSlideChange = now;
    }
  }

  // Acelerómetro (opcional)
  async startAccelerometer() {
    try {
      this.accelListener = await Motion.addListener('accel', (event) => {
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

  async stopAccelerometer() {
    if (this.accelListener) {
      await this.accelListener.remove();
      this.accelerometer = null;
    }
  }
}
