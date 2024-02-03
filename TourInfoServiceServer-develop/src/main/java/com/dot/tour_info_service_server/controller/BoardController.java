package com.dot.tour_info_service_server.controller;

import com.dot.tour_info_service_server.dto.*;
import com.dot.tour_info_service_server.dto.request.board.CourseBoardRequestDTO;
import com.dot.tour_info_service_server.dto.request.board.MnoBoardRequestDTO;
import com.dot.tour_info_service_server.dto.request.board.PlaceBoardRequestDTO;
import com.dot.tour_info_service_server.security.util.SecurityUtil;
import com.dot.tour_info_service_server.service.board.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/board")
@Validated
public class BoardController {
    private final BoardService boardService;

    // 장소 포스팅 등록
    // authenticated
    @PostMapping(value = {"/place/posting/register"})
    public ResponseEntity<Map<String, Long>> placeRegisterPost(@RequestBody @Valid PlaceBoardRequestDTO placeBoardRequestDTO) {
        if(!SecurityUtil.validateMno(placeBoardRequestDTO.getWriter()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        Long bno = boardService.placeRegister(placeBoardRequestDTO);
        Map<String, Long> result = new HashMap<>();
        result.put("bno", bno);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 코스포스팅 등록
    // authenticated
    @PostMapping(value = {"/course/posting/register"})
    public ResponseEntity<Map<String, Long>> courseRegisterPost(@RequestBody @Valid CourseBoardRequestDTO courseBoardRequestDTO) {
        if(!SecurityUtil.validateMno(courseBoardRequestDTO.getWriter()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        Long bno = boardService.courseRegister(courseBoardRequestDTO);
        Map<String, Long> result = new HashMap<>();
        result.put("bno", bno);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 장소,코스 포스팅 삭제
    // authenticated
    @DeleteMapping(value = {"/place/posting/delete", "/course/posting/delete"})
    public ResponseEntity<Map<String, Long>> remove(@RequestParam("bno") Long bno) {
        Map<String, Long> result = new HashMap<>();
        boardService.remove(bno);
        result.put("bno", bno);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 장소 포스팅 수정
    // authenticated
    @PutMapping(value = {"/place/posting/modify"})
    public ResponseEntity<Map<String, Long>> modifyPlace(@RequestBody  @Valid PlaceBoardRequestDTO placeBoardRequestDTO) {
        Map<String, Long> result = new HashMap<>();
        if (!SecurityUtil.validateMno(placeBoardRequestDTO.getWriter())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            Long bno = boardService.placeBoardModify(placeBoardRequestDTO);
            result.put("bno", bno);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    // 코스 게시글 수정 address
    // authenticated
    @PutMapping("/course/posting/modify")
    public ResponseEntity<Map<String, Long>> modifyCourse(@RequestBody  @Valid CourseBoardRequestDTO courseBoardRequestDTO) {

        log.info("courseBoardDTO: " + courseBoardRequestDTO);
        Map<String, Long> result = new HashMap<>();
        // token 없이 controller Test시 제거할 것
//    if (!SecurityUtil.validateMno(courseBoardDTO.getWriter())) {
//      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//    }
        try {
            Long bno = boardService.modifyCourse(courseBoardRequestDTO);
            result.put("bno", bno);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }


    // 장소 포스팅 정보 조회
    // permit all
    @GetMapping(value = {"/place/posting"})
    public ResponseEntity<BoardInfoDTO> getPlaceBoard(@RequestParam("bno") Long bno) {
        log.info("getPlaceBoard... bno: " + bno);
        try {
            BoardInfoDTO boardInfoDTO = boardService.getBoardByBno(bno);
            return new ResponseEntity<>(boardInfoDTO, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    // 코스 포스팅 정보 조회
    // permit all
    @GetMapping(value = {"/course/posting"})
    public ResponseEntity<BoardInfoDTO> getCourseBoard(@RequestParam("bno") Long bno) {
        log.info("getCourseBoard... bno: " + bno);
        try {
            BoardInfoDTO boardInfoDTO = boardService.getCourseByBno(bno);
            return new ResponseEntity<>(boardInfoDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }


    // 보드 메인페이지 정보 조회
    // permit all
    @PostMapping(value = "/main")
    public ResponseEntity<ResponseWrapDTO<MainResponseDTO>> boardMain(@RequestBody(required = false) MnoBoardRequestDTO mnoBoardRequestDTO) {
        ResponseWrapDTO response;
        if(mnoBoardRequestDTO ==null){
            response=new ResponseWrapDTO(true,boardService.mainBoard(-1l));
        }else {
            response = new ResponseWrapDTO(true, boardService.mainBoard(mnoBoardRequestDTO.getMno()));
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    //   회원별 장소 포스팅 정보 조회
    // permit all
    @GetMapping(value = {"/place/posting/member"})
    public ResponseEntity<List<BoardMemberDTO>> getBoardByMno(@RequestParam("mno") Long mno) {
        log.info("getBoardByMno... bno: " + mno);
        List<BoardMemberDTO> boardMemberDTO = boardService.getBoardByMno(mno);
        return new ResponseEntity<>(boardMemberDTO, HttpStatus.OK);
    }

    // 장소별 장소 포스팅 정보 조회
    // permit all
    @GetMapping(value = {"/place"})
    public ResponseEntity<List<BoardPlaceReplyCountDTO>> getBoardByPno(@RequestParam("pno") Long pno,
                                                                       @RequestParam int page,
                                                                       @RequestParam Boolean isAd)
    {
        log.info("getBoardByMno... bno: " + pno);
        try {
            List<BoardPlaceReplyCountDTO> boardPlaceReplyCountDTO = boardService.getBoardByPno(pno, page, isAd);
            return new ResponseEntity<>(boardPlaceReplyCountDTO, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    // 회원별 코스 포스팅 정보 조회
    // permit all
    @GetMapping(value = {"/course/posting/member"})
    public ResponseEntity<List<BoardMemberDTO>> getCourseBoardByMno(@RequestParam("mno") Long mno) {
        log.info("getBoardByMno... bno: " + mno);
        List<BoardMemberDTO> boardMemberDTO = boardService.getCourseBoardByMno(mno);
        return new ResponseEntity<>(boardMemberDTO, HttpStatus.OK);
    }

    // 코스 검색 조회
    // permit all
    @GetMapping(value = {"/course"})
    public ResponseEntity<List<BoardSearchDTO>> findCourseBoard(@RequestParam("search") String search ,
                                                                @RequestParam int page, @RequestParam Boolean isAd) {
        log.info("Search.... : "+search);
        log.info("isAD: "+isAd);
        List<BoardSearchDTO> boardSearchDTO = boardService.findCourseBoard(search, page, isAd);
        return new ResponseEntity<>(boardSearchDTO, HttpStatus.OK);
    }

}
