package com.dot.tour_info_service_server.security.handler;

import com.dot.tour_info_service_server.dto.TokenDTO;
import com.dot.tour_info_service_server.security.dto.AuthMemberDTO;
import com.dot.tour_info_service_server.service.token.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Log4j2
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final TokenService tokenService;

    @Value("${client.address}")
    private String clientAddress;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        log.info("success");
        AuthMemberDTO authMemberDTO = (AuthMemberDTO) authentication.getPrincipal();

        log.info("OAuth2User in principal=" + /*oAuth2User*/ authMemberDTO);
        log.info("generate token");
        TokenDTO token;
        try {
            // generate access token, refresh token
            token = tokenService.generateTokens(authMemberDTO.getMno());
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }

        String targetUrl = UriComponentsBuilder
//                .fromUriString("/home")
                .fromHttpUrl(("localhost".equals(clientAddress) ? "http://localhost:3000/oauth2" : clientAddress+"/oauth2"))
                .queryParam("mno", authMemberDTO.getMno())
                .queryParam("token", token.getToken())
                .queryParam("refreshToken",token.getRefreshToken())
                .build()
                .toUriString();
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
