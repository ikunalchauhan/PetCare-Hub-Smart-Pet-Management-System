package com.petcare.hub.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    /**
     * Returns the id of the currently authenticated user (extracted from the
     * User entity attached to the security context by JwtAuthFilter).
     */
    public String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetailsService.AuthenticatedUser principal)) {
            throw new IllegalStateException("No authenticated user found in security context");
        }
        return principal.getUser().getId();
    }
}
