package com.dot.tour_info_service_server.security.service;

import com.dot.tour_info_service_server.repository.MemberRepository;
import com.dot.tour_info_service_server.security.dto.AuthMemberDTO;
import com.dot.tour_info_service_server.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MemberDetailsServiceImpl implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Member> result = memberRepository.findByEmail(username);

        if (result.isEmpty()) {
            throw new UsernameNotFoundException("unregistered users");
        }
        Member member = result.get();
        AuthMemberDTO authMemberDTO = new AuthMemberDTO(
                member.getEmail(), member.getMno(), member.getPassword(), member.isFromSocial(),
                member.getRoleSet().stream().map(role ->
                        new SimpleGrantedAuthority("ROLE_" + role.name())).collect(Collectors.toList()));

        authMemberDTO.setName(member.getName());
        authMemberDTO.setFromSocial(member.isFromSocial());

        return authMemberDTO;
    }
}
