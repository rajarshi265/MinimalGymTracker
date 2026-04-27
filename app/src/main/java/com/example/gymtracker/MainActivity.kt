package com.example.gymtracker

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView: WebView = findViewById(R.id.myWebView)

        // Force the app to handle all links/popups internally
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        // Enable JavaScript so your app.js works
        webView.settings.javaScriptEnabled = true

        // VERY IMPORTANT: Enable DOM Storage so your workout history saves
        webView.settings.domStorageEnabled = true

        // Load your local HTML file from the assets folder
        webView.loadUrl("file:///android_asset/index.html")

        // --- MODERN ANDROID BACK BUTTON LOGIC ---
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    // If the web app has history, go back one screen
                    webView.goBack()
                } else {
                    // If we are at the main screen, let Android close the app naturally
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }
}