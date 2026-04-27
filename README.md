# 🏋️‍♂️ Minimal Gym Tracker

A clean, distraction-free Android application designed for progressive overload and efficient gym sessions. Built with a mobile-first web tech stack (HTML/CSS/JS) and wrapped in a native Android WebView using Kotlin.

## ✨ Features

* **Void/Zinc Minimalist UI:** A stark, true-black dark mode interface designed to save battery and eliminate visual clutter while lifting.
* **Smart Autocomplete:** Preloaded exercises categorized by muscle group (Chest, Back, Legs, etc.) using native HTML datalists.
* **Progressive Overload Memory:** Automatically scans your workout history and subtly displays the weight/reps you hit during your *last* session for any given exercise.
* **90-Second Haptic Rest Timer:** A built-in countdown timer that replaces the stopwatch, triggering a 3-pulse device vibration when it's time for your next set.
* **Live Draft Auto-Save:** Every keystroke is saved to local storage instantly. If you accidentally swipe the app away, your current workout will be waiting for you when you reopen it.
* **History & Trash System:** Full session logging with the ability to delete and restore accidental deletions.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox/Grid), Vanilla JavaScript (ES6+).
* **Typography:** [Inter](https://fonts.google.com/specimen/Inter) by Google Fonts.
* **Android Wrapper:** Android Studio, Kotlin, `WebView`, `OnBackPressedDispatcher`.
* **Data Storage:** HTML5 `localStorage` (Persisted via Android DOM Storage).

## 🚀 How to Install & Run

### For Android Users (.apk)
1. Go to the [Releases](https://github.com/rajarshi265/MinimalGymTracker/releases/tag/v1.0.0) tab on this repository. 
2. Download the `GymTracker.apk` file to your Android device.
3. Tap to install (you may need to allow "Install from Unknown Sources" in your settings).

### For Developers
To build this project from source using Android Studio:
1. Clone this repository:
   ```bash
   git clone [[https://github.com/yourusername/MinimalGymTracker.git](https://github.com/yourusername/MinimalGymTracker.git)](https://github.com/rajarshi265/MinimalGymTracker.git)
