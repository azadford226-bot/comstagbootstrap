package com.hivecontrolsolutions.comestag.infrastructure.security.filter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Filter;
import com.hivecontrolsolutions.comestag.infrastructure.security.TokenOperation;
import com.hivecontrolsolutions.comestag.infrastructure.security.entity.UserClaimsDto;
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
public class JwtAuthFilter extends OncePerRequestFilter {
    private final TokenOperation tokenOperation;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        var auth = req.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            try {
                UserClaimsDto userClaimsDto = tokenOperation.extractUserFromClaims(auth.substring(7));
                if (userClaimsDto == null)
                    throw new BusinessException(TOKEN_INVALID);
                var authorities = new HashSet<SimpleGrantedAuthority>();
                authorities.add(new SimpleGrantedAuthority("ROLE_".concat(userClaimsDto.getType().name())));
                authorities.add(new SimpleGrantedAuthority("Profile_".concat(userClaimsDto.getStatus().name())));
                var authentication = new UsernamePasswordAuthenticationToken(userClaimsDto, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception ignored) {
                throw ignored;
            }
        }
        chain.doFilter(req, res);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        return request.getServletPath().equals("/v1/auth/refresh-token");
    }
}