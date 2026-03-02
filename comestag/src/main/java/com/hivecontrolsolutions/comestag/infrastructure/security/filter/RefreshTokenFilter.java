package com.hivecontrolsolutions.comestag.infrastructure.security.filter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Filter;
import com.hivecontrolsolutions.comestag.infrastructure.security.TokenOperation;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashSet;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TOKEN_INVALID;

@Filter
@RequiredArgsConstructor
public class RefreshTokenFilter extends OncePerRequestFilter {

    private final TokenOperation tokenOperation;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        var auth = req.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            try {
                boolean isExpired = tokenOperation.isTokenExpired(auth.substring(7));
                if (isExpired)
                    throw new BusinessException(TOKEN_INVALID);
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(null, null, new HashSet<SimpleGrantedAuthority>()));
            } catch (Exception ignored) {
                throw ignored;
            }
        }
        chain.doFilter(req, res);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        return !request.getServletPath().equals("/v1/auth/refresh-token");
    }
}