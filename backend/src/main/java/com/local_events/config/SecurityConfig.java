package com.local_events.config;

import com.local_events.auth.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://frontend-service-332406590258.europe-central2.run.app"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/error",
                                "/index.html",
                                "/static/**",
                                "/assets/**",
                                "/images/**",
                                "/uploads/**",
                                "/vite.svg",

                                "/events/**",
                                "/create",
                                "/my-events",
                                "/profile",
                                "/admin"
                        ).permitAll()

                        .requestMatchers(
                                "/api/users/login",
                                "/api/users/register").permitAll()

                        .requestMatchers(HttpMethod.GET,
                                "/api/events", "/api/events/*",
                                "/api/tickets/event/{id}",
                                "/api/districts",
                                "/api/categories",
                                "/api/cloudinary/signature").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/users/*").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/users/change-password").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/events").authenticated()
                        .requestMatchers("/api/events/all", "/api/events/{id}/status").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/tickets").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/tickets/{id}").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/reviews").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/reviews/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews/{id}").authenticated()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}