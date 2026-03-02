package com.hivecontrolsolutions.comestag.core.domain.model.enums;

import lombok.Getter;

import java.net.URLConnection;
import java.util.Map;
import java.util.Set;

@Getter
public enum MediaType {
    IMAGE("/image"),
    VIDEO("/video"),
    FILE("/file");   // default / everything else

    private final String typeDire;

    private static final Set<String> IMAGE_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "bmp", "webp", "heic"
    );
    private static final Set<String> VIDEO_EXTENSIONS = Set.of(
            "mp4", "mov", "avi", "mkv", "webm"
    );

    // Optional: explicit mapping for common extensions -> MIME types
    private static final Map<String, String> EXTENSION_TO_MIME = Map.ofEntries(
            // images
            Map.entry("jpg",  "image/jpeg"),
            Map.entry("jpeg", "image/jpeg"),
            Map.entry("png",  "image/png"),
            Map.entry("gif",  "image/gif"),
            Map.entry("bmp",  "image/bmp"),
            Map.entry("webp", "image/webp"),
            Map.entry("heic", "image/heic"),

            // videos
            Map.entry("mp4",  "video/mp4"),
            Map.entry("mov",  "video/quicktime"),
            Map.entry("avi",  "video/x-msvideo"),
            Map.entry("mkv",  "video/x-matroska"),
            Map.entry("webm", "video/webm"),

            // some common file types
            Map.entry("pdf",  "application/pdf"),
            Map.entry("txt",  "text/plain"),
            Map.entry("csv",  "text/csv"),
            Map.entry("json", "application/json"),
            Map.entry("zip",  "application/zip")
    );

    MediaType(String typeDire) {
        this.typeDire = typeDire;
    }

    // ----------------------------------------------------
    // Helpers for extension → MediaType
    // ----------------------------------------------------

    public static MediaType fromFilename(String filename) {
        String ext = extractExtension(filename);
        if (ext == null) {
            return FILE;
        }

        if (IMAGE_EXTENSIONS.contains(ext)) {
            return IMAGE;
        }
        if (VIDEO_EXTENSIONS.contains(ext)) {
            return VIDEO;
        }
        return FILE;
    }

    public static MediaType fromExtension(String extension) {
        if (extension == null) {
            return FILE;
        }
        String ext = extension.toLowerCase().replace(".", "");

        if (IMAGE_EXTENSIONS.contains(ext)) {
            return IMAGE;
        }
        if (VIDEO_EXTENSIONS.contains(ext)) {
            return VIDEO;
        }
        return FILE;
    }

    private static String extractExtension(String filenameOrPath) {
        if (filenameOrPath == null || filenameOrPath.isBlank()) {
            return null;
        }
        String name = filenameOrPath;
        // Strip path if present
        int slashIdx = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
        if (slashIdx >= 0 && slashIdx < name.length() - 1) {
            name = name.substring(slashIdx + 1);
        }

        int dotIdx = name.lastIndexOf('.');
        if (dotIdx < 0 || dotIdx == name.length() - 1) {
            return null;
        }
        return name.substring(dotIdx + 1).toLowerCase();
    }

    // ----------------------------------------------------
    // Content-Type detection for responses
    // ----------------------------------------------------

    /**
     * Detects a MIME Content-Type for the given file path or filename.
     * Example result: "image/png", "video/mp4", "application/pdf", etc.
     */
    public static String detectContentType(String pathOrFilename) {
        if (pathOrFilename == null || pathOrFilename.isBlank()) {
            return "application/octet-stream"; // safe default
        }

        // 1) Try JDK's built-in guess by name
        String guessed = URLConnection.guessContentTypeFromName(pathOrFilename);
        if (guessed != null) {
            return guessed;
        }

        // 2) Fallback to our extension → MIME mapping
        String ext = extractExtension(pathOrFilename);
        if (ext != null) {
            String mapped = EXTENSION_TO_MIME.get(ext);
            if (mapped != null) {
                return mapped;
            }
        }

        // 3) Last fallback
        MediaType mediaType = fromFilename(pathOrFilename);
        if (mediaType == IMAGE) {
            return "image/*";
        }
        if (mediaType == VIDEO) {
            return "video/*";
        }
        return "application/octet-stream";
    }
}
