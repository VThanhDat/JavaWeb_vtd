package com.aris.javaweb_vtd;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@SpringBootApplication
@MapperScan("com.aris.javaweb_vtd.mapper")
@EnableElasticsearchRepositories(basePackages = "com.aris.javaweb_vtd.elasticsearch.repository")
public class JavawebVtdApplication {

	public static void main(String[] args) {
		SpringApplication.run(JavawebVtdApplication.class, args);
	}

}
