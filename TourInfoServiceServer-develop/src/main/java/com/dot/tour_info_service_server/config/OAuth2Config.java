package com.dot.tour_info_service_server.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;

@Configuration
@RequiredArgsConstructor
// OAuth2 config, Spring Security OAuth2에서 사용
public class OAuth2Config {
    // properties 호출을 위한 객체
    private final Environment env;
    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        return new InMemoryClientRegistrationRepository(
                googleClientRegistration(),
                naverClientRegistration(),
                kakaoClientRegistration()
        );
    }

    // google
    private ClientRegistration googleClientRegistration() {
        String clientId = env.getProperty("spring.security.oauth2.client.registration.google.client-id");
        String clientSecret = env.getProperty("spring.security.oauth2.client.registration.google.client-secret");
        String redirectUri = env.getProperty("spring.security.oauth2.client.registration.google.redirect-uri");
        String scope = env.getProperty("spring.security.oauth2.client.registration.google.scope");
        String authorizationUri = env.getProperty("spring.security.oauth2.provider.google.authorization-uri");
        String tokenUri = env.getProperty("spring.security.oauth2.provider.google.token-uri");
        String userInfoUri = env.getProperty("spring.security.oauth2.provider.google.user-info-uri");
        String userNameAttribute = env.getProperty("spring.security.oauth2.provider.google.user-name-attribute");


        return ClientRegistration.withRegistrationId("google")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri(redirectUri)
                .scope("profile", "email")
                .authorizationUri(authorizationUri)
                .tokenUri(tokenUri)
                .userInfoUri(userInfoUri)
                .userNameAttributeName(userNameAttribute)
                .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                .clientName("Google")
                .build();
    }

    // naver
    private ClientRegistration naverClientRegistration() {
        String clientId = env.getProperty("spring.security.oauth2.client.registration.naver.client-id");
        String clientSecret = env.getProperty("spring.security.oauth2.client.registration.naver.client-secret");
        String redirectUri = env.getProperty("spring.security.oauth2.client.registration.naver.redirect-uri");
        String scope = env.getProperty("spring.security.oauth2.client.registration.naver.scope");
        String authorizationUri = env.getProperty("spring.security.oauth2.provider.naver.authorization-uri");
        String tokenUri = env.getProperty("spring.security.oauth2.provider.naver.token-uri");
        String userInfoUri = env.getProperty("spring.security.oauth2.provider.naver.user-info-uri");
        String userNameAttribute = env.getProperty("spring.security.oauth2.provider.naver.user-name-attribute");

        return ClientRegistration.withRegistrationId("naver")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri(redirectUri)
                .scope(scope)
                .authorizationUri(authorizationUri)
                .tokenUri(tokenUri)
                .userInfoUri(userInfoUri)
                .userNameAttributeName(userNameAttribute)
                .clientName("Naver")
                .build();
    }

    // kakao
    private ClientRegistration kakaoClientRegistration() {
        String clientId = env.getProperty("spring.security.oauth2.client.registration.kakao.client-id");
        String clientSecret = env.getProperty("spring.security.oauth2.client.registration.kakao.client-secret");
        String redirectUri = env.getProperty("spring.security.oauth2.client.registration.kakao.redirect-uri");
        String scope = env.getProperty("spring.security.oauth2.client.registration.kakao.scope");
        String authorizationUri = env.getProperty("spring.security.oauth2.provider.kakao.authorization-uri");
        String tokenUri = env.getProperty("spring.security.oauth2.provider.kakao.token-uri");
        String userInfoUri = env.getProperty("spring.security.oauth2.provider.kakao.user-info-uri");
        String userNameAttribute = env.getProperty("spring.security.oauth2.provider.kakao.user-name-attribute");

        return ClientRegistration.withRegistrationId("kakao")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_POST)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri(redirectUri)
                .scope(scope)
                .authorizationUri(authorizationUri)
                .tokenUri(tokenUri)
                .userInfoUri(userInfoUri)
                .userNameAttributeName(userNameAttribute)
                .clientName("Kakao")
                .build();
    }
}
