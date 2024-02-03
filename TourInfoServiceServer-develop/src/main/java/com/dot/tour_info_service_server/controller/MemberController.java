package com.dot.tour_info_service_server.controller;

import com.dot.tour_info_service_server.dto.*;
import com.dot.tour_info_service_server.dto.request.member.FindMemberRequestDTO;
import com.dot.tour_info_service_server.dto.request.member.MemberUpdateRequestDTO;
import com.dot.tour_info_service_server.security.util.SecurityUtil;
import com.dot.tour_info_service_server.service.member.MemberService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@Log4j2
@RequiredArgsConstructor
@Validated
public class MemberController {
    private final MemberService memberService;


    // 회원정보 조회 검증 필요
    // authenticated
    @GetMapping(value = "/info")
    public ResponseEntity<UserInfoDTO> findUserInfo(@Valid @RequestParam("mno") @NotNull(message = "mno cannot be Empty") Long mno) {
        log.info("findUserInfo........." + mno);
        if (SecurityUtil.validateMno(mno)) {
            UserInfoDTO userInfoDTO = memberService.showUserInfo(mno);
            return new ResponseEntity<>(userInfoDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    //     회원정보 수정 검증 필요
    // authenticated
    @PutMapping(value = "/info/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserInfoDTO> updateUserInfo(@Valid @RequestPart("member") MemberUpdateRequestDTO requestMemberDTO,
                                                      @RequestPart("image") MultipartFile userImage) {
        log.info("updateUserInfo.........");
        log.info(requestMemberDTO);
        log.info(userImage.isEmpty());
        if (SecurityUtil.validateMno(requestMemberDTO.getMno())) {
            if(!userImage.isEmpty())
                requestMemberDTO.setImage(userImage);
            UserInfoDTO changedUserInfo = memberService.modifyUserInfo(requestMemberDTO);
            return new ResponseEntity<>(changedUserInfo, HttpStatus.OK);
        } else {
            log.error("token is not valid");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 회원 프로필 조회
    // permit all
    @GetMapping(value = "/profile")
    public ResponseEntity<UserProfileDTO> findUserProfile(@Valid @RequestParam("mno")
                                                              @NotNull(message = "mno cannot be Empty") Long mno) {
        log.info("User Profile..........");
        UserProfileDTO userProfileDTO = memberService.showUserProfile(mno);
        return new ResponseEntity<>(userProfileDTO, HttpStatus.OK);
    }

    // 회원 탈퇴 검증 필요
    // authenticated
    @DeleteMapping(value = "/delete")
    public ResponseEntity<Map<String, Long>> removeUserInfo(@Valid @RequestParam("mno")
                                                                @NotNull(message = "mno cannot be Empty") Long mno) {
        log.info("User Delete......");
        Map<String, Long> result = new HashMap<>();
        if (SecurityUtil.validateMno(mno)) {
            memberService.deleteUserInfo(mno);
            result.put("mno", mno);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 회원 검색
    // permit all
    @PostMapping(value = "/find")
    public ResponseEntity<List<SearchUserListDTO>> findUser(@RequestParam("search") String search,
                                                            @RequestBody(required = false) FindMemberRequestDTO mnoDTO,
                                                            @RequestParam int page) {
        log.info("Searching User.......");
        List<SearchUserListDTO> userlist;
        if(mnoDTO.getMno()==null){
            userlist=memberService.searchUser(search,null, page);
        }else {
            userlist = memberService.searchUser(search, mnoDTO.getMno(), page);
        }
        return new ResponseEntity<>(userlist, HttpStatus.OK);
    }


    // 회원가입대기 조회 ( 관리자만 )
    // admin
    @GetMapping(value = "/waiting")
    public ResponseEntity<List<JoinWaitingDTO>> showJoinWaiting(@RequestParam(value = "page",required = false) int page) {
        log.info("JoinWaiting List.............");
        List<JoinWaitingDTO> list = memberService.showJoinWaiting(page);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    // 회원가입 승인 ( 관리자만 )
    // admin
    @PutMapping(value = "/approve")
    public ResponseEntity<Map<String,Long>> joinMember(@Valid @RequestParam("mno")
                                                           @NotNull(message = "mno cannot be Empty") Long mno){
        log.info("Join..............");
        Map<String, Long> result = new HashMap<>();
        memberService.joinMember(mno);
        result.put("mno", mno);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 페이징 처리 완료
    //회원 검색 관리자
    // admin
    @GetMapping(value = "/filter-find")
    public ResponseEntity<List<MemberDetailDTO>> managerSearchUser(@RequestParam(value = "page",required = false) int page,@RequestParam("filter") String filter,
                                                                   @RequestParam("search") String name) {
        log.info(filter + " , " + name);
        List<MemberDetailDTO> result = memberService.managerToSearchUser(page,filter, name);
        log.info(result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}





