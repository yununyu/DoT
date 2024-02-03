package com.dot.tour_info_service_server.service.member;

import com.dot.tour_info_service_server.dto.*;
import com.dot.tour_info_service_server.dto.request.member.MemberUpdateRequestDTO;
import com.dot.tour_info_service_server.entity.Member;
import com.dot.tour_info_service_server.entity.Role;
import com.dot.tour_info_service_server.repository.*;
import com.dot.tour_info_service_server.service.image.ImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Log4j2
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final ImageService imageService;

    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final CartRepository cartRepository;
    private final DisciplinaryRepository disciplinaryRepository;
    private final FolderRepository folderRepository;
    private final FollowRepository followRepository;
    private final ReplyRepository replyRepository;

    //회원정보조회
    @Override
    public UserInfoDTO showUserInfo(Long mno) {
        Object[] result = memberRepository.userInfo(mno).get(0);
        if (result != null) {
            UserInfoDTO userInfoDTO = UserInfoDTO.builder()
                    .mno((Long) result[0])
                    .image((String) result[1])
                    .name((String) result[2])
                    .email((String) result[3])
                    .phone((String) result[4])
                    .birth((LocalDate) result[5])
                    .role((Role) result[6])
                    .fromSocial((Boolean) result[7])
                    .build();
            return userInfoDTO;
        }
        return null;
    }

    // 회원정보수정 ( 이름, 전화번호, 이미지 )
    @Override
    @Transactional
    public UserInfoDTO modifyUserInfo(MemberUpdateRequestDTO requestMemberDTO) {
        Optional<Member> result = memberRepository.findById(requestMemberDTO.getMno());
        if (result.isEmpty()) {
            throw new RuntimeException("유저 정보가 없습니다");
        }
        Member member = result.get();
        // 기존 파일 삭제
        if (member.getImage()!=null) {
            try {// DB에 저장된 주소를 얻어 삭제
                imageService.deleteFile(member.getImage());
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }
        // 파일 업로드
        FileDTO newSrc;
        if (requestMemberDTO.getImage() != null) {
            List<MultipartFile> image = new ArrayList<>();
            image.add(requestMemberDTO.getImage());
            try {
                newSrc = imageService.uploadFile(image).get(0);
                member.changeImage(newSrc.getFileUrl());
            } catch (Exception e) {
                e.fillInStackTrace();
                log.error("사진 등록 에러: " + e.getMessage());
                throw new RuntimeException("사진 등록 실패");
            }
        }
        // DB 유저 정보 수정
        member.changeName(requestMemberDTO.getName());
        member.changePhone(requestMemberDTO.getPhone());

        try {
            memberRepository.save(member);
        } catch (Exception e) {
            log.error("DB 수정 에러: " + e.getMessage());
            throw new RuntimeException("USER 정보 수정 실패");
        }
        return null;
    }

    // 회원 프로필 조회 ( 이름, 팔로잉, 팔로워, 찜목록, 이미지 )
    @Override
    public UserProfileDTO showUserProfile(Long mno) {
        List<Object[]> result = memberRepository.findProfileByMno(mno);
        if (!result.isEmpty()) {
            UserProfileDTO userProfileDTO = UserProfileDTO.builder()
                    .mno((Long) result.get(0)[0])
                    .name((String) result.get(0)[1])
                    .followings(memberRepository.showFollowings((Long) result.get(0)[0]))
                    .followers(memberRepository.showFollowers((Long) result.get(0)[0]))
                    .cart(memberRepository.showCart((Long) result.get(0)[0]))
                    .image((String) result.get(0)[5])
                    .build();
            return userProfileDTO;
        }
        return null;
    }

    // 회원 탈퇴
    @Override
    @Transactional
    public void deleteUserInfo(Long mno) {
        boardRepository.setNullMno(mno);
        boardLikeRepository.removeBoardLIkeByMno(mno);
        cartRepository.removeCartByMno(mno);
        disciplinaryRepository.setNullMno(mno);
        folderRepository.removeFolderByMno(mno);
        followRepository.deleteFollowByMno(mno);
        replyRepository.setNullMno(mno);
        memberRepository.deleteById(mno);
    }

    //회원 검색
    @Override
    public List<SearchUserListDTO> searchUser(String name, Long mno, int page) {
        PageRequest pageRequest = PageRequest.of(page, 10);
        Page<Object[]> pages = memberRepository.searchUser(name, mno, pageRequest);
        List<Object[]> result = pages.getContent();
        List<SearchUserListDTO> userlist = new ArrayList<>();

        if (!result.isEmpty()) {
            for (Object[] list : result) {
                SearchUserListDTO searchUserListDTO = SearchUserListDTO.builder()
                        .mno((Long) list[0])
                        .image((String) list[1])
                        .name((String) list[2])
                        .followers((Long) list[3])
                        .followings((Long) list[4])
                        .followCheck((Boolean) list[5])
                        .build();
                userlist.add(searchUserListDTO);
            }
            return userlist;
        }
        return null;
    }

    // 회원가입 대기 목록
    @Override
    public List<JoinWaitingDTO> showJoinWaiting(int page) {
        PageRequest pageRequest=PageRequest.of(page,10);

        Page<Object[]> page1 = memberRepository.showJoinWaiting(pageRequest);
        List<Object[]> result=page1.getContent();
        List<JoinWaitingDTO> waitingList = new ArrayList<>();
        if (!result.isEmpty()) {
            for (Object[] list : result) {
                JoinWaitingDTO joinWaitingDTO = JoinWaitingDTO.builder()
                        .mno((Long) list[0])
                        .name((String) list[1])
                        .email((String) list[2])
                        .businessId((String) list[3])
                        .build();
                waitingList.add(joinWaitingDTO);
            }
            return waitingList;
        }
        return null;
    }

    // 회원가입승인 ( is_approve를 true로 )
    @Override
    @Transactional
    public void joinMember(Long mno) {
        memberRepository.joinMember(mno);
    }

    //회원 조회 - 관리자
    @Override
    public List<MemberDetailDTO> managerToSearchUser(int page,String filter, String name) {
        //페이지 네이션
        PageRequest pageRequest=PageRequest.of(page,10);

        List<Object[]> member = new ArrayList<>();
        List<MemberDetailDTO> memberDetailDTOS = new ArrayList<>();

        if (filter.equals("all")) {
            Page<Object[]> objects=memberRepository.searchMemberAll(name,pageRequest);
            member = objects.getContent();
        } else if (filter.equals("normal")) {
            Page<Object[]> objects = memberRepository.searchNomal(name,pageRequest);
            member = objects.getContent();
        } else if (filter.equals("business")) {
            Page<Object[]> objects=memberRepository.searchBusiness(name,pageRequest);
            member = objects.getContent();
        } else if (filter.equals("disciplinary")) {
            Page<Object[]> objects=memberRepository.searchDisciplinary(name,pageRequest);
            member = objects.getContent();
        }

        log.info(filter + " , " + member);
        for (Object[] objects : member) {
            String roleName = objects[5] instanceof Role ? ((Role) objects[5]).name() : null;
            MemberDetailDTO memberDetailDTO = MemberDetailDTO.builder()
                    .mno((Long) objects[0])
                    .name((String) objects[1])
                    .email((String) objects[2])
                    .phone((String) objects[3])
                    .regDate((LocalDateTime) objects[4])
                    .role(roleName)
                    .expDate((LocalDateTime) objects[6])
                    .build();
            memberDetailDTOS.add(memberDetailDTO);
        }
        return memberDetailDTOS;
    }
}
