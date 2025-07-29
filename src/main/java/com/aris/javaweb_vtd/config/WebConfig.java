package com.aris.javaweb_vtd.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.aris.javaweb_vtd.interceptor.LoggingInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Autowired
  private LoggingInterceptor loggingInterceptor;

  @Override
  public void addInterceptors(@NonNull InterceptorRegistry registry) {
    registry.addInterceptor(loggingInterceptor).addPathPatterns("/admin/**",
        "/home"); // allocate URL need interceptor
  }

  @Override
  public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/js/**")
        .addResourceLocations("classpath:/static/assets/js/");
    registry.addResourceHandler("/css/**")
        .addResourceLocations("classpath:/static/assets/css/");
    registry.addResourceHandler("/img/**")
        .addResourceLocations("classpath:/static/assets/img/");
    registry.addResourceHandler("/uploads/**")
        .addResourceLocations("file:uploads/");
  }
}
