package com.dot.tour_info_service_server.service.token;

import com.dot.tour_info_service_server.entity.RefreshToken;
import com.dot.tour_info_service_server.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken findByRefreshToken(String refreshToken) {
        return refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected token"));
    }

    public void deleteRefreshToken(Long mno) {
        refreshTokenRepository.deleteByUserId(mno);
    }
}
