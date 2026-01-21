package com.smartinventory.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to generate BCrypt password hashes
 * Run this as a Java application to generate password hashes
 */
public class GeneratePasswordHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String password = "admin123";
        String hash = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("\nVerification test:");
        System.out.println("Does '" + password + "' match the hash? " + encoder.matches(password, hash));
        
        // Print SQL update statement
        System.out.println("\n--- SQL Update Statements ---");
        System.out.println("UPDATE users SET password = '" + hash + "' WHERE username = 'admin';");
        System.out.println("UPDATE users SET password = '" + hash + "' WHERE username = 'manager';");
        System.out.println("UPDATE users SET password = '" + hash + "' WHERE username = 'user';");
    }
}
