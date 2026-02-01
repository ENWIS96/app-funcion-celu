#!/bin/bash

echo "🚀 Generando APK de App Función Celu..."
echo "========================================"
echo ""

# Verificar Java 21
echo "🔍 Verificando Java..."
JAVA_VERSION=$(java -version 2>&1 | grep -oP 'version "?\K[0-9]+')
if [ "$JAVA_VERSION" -lt 21 ]; then
    echo "⚠️  Se requiere Java 21 o superior. Versión actual: Java $JAVA_VERSION"
    echo "Instalando Java 21..."
    sudo apt update && sudo apt install -y openjdk-21-jdk
    echo "Configurando Java 21 como predeterminado..."
    echo "0" | sudo update-alternatives --config java
fi

# Paso 1: Compilar la aplicación
echo ""
echo "📦 Paso 1/3: Compilando aplicación..."
ionic build

if [ $? -ne 0 ]; then
    echo "❌ Error al compilar la aplicación"
    exit 1
fi

# Paso 2: Sincronizar con Android
echo ""
echo "🔄 Paso 2/3: Sincronizando con Android..."
npx cap sync

if [ $? -ne 0 ]; then
    echo "❌ Error al sincronizar con Android"
    exit 1
fi

# Paso 3: Generar APK
echo ""
echo "🔨 Paso 3/3: Generando APK..."
cd android
./gradlew clean assembleDebug

if [ $? -ne 0 ]; then
    echo "❌ Error al generar APK"
    exit 1
fi

cd ..

echo ""
echo "✅ ¡APK generado exitosamente!"
echo ""
echo "📱 Ubicación del APK:"
echo "   android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "📊 Información del APK:"
ls -lh android/app/build/outputs/apk/debug/app-debug.apk | awk '{print "   Tamaño: " $5}'
echo ""
echo "📲 Para instalar en tu dispositivo:"
echo "   1. Transfiere el APK a tu teléfono"
echo "   2. Habilita 'Fuentes desconocidas' en configuración"
echo "   3. Abre el APK y toca 'Instalar'"
echo ""
echo "📖 Lee APK_GENERADO.md para instrucciones detalladas"
echo ""
echo "🎉 ¡Listo!"
