package com.dot.tour_info_service_server.config.jwt;

import com.dot.tour_info_service_server.security.dto.AuthMemberDTO;
import com.dot.tour_info_service_server.entity.Member;
import com.dot.tour_info_service_server.entity.RefreshToken;
import com.dot.tour_info_service_server.repository.RefreshTokenRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Log4j2
public class TokenProvider {
    private final JwtProperties jwtProperties;
    private final RefreshTokenRepository refreshTokenRepository;
    private static final String AUTHORITIES_KEY = "auth";
    private static final String BEARER_TYPE = "Bearer";
    private Key key;

    //token 생성 method
    public String generateToken(Member member, Duration expiredAt){
        Date now = new Date();
        return makeToken(new Date(now.getTime() + expiredAt.toMillis()), member);
    }

    //token 생성 method
    private String makeToken(Date expiry, Member member) {
        Date now = new Date();

        key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());

        return Jwts.builder()
                .header()
                .add("typ","JWT")
                .and()
                .issuer(jwtProperties.getIssuer())
                .issuedAt(now)
                .expiration(expiry)
                .subject(member.getEmail())
                .claim(AUTHORITIES_KEY, member.getRoleSet())
                .claim("id", member.getMno())
                .signWith(key)
                .compact();
    }

    @Transactional
    public String generateRefresh(Long mno) {
        Date now = new Date();

        key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());

        String refreshToken = Jwts.builder()
                .header()
                .add("typ","JWT")
                .and()
                .issuer(jwtProperties.getIssuer())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + Duration.ofHours(3).toMillis()))
                .subject(String.valueOf(mno))
                .signWith(key)
                .compact();

        Optional<RefreshToken> result = refreshTokenRepository.findByUserId(mno);

        RefreshToken refreshTokenEntity;

        if (result.isPresent()){
            refreshTokenEntity = result.get();
            refreshTokenEntity.update(refreshToken);
        } else {
            refreshTokenEntity = RefreshToken.builder()
                    .userId(mno)
                    .refreshToken(refreshToken)
                    .build();
        }

        refreshTokenRepository.save(refreshTokenEntity);

        return refreshToken;
    }

    // 유효 token 검증 method
    public boolean validToken(String token) {
        key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());

        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        return false;
    }

    // jwt의 정보 중 role으로 권한정보 추출 및 principal에 저장하기 위한 authentication 생성
    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);

        // jwt에 role가 없는 경우 => 권한x
        if (claims.get(AUTHORITIES_KEY) == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // jwt 저장된 role으로 role collection 생성
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        // security context principal 저장하기 위한 객체 생성
        UserDetails principal = new AuthMemberDTO(claims.getSubject(), claims.get("id", Long.class), "", false, authorities);
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    // jwt로 mno 추출
    public Long getMemberId(String token) {
        Claims claims = getClaims(token);
        return claims.get("id", Long.class);
    }

    // jwt로 email 추출
    public String getMemberEmail(String token) {
        Claims claims = getClaims(token);
        return claims.get("sub", String.class);
    }

    // jwt parsing method
    private Claims getClaims(String token) {
        key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());

        return Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
