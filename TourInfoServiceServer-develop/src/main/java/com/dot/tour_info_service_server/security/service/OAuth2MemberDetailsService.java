package com.dot.tour_info_service_server.security.service;

import com.dot.tour_info_service_server.repository.MemberRepository;
import com.dot.tour_info_service_server.security.dto.AuthMemberDTO;
import com.dot.tour_info_service_server.entity.Member;
import com.dot.tour_info_service_server.entity.Role;
import lombok.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class OAuth2MemberDetailsService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final MemberRepository memberRepository;
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);

        // oauth service 제공자 get
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // oauth 정보 획득
        OAuth2Attribute oAuth2Attribute = OAuth2Attribute.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        log.info("{}", oAuth2Attribute);

        Member member = saveSocialMember(oAuth2Attribute);
        AuthMemberDTO authMemberDTO = new AuthMemberDTO(member.getEmail(), member.getMno(), member.getPassword(),
                member.isFromSocial(), member.getRoleSet().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_"+role.name()))
                .collect(Collectors.toList()), oAuth2User.getAttributes());



        // OAuth2User를 implements한 authMemberDTO return
        return authMemberDTO;
    }

    private Member saveSocialMember(OAuth2Attribute oAuth2Attribute) {
        Optional<Member> result = memberRepository.findByEmail(oAuth2Attribute.getEmail());

        Member member;
        // 등록되지 않은 member 등록
        if (result.isEmpty()) {
            member = Member.builder()
                    .email(oAuth2Attribute.getEmail())
                    .image(oAuth2Attribute.getPicture())
                    .name(oAuth2Attribute.getName())
                    .password("1")
                    .isApprove(true)
                    .isValidate(true)
                    .isReset(true)
                    .fromSocial(true)
                    .build();
            member.addMemberRole(Role.MEMBER);
            member = memberRepository.save(member);
        } else {
            member = result.get();
        }
        return member;
    }
}

@ToString
@Builder(access = AccessLevel.PRIVATE)
@Getter
@Log4j2
class OAuth2Attribute {
    private Map<String, Object> attributes;
    private String attributeKey;
    private String email;
    private String name;
    private String picture;

    static OAuth2Attribute of(String provider, String attributeKey, Map<String, Object> attributes) {
        switch (provider) {
            case "google":
                return ofGoogle(attributeKey, attributes);
            case "kakao":
                return ofKakao(attributeKey, attributes);
            case "naver":
                return ofNaver(attributeKey, attributes);
            default:
                throw new RuntimeException();
        }
    }

    // google OAuth2Attribute 변환
    private static OAuth2Attribute ofGoogle(String attributeKey, Map<String, Object> attributes) {
        return OAuth2Attribute.builder()
                .name((String) attributes.get("name"))
                .email("google_"+attributes.get("email"))
                .picture((String) attributes.get("picture"))
                .attributes(attributes)
                .attributeKey(attributeKey)
                .build();
    }

    // kakao OAuth2Attribute 변환
    private static OAuth2Attribute ofKakao(String attributeKey, Map<String, Object> attributes) {
        log.info("ofKakao");
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> kakaoProfile = (Map<String, Object>) kakaoAccount.get("profile");

        return OAuth2Attribute.builder()
                .name((String) kakaoProfile.get("nickname"))
                .email("kakao_"+kakaoAccount.get("email"))
                .picture((String) kakaoProfile.get("profile_image_url"))
                .attributes(kakaoAccount)
                .attributeKey(attributeKey)
                .build();
    }

    // naver OAuth2Attribute 변환
    private static OAuth2Attribute ofNaver(String attributeKey, Map<String, Object> attributes) {
        log.info(attributes);
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");

        return OAuth2Attribute.builder()
                .name((String) response.get("name"))
                .email("naver_"+response.get("email"))
                .picture((String) response.get("profile_image"))
                .attributes(response)
                .attributeKey(attributeKey)
                .build();
    }
}
