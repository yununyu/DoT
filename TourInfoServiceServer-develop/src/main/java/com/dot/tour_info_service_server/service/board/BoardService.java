package com.dot.tour_info_service_server.service.board;

import com.dot.tour_info_service_server.dto.*;
import com.dot.tour_info_service_server.dto.request.board.CourseBoardRequestDTO;
import com.dot.tour_info_service_server.dto.request.board.PlaceBoardRequestDTO;

import java.sql.SQLException;
import java.util.List;

public interface BoardService {

    // 장소 등록
    Long placeRegister(PlaceBoardRequestDTO placeBoardRequestDTO);

    // 코스 등록
    Long courseRegister(CourseBoardRequestDTO courseBoardRequestDTO);

    // 삭제
    Long remove(Long bno);

    // 장소 수정
    Long placeBoardModify(PlaceBoardRequestDTO placeBoardRequestDTO);

    // 코스 수정
    Long modifyCourse(CourseBoardRequestDTO courseBoardRequestDTO) throws IllegalAccessException, SQLException;

    // 장소 포스팅 정보 조회
    BoardInfoDTO getBoardByBno(Long bno) throws IllegalAccessException, SQLException;

    // 코스 포스팅 정보 조회
    BoardInfoDTO getCourseByBno(Long bno) throws IllegalAccessException, SQLException;

    // 메인 포스팅 조회
    MainResponseDTO mainBoard(Long mno);

    // 회원별 장소 포스팅 정보 조회, 실패시 null 반환
    List<BoardMemberDTO> getBoardByMno(Long mno);

    // 장소별 장소 포스팅 정보 조회
    List<BoardPlaceReplyCountDTO> getBoardByPno(Long pno, int page, Boolean isAd) throws IllegalAccessException, SQLException;

    // 회원별 코스 포스팅 정보 조회
    List<BoardMemberDTO> getCourseBoardByMno(Long mno);

    // 코스 검색 조회
    List<BoardSearchDTO> findCourseBoard(String search, int page, Boolean isAd);

}
