package com.aris.javaweb_vtd.filter;

import java.io.IOException;

import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class LoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        long startTime = System.currentTimeMillis();
        System.out.println("[Filter] Reqest URI: " + req.getRequestURI());

        chain.doFilter(request, response);

        long duration = System.currentTimeMillis() - startTime;
        System.out.println("[Filter] Completed URI: " + req.getRequestURI() + "in " +
                duration + " ms");
    }
}
