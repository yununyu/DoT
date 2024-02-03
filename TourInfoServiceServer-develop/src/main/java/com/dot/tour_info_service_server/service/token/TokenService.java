package com.dot.tour_info_service_server.service.token;

import com.dot.tour_info_service_server.config.jwt.TokenProvider;
import com.dot.tour_info_service_server.dto.TokenDTO;
import com.dot.tour_info_service_server.repository.MemberRepository;
import com.nimbusds.oauth2.sdk.dpop.verifiers.AccessTokenValidationException;
import com.dot.tour_info_service_server.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Log4j2
public class TokenService {
    private final TokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final MemberRepository memberRepository;

    public TokenDTO generateTokens(Long mno) throws IllegalAccessException {
        String refresh = tokenProvider.generateRefresh(mno);
        String access = createNewAccessToken(refresh);

        TokenDTO tokenDto = TokenDTO.builder()
                .refreshToken(refresh)
                .token(access)
                .build();

        return tokenDto;
    }

    public String createNewAccessToken(String refreshToken) throws IllegalAccessException {
        if(!tokenProvider.validToken(refreshToken)) {
            throw new IllegalAccessException("Unexpected token");
        }

        Long UserId = refreshTokenService.findByRefreshToken(refreshToken).getUserId();
        Optional<Member> result = memberRepository.findById(UserId);
        log.info(result);

        if (result.isEmpty()){
            throw new IllegalAccessException("Unexpected token");
        }
        return tokenProvider.generateToken(result.get(), Duration.ofMinutes(10));
    }

    public String generateRefreshToken(Long mno) {
        return tokenProvider.generateRefresh(mno);
    }

    public void deleteRefreshToken(Long mno) {
        refreshTokenService.deleteRefreshToken(mno);
    }

    public void validationToken(String token) throws AccessTokenValidationException {
        if (!tokenProvider.validToken(token)){
            throw new AccessTokenValidationException("잘못된 토큰");
        }

    }
}
