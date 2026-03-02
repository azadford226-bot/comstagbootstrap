package com.hivecontrolsolutions.comestag;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPasswordHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String password = "Admin@123!";
        String hashFromDb = "$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy";
        
        System.out.println("Testing password: " + password);
        System.out.println("Against hash: " + hashFromDb);
        System.out.println("");
        
        boolean matches = encoder.matches(password, hashFromDb);
        System.out.println("Password matches: " + matches);
        
        if (!matches) {
            System.out.println("");
            System.out.println("Generating new hash for 'Admin@123!':");
            String newHash = encoder.encode(password);
            System.out.println(newHash);
        }
    }
}
