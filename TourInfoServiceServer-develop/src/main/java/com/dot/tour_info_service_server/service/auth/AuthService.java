package com.dot.tour_info_service_server.service.auth;

import com.dot.tour_info_service_server.dto.*;
import com.dot.tour_info_service_server.dto.request.auth.ChangePasswordRequestDTO;
import com.dot.tour_info_service_server.dto.request.auth.EmailRequestDTO;
import com.dot.tour_info_service_server.dto.request.auth.LoginRequestDTO;
import com.dot.tour_info_service_server.dto.request.auth.SignupRequestDTO;
import com.dot.tour_info_service_server.dto.response.auth.LoginServiceDTO;
import com.dot.tour_info_service_server.entity.Member;
import com.dot.tour_info_service_server.entity.Role;
import org.apache.coyote.BadRequestException;

import javax.security.auth.login.AccountNotFoundException;
import java.security.cert.CertificateException;
import java.util.Objects;

public interface AuthService {
    LoginServiceDTO login(LoginRequestDTO requestDTO) throws Exception;
    Long signup(SignupRequestDTO signupDTO) throws Exception;
    Boolean emailCheck(String email);
    String findEmail(String name, String phone) throws Exception;
    ResponseDTO changePassword(ChangePasswordRequestDTO passwordRequestDTO) throws AccountNotFoundException;
    ResponseDTO resetPassword(EmailRequestDTO emailRequestDTO);
    Boolean checkValidate(String email);
    void resendEmail(String email) throws Exception;
    default Member signupDtoToEntity(SignupRequestDTO signupDTO) {
        Member member;

        if (Objects.equals(signupDTO.getRole(), "MEMBER")) {
            member = Member.builder()
                    .email(signupDTO.getEmail())
                    .password(signupDTO.getPassword())
                    .birth(signupDTO.getBirth())
                    .phone(signupDTO.getPhone())
                    .name(signupDTO.getName())
                    .isApprove(true)
                    .build();
            member.addMemberRole(Role.MEMBER);
        } else {
            member = Member.builder()
                    .email(signupDTO.getEmail())
                    .password(signupDTO.getPassword())
                    .birth(signupDTO.getBirth())
                    .phone(signupDTO.getPhone())
                    .name(signupDTO.getName())
                    .businessId(signupDTO.getBusinessId())
                    .isApprove(false)
                    .build();
            member.addMemberRole(Role.BUSINESSPERSON);
        }
        return member;
    }

    void logout();
}
