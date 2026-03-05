package com.local_events.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaFallbackController {

    @GetMapping({
            "/events/**",
            "/login",
            "/register",
            "/create",
            "/my-events",
            "/profile",
            "/admin"
    })
    public String forwardToFrontend() {
        return "forward:/index.html";
    }
}