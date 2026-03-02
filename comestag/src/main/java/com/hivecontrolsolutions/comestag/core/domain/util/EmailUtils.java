package com.hivecontrolsolutions.comestag.core.domain.util;

public class EmailUtils {
        public static String extractDomain(String email) {
            String[] parts = email.trim().toLowerCase().split("@");
        if (parts.length != 2) throw new IllegalArgumentException("Invalid email");
        return java.net.IDN.toASCII(parts[1]);
    }

}
