# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native and Hermes runtime
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.react.**
-keepclassmembers class * { @com.facebook.react.bridge.ReactMethod <methods>; }
-keep @com.facebook.react.module.annotations.ReactModule class * { *; }

# Native libraries used by ShopAI
-keep class com.mrousavy.camera.** { *; }
-keep class com.google.firebase.** { *; }
-keep class com.swmansion.reanimated.** { *; }

# Preserve symbolication and reflection metadata for Crashlytics/R8
-keepattributes SourceFile,LineNumberTable,*Annotation*,Signature
-keep public class * extends java.lang.Exception
