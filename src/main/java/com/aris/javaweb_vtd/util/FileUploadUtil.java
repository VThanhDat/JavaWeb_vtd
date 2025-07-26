package com.aris.javaweb_vtd.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

public class FileUploadUtil {
  public static String saveImage(MultipartFile file, String uploadDir) throws IOException {
    if (file == null || file.isEmpty())
      return null;

    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
    Path path = Paths.get(uploadDir, filename);
    Files.createDirectories(path.getParent());
    Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

    return filename;
  }

  public static void deleteImage(String uploadDir, String filename) {
    if (filename == null || filename.trim().isEmpty())
      return;

    Path path = Paths.get(uploadDir, filename);
    try {
      Files.deleteIfExists(path);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public static void validateImage(MultipartFile image) {
    if (image == null || image.isEmpty()) {
      throw new IllegalArgumentException("Select one image");
    }
  }

  public static String getImageFolder(String type) {
    return type.equalsIgnoreCase("food") ? "uploads/food" : "uploads/drink";
  }

  public static String extractFilename(String fullPath) {
    return fullPath.substring(fullPath.lastIndexOf('/') + 1);
  }

  public static String extractFolder(String fullPath) {
    return fullPath.substring(0, fullPath.lastIndexOf('/'));
  }

  public static void safeDeleteImage(String fullPath) {
    String folder = extractFolder(fullPath);
    String file = extractFilename(fullPath);
    FileUploadUtil.deleteImage(folder, file);
  }
}
