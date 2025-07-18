package com.aris.javaweb_vtd.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

  @GetMapping("/")
  public String rootRedirect() {
    return "redirect:/home.html";
  }

  @GetMapping("/admin/login")
  public String loginRedirect() {
    return "redirect:/admin/login.html";
  }
}