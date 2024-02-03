package com.dot.tour_info_service_server.controller;

import com.dot.tour_info_service_server.dto.*;
import com.dot.tour_info_service_server.dto.request.auth.*;
import com.dot.tour_info_service_server.dto.response.auth.LoginServiceDTO;
import com.dot.tour_info_service_server.security.util.SecurityUtil;
import com.dot.tour_info_service_server.service.auth.AuthService;
import com.dot.tour_info_service_server.service.token.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import javax.security.auth.login.AccountNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Log4j2
@RequestMapping("auth")
@RequiredArgsConstructor
@Validated
public class AuthController {
    private final AuthService authService;
    private final TokenService tokenService;

    @Value("${client.address}")
    private String clientAddress;

    // permit all
    @PostMapping("/login")
    public ResponseEntity<ResponseMapDTO> login(@Valid @RequestBody LoginRequestDTO requestDTO) throws Exception {
        ResponseMapDTO result;
        LoginServiceDTO loginServiceDTO;

        try {
            loginServiceDTO = authService.login(requestDTO);
        } catch (Exception e) {
            log.error(e.getMessage());
                throw e;
        }

        try {
            String refreshToken = tokenService.generateRefreshToken(loginServiceDTO.getMno());
            TokenDTO tokens = TokenDTO.builder()
                    .refreshToken(refreshToken)
                    .token(tokenService.createNewAccessToken(refreshToken))
                    .build();
            result = ResponseMapDTO.builder()
                    .response(Map.of("mno", loginServiceDTO.getMno(), "tokens", tokens, "message", loginServiceDTO.getMessage()))
                    .build();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // permit all
    @PostMapping("/newToken")
    public ResponseEntity<Object> createNewToken(@Valid @RequestBody NewTokenRequestDTO newTokenRequestDTO) {
        Map<String, String> result = new HashMap<>();
        try {
            String newToken = tokenService.createNewAccessToken(newTokenRequestDTO.getRefreshToken());
            result.put("msg", "로그인 성공");
            result.put("token", newToken);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .msg(e.getMessage())
                    .result(false)
                    .build(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // authenticated
    @PostMapping("/logout")
    public ResponseEntity<ResponseDTO> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            log.info(request);
            log.info(response);
            log.info(SecurityContextHolder.getContext().getAuthentication());
            authService.logout();
            new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
            return new ResponseEntity<>(new ResponseDTO("success", true), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseDTO(e.getMessage(), false),HttpStatus.NOT_FOUND);
        }
    }

    //permit all
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Long>> register(@Valid @RequestBody SignupRequestDTO signupDTO) {
        Map<String, Long> responseMap = new HashMap<>();

        try {
            Long num = authService.signup(signupDTO);
            responseMap.put("mno", num);
        } catch (MailException e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }

    // permit all
    // 이메일 중복 검사
    @PostMapping("/email/check")
    public ResponseEntity<Map<String, Boolean>> checkDuplicate(@Valid @RequestBody EmailRequestDTO emailDTO) {
        Map<String, Boolean> responseMap = new HashMap<>();
        Boolean isDuplicate = false;
        try {
            isDuplicate = authService.emailCheck(emailDTO.getEmail());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        responseMap.put("isDuplicate", isDuplicate);

        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }

    // permit all
    // 이메일 인증 재전송
    @PostMapping("/email/re-validation")
    public ResponseEntity<Map<String, String>> checkValidate(@Valid @RequestBody EmailRequestDTO emailDTO) {
        try {
            authService.resendEmail(emailDTO.getEmail());
        } catch (Exception e) {
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("msg", e.getMessage());
            log.error(responseMap.get("msg"));
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }


    // 이메일 검증 주소
    // permit all
    @GetMapping("/email/validation")
    public ModelAndView checkValtidate(@RequestParam("email") String email,
                                       @RequestParam("token") String token) throws BadRequestException {
        boolean isValid = authService.checkValidate(email);

        try {
            tokenService.validationToken(token);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new BadRequestException("잘못된 요청");
        }

        if (isValid) {
            // 성공한 경우
            return new ModelAndView(new RedirectView("http://"+("localhost".equals(clientAddress) ? "localhost:3000" : clientAddress)));
        } else {
            // 실패한 경우 (badRequest)
            throw new BadRequestException("잘못된 요청");
//            return new ModelAndView("errorPage"); // 실패 시 보여줄 에러 페이지로 이동
        }
    }

    // 이메일 찾기
    // permit all
    @PostMapping("/email/find")
    public ResponseEntity<Map<String, String>> findMail(@Valid @RequestBody EmailFindRequestDTO findRequestDTODTO) {
        Map<String, String> responseMap = new HashMap<>();
        try {
            String email = authService.findEmail(findRequestDTODTO.getName(), findRequestDTODTO.getPhone());
            responseMap.put("email", email);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
    
    // 비밀번호 변경
    // authenticated
    @PostMapping("password/change")
    public ResponseEntity<ResponseDTO> changePassword(@Valid @RequestBody ChangePasswordRequestDTO passwordRequestDTO) throws Exception {
        if (SecurityUtil.validateEmail(passwordRequestDTO.getEmail())) {
            ResponseDTO result = authService.changePassword(passwordRequestDTO);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 비밀번호 찾기
    // permit all
    @PostMapping("password/lost")
    public ResponseEntity<ResponseDTO> lostPassword(@Valid @RequestBody EmailRequestDTO emailRequestDTO) {
        ResponseDTO result = authService.resetPassword(emailRequestDTO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
