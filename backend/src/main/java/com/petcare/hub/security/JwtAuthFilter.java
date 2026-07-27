package com.petcare.hub.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Extracts and validates a JWT bearer token on every request, populating the
 * SecurityContext when one is present and valid.
 * <p>
 * This filter deliberately does <b>not</b> hand-roll any path matching (no
 * AntPathMatcher, no AntPathRequestMatcher, no PathPatternRequestMatcher).
 * That responsibility belongs entirely to {@code SecurityConfig}'s
 * {@code authorizeHttpRequests(...)} rules, which are Spring Security's own
 * maintained, version-correct mechanism for deciding which paths are public
 * vs. protected. Keeping path matching in exactly one place avoids the two
 * engines ever disagreeing about what a given path pattern means — a class
 * of bug Spring Security's own advisories have warned about.
 * <p>
 * Running on every request is safe: with no/invalid token the filter simply
 * leaves the request unauthenticated and lets it continue — public routes
 * are already open per the security rules, and protected routes will be
 * rejected there if authentication is missing.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtUtil.extractEmail(token);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ex) {
            // Invalid/expired token: request proceeds unauthenticated and will be
            // rejected downstream by Spring Security's access rules if the route
            // requires authentication.
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
