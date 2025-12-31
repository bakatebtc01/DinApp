// Top-level build.gradle for DinApp Android project
// Plugins are managed in the app-level build.gradle file
buildscript {
    ext {
        kotlin_version = '2.3.0'
        gradle_version = '8.1.0'
        core_ktx_version = '1.17.0'
        appcompat_version = '1.7.1'
        constraintlayout_version = '2.1.4'
        lifecycle_version = '2.10.0'
        material_version = '1.13.0'
        kotlin_stdlib_version = '2.3.0'
        okhttp_version = '5.3.2'
        gson_version = '2.13.1'
        retrofit_version = '3.0.0'
        security_crypto_version = '1.1.0-alpha06'
        datastore_preferences_version = '1.2.0'
        junit_version = '4.13.2'
        test_ext_junit_version = '1.3.0'
        espresso_core_version = '3.7.0'
    }
}


allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url "https://jitpack.io" }
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}