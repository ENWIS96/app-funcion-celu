import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
import { addIcons } from 'ionicons';
import { bluetooth, scan, stopCircle, radioButtonOn, radioButtonOff, phonePortrait, bluetoothOutline, link, power, closeCircle } from 'ionicons/icons';

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
  isBluetoothEnabled = false;
  connectedDevices: Set<string> = new Set();

  constructor(private alertController: AlertController) {
    addIcons({ bluetooth, scan, stopCircle, radioButtonOn, radioButtonOff, phonePortrait, bluetoothOutline, link, power, closeCircle });
  }

  async ngOnInit() {
    try {
      await BleClient.initialize();
      await this.checkBluetoothStatus();
    } catch (error) {
      console.error('Error al inicializar Bluetooth:', error);
    }
  }

  async checkBluetoothStatus() {
    try {
      const enabled = await BleClient.isEnabled();
      this.isBluetoothEnabled = enabled;
    } catch (error) {
      console.error('Error al verificar estado de Bluetooth:', error);
      this.isBluetoothEnabled = false;
    }
  }

  async enableBluetooth() {
    try {
      await BleClient.enable();
      this.isBluetoothEnabled = true;
      
      const alert = await this.alertController.create({
        header: 'Bluetooth Activado',
        message: 'El Bluetooth se ha activado correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error al activar Bluetooth:', error);
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo activar el Bluetooth. Por favor, actívalo manualmente desde la configuración.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async startScan() {
    try {
      // Verificar si Bluetooth está habilitado
      const enabled = await BleClient.isEnabled();
      if (!enabled) {
        const alert = await this.alertController.create({
          header: 'Bluetooth Desactivado',
          message: 'El Bluetooth está desactivado. ¿Deseas activarlo?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Activar',
              handler: () => {
                setTimeout(async () => {
                  await this.enableBluetooth();
                  await this.checkBluetoothStatus();
                  if (this.isBluetoothEnabled) {
                    await this.startScan();
                  }
                }, 300);
                return true;
              }
            }
          ]
        });
        await alert.present();
        return;
      }

      this.devices = [];
      this.isScanning = true;

      await BleClient.requestLEScan({
        allowDuplicates: false
      }, (result) => {
        console.log('Dispositivo encontrado:', {
          name: result.device.name,
          localName: result.localName,
          deviceId: result.device.deviceId,
          rssi: result.rssi
        });
        
        // Evitar duplicados
        if (!this.devices.find(d => d.device.deviceId === result.device.deviceId)) {
          this.devices.push(result);
        }
      });

      // Detener el escaneo automáticamente después de 15 segundos
      setTimeout(async () => {
        await this.stopScan();
      }, 15000);
    } catch (error) {
      console.error('Error al escanear:', error);
      this.isScanning = false;
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error al escanear dispositivos. Verifica los permisos de Bluetooth y ubicación.',
        buttons: ['OK']
      });
      await alert.present();
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

  async pairDevice(device: ScanResult) {
    console.log('Intentando emparejar con dispositivo:', device);
    
    const deviceName = this.getDeviceName(device);
    
    const confirmAlert = await this.alertController.create({
      header: 'Emparejar Dispositivo',
      message: `¿Deseas emparejar con "${deviceName}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Emparejar',
          handler: () => {
            setTimeout(() => {
              this.performPairing(device);
            }, 300);
            return true;
          }
        }
      ]
    });
    
    await confirmAlert.present();
  }

  async performPairing(device: ScanResult) {
    const loading = await this.alertController.create({
      header: 'Emparejando...',
      message: 'Conectando con el dispositivo. Esto puede tardar unos segundos...',
      backdropDismiss: false
    });
    await loading.present();

    try {
      console.log('Conectando con:', device.device.deviceId);
      
      // Conectar al dispositivo con timeout
      await BleClient.connect(
        device.device.deviceId,
        (disconnectReason) => {
          console.log('Dispositivo desconectado:', disconnectReason);
          this.connectedDevices.delete(device.device.deviceId);
        },
        { timeout: 10000 }
      );

      console.log('Conexión exitosa');
      this.connectedDevices.add(device.device.deviceId);
      
      await loading.dismiss();
      
      const deviceName = this.getDeviceName(device);
      const successAlert = await this.alertController.create({
        header: '✅ Éxito',
        message: `Emparejado exitosamente con "${deviceName}"`,
        buttons: ['OK']
      });
      await successAlert.present();
      
    } catch (error: any) {
      console.error('Error al emparejar:', error);
      await loading.dismiss();
      
      let errorMessage = 'No se pudo emparejar con el dispositivo.';
      
      if (error.message) {
        if (error.message.includes('timeout') || error.message.includes('time')) {
          errorMessage = 'Tiempo de espera agotado. El dispositivo no responde o está fuera de rango.';
        } else if (error.message.includes('permission')) {
          errorMessage = 'No tienes permisos de Bluetooth. Ve a Configuración → Aplicaciones → Permisos.';
        } else if (error.message.includes('bond')) {
          errorMessage = 'No se pudo crear el vínculo con el dispositivo. Intenta desde la configuración de Android.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      const errorAlert = await this.alertController.create({
        header: '❌ Error de Emparejamiento',
        message: errorMessage,
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async disconnectDevice(device: ScanResult) {
    try {
      await BleClient.disconnect(device.device.deviceId);
      this.connectedDevices.delete(device.device.deviceId);
      
      const alert = await this.alertController.create({
        header: 'Desconectado',
        message: 'Dispositivo desconectado exitosamente',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
  }

  isConnected(deviceId: string): boolean {
    return this.connectedDevices.has(deviceId);
  }

  getDeviceName(device: ScanResult): string {
    // Log para debugging
    console.log('Device info:', {
      name: device.device.name,
      localName: device.localName,
      deviceId: device.device.deviceId
    });

    // Intentar obtener el nombre del dispositivo de diferentes fuentes
    if (device.device.name && device.device.name.trim() !== '') {
      return device.device.name;
    }
    
    // Si hay nombre local en los datos de publicidad
    if (device.localName && device.localName.trim() !== '') {
      return device.localName;
    }
    
    // Si no hay nombre disponible, simplemente mostrar "Dispositivo BLE" sin MAC
    return 'Dispositivo BLE';
  }

}
