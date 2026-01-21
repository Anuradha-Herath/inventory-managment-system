package com.smartinventory.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Utility class to generate BCrypt password hashes
 * Use this to generate hashes for inserting users into the database
 */
public class PasswordEncoderUtil {

    public static void main(String[] args) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        
        // Generate hash for "admin123"
        String password = "admin123";
        String encodedPassword = passwordEncoder.encode(password);
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + encodedPassword);
        System.out.println("\nYou can use this hash in your SQL insert statements.");
        
        // Verify the hash
        boolean matches = passwordEncoder.matches(password, encodedPassword);
        System.out.println("Verification: " + matches);
    }
}
