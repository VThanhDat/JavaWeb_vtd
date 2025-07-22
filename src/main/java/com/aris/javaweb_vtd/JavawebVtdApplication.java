package com.aris.javaweb_vtd;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.aris.javaweb_vtd.mapper")
public class JavawebVtdApplication {

	public static void main(String[] args) {
		SpringApplication.run(JavawebVtdApplication.class, args);
	}

}
