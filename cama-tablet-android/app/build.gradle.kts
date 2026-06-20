plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.cama.tablet"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.cama.tablet"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "0.1.0"
        buildConfigField("String", "TABLET_WEB_URL", "\"http://10.0.2.2:5175\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            buildConfigField("String", "TABLET_WEB_URL", "\"https://camaplus.cafe24.com/tablet-app/\"")
        }
        debug {
            buildConfigField("String", "TABLET_WEB_URL", "\"http://10.0.2.2:5175\"")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        buildConfig = true
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.webkit:webkit:1.10.0")

    val camerax = "1.3.1"
    implementation("androidx.camera:camera-camera2:$camerax")
    implementation("androidx.camera:camera-lifecycle:$camerax")
    implementation("androidx.camera:camera-view:$camerax")

    implementation("com.google.mlkit:barcode-scanning:17.2.0")
}
