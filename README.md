# App Función Celu 📱

Una aplicación móvil elegante desarrollada en Ionic Angular que demuestra el uso de funciones nativas del dispositivo móvil.

**Desarrollada por:**
- Luis Ordóñez
- David Pérez

## 🎯 Características

La aplicación incluye 4 pantallas principales:

### 1. Pantalla de Inicio
- Diseño elegante con gradientes
- Navegación a las diferentes funcionalidades
- Créditos de los desarrolladores

### 2. Cámara 📷
- Captura de fotos usando la cámara del dispositivo
- Selección de imágenes desde la galería
- Vista previa de fotos capturadas

### 3. Bluetooth 📡
- Escaneo de dispositivos Bluetooth cercanos
- Lista de dispositivos detectados
- Control de inicio/detención de escaneo

### 4. Sensores 🧭
- **GPS/Ubicación:** Obtención de coordenadas de latitud, longitud y precisión
- **Giroscopio:** Lectura de rotación en tiempo real (ejes X, Y, Z)
- **Acelerómetro:** Monitoreo automático de aceleración en los 3 ejes

## 🚀 Instalación y Configuración

### Requisitos previos
- Node.js y npm instalados
- Ionic CLI (`npm install -g @ionic/cli`)
- Android Studio (para generar APK)
- JDK 17 o superior

### Instalar dependencias
```bash
npm install
```

### Ejecutar en modo desarrollo (navegador)
```bash
ionic serve
```

## 📦 Generar APK para Android

### Opción 1: APK de Debug (Desarrollo)

1. **Compilar la aplicación web:**
```bash
ionic build
```

2. **Sincronizar con Android:**
```bash
npx cap sync
```

3. **Abrir en Android Studio:**
```bash
npx cap open android
```

4. **En Android Studio:**
   - Espera a que Gradle termine de sincronizar
   - Ve a `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### Opción 2: Usando Gradle directamente

```bash
cd android
./gradlew assembleDebug
```

El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### Opción 3: APK de Release (Producción)

Para generar un APK firmado para publicación:

1. **Crear un keystore:**
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configurar el signing en `android/app/build.gradle`:**
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('path/to/my-release-key.keystore')
            storePassword 'your-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

3. **Generar APK firmado:**
```bash
cd android
./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

## 🔧 Permisos de Android

La aplicación solicita los siguientes permisos (ya configurados en AndroidManifest.xml):

- **CAMERA** - Para capturar fotos
- **READ_EXTERNAL_STORAGE / WRITE_EXTERNAL_STORAGE** - Para acceso a galería
- **ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION** - Para GPS
- **BLUETOOTH / BLUETOOTH_ADMIN / BLUETOOTH_SCAN / BLUETOOTH_CONNECT** - Para Bluetooth

## 📱 Instalación del APK en el dispositivo

1. Transfiere el APK a tu dispositivo Android
2. En el dispositivo, ve a Configuración → Seguridad
3. Habilita "Fuentes desconocidas" o "Instalar aplicaciones desconocidas"
4. Abre el archivo APK y toca "Instalar"
5. Acepta los permisos cuando la aplicación lo solicite

## 🎨 Tecnologías Utilizadas

- **Ionic Framework 8** - Framework de UI
- **Angular 18** - Framework de desarrollo
- **Capacitor 6** - Para acceso a funciones nativas
- **TypeScript** - Lenguaje de programación
- **SCSS** - Estilos con gradientes y animaciones

### Plugins de Capacitor:
- `@capacitor/camera` - Acceso a cámara y galería
- `@capacitor-community/bluetooth-le` - Escaneo Bluetooth
- `@capacitor/geolocation` - Ubicación GPS
- `@capacitor/motion` - Sensores de movimiento (giroscopio y acelerómetro)

## 📂 Estructura del Proyecto

```
app-funcion-celu/
├── src/
│   ├── app/
│   │   ├── home/          # Página de inicio
│   │   ├── camera/        # Funcionalidad de cámara
│   │   ├── bluetooth/     # Funcionalidad Bluetooth
│   │   └── sensors/       # Sensores (GPS, giroscopio, acelerómetro)
│   ├── assets/            # Recursos estáticos
│   └── theme/             # Estilos globales
├── android/               # Proyecto Android nativo
└── www/                   # Archivos compilados
```

## 🐛 Troubleshooting

### Error: "No se puede acceder a la cámara"
- Verifica que los permisos de cámara estén habilitados en la configuración del dispositivo

### Error: "Bluetooth no disponible"
- Asegúrate de que el Bluetooth esté activado en el dispositivo
- Verifica que la app tenga permisos de ubicación (requerido para Bluetooth en Android)

### Error: "No se puede obtener ubicación"
- Activa el GPS en el dispositivo
- Verifica que la app tenga permisos de ubicación

## 📄 Licencia

Proyecto educativo desarrollado por Luis Ordóñez y David Pérez.

## 🤝 Contribuciones

Este es un proyecto de demostración. Para mejoras o sugerencias, contacta a los desarrolladores.

---

**¡Disfruta explorando las funciones de tu dispositivo móvil! 🎉**
