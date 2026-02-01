import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
import { addIcons } from 'ionicons';
import { bluetooth, scan, stopCircle, radioButtonOn, radioButtonOff, phonePortrait, bluetoothOutline } from 'ionicons/icons';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, IonCard, IonCardContent, CommonModule, FormsModule]
})
export class BluetoothPage implements OnInit {
  devices: ScanResult[] = [];
  isScanning = false;

  constructor() {
    addIcons({ bluetooth, scan, stopCircle, radioButtonOn, radioButtonOff, phonePortrait, bluetoothOutline });
  }

  async ngOnInit() {
    try {
      await BleClient.initialize();
    } catch (error) {
      console.error('Error al inicializar Bluetooth:', error);
    }
  }

  async startScan() {
    try {
      this.devices = [];
      this.isScanning = true;

      await BleClient.requestLEScan({}, (result) => {
        // Evitar duplicados
        if (!this.devices.find(d => d.device.deviceId === result.device.deviceId)) {
          this.devices.push(result);
        }
      });

      // Detener el escaneo automáticamente después de 10 segundos
      setTimeout(async () => {
        await this.stopScan();
      }, 10000);
    } catch (error) {
      console.error('Error al escanear:', error);
      this.isScanning = false;
    }
  }

  async stopScan() {
    try {
      await BleClient.stopLEScan();
      this.isScanning = false;
    } catch (error) {
      console.error('Error al detener escaneo:', error);
      this.isScanning = false;
    }
  }

}
