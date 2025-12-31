package io.dinapp.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.viewbinding.ViewBinding
import io.dinapp.app.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize View Binding
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Set app title
        supportActionBar?.title = "DinApp v0.1"

        // Initialize UI
        setupUI()

        // Check if user is authenticated
        if (isUserAuthenticated()) {
            navigateToDashboard()
        } else {
            showLoginScreen()
        }
    }

    private fun setupUI() {
        // Setup click listeners, UI initialization, etc.
        binding.loginButton?.setOnClickListener {
            startPhoneAuth()
        }
    }

    private fun isUserAuthenticated(): Boolean {
        // Check SharedPreferences or secure storage
        val preferences = getSharedPreferences("dinapp_auth", MODE_PRIVATE)
        return preferences.getString("auth_token", null) != null
    }

    private fun showLoginScreen() {
        // Show phone number input screen
        val fragment = LoginFragment()
        supportFragmentManager.beginTransaction()
            .replace(R.id.container, fragment)
            .addToBackStack(null)
            .commit()
    }

    private fun navigateToDashboard() {
        // Navigate to main dashboard
        val fragment = DashboardFragment()
        supportFragmentManager.beginTransaction()
            .replace(R.id.container, fragment)
            .commit()
    }

    private fun startPhoneAuth() {
        // Start phone authentication flow
        val fragment = PhoneAuthFragment()
        supportFragmentManager.beginTransaction()
            .replace(R.id.container, fragment)
            .addToBackStack(null)
            .commit()
    }
}
