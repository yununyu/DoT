package com.dot.tour_info_service_server.controller;

import com.dot.tour_info_service_server.dto.ReplyListDTO;
import com.dot.tour_info_service_server.dto.ReplyMemberDTO;
import com.dot.tour_info_service_server.dto.request.reply.ReplyDeleteRequestDTO;
import com.dot.tour_info_service_server.dto.request.reply.ReplyRequestDTO;
import com.dot.tour_info_service_server.dto.request.reply.ReplyUpdateRequestDTO;
import com.dot.tour_info_service_server.security.util.SecurityUtil;
import com.dot.tour_info_service_server.service.reply.ReplyService;
import com.dot.tour_info_service_server.service.report.ReportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("reply")
@Log4j2
@RequiredArgsConstructor
@Validated
public class ReplyController {
  private final ReplyService replyService;
  private final ReportService reportService;

  // permit all
  @GetMapping("/member")
  public ResponseEntity<List<ReplyListDTO>> getListByMno(@Valid @RequestParam(value="mno") @NotNull(message = "mno cannot be null") Long mno) {
    log.info("getReplyListByMno....");
    List<ReplyListDTO> result = replyService.showReplyList(mno);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  //수정 시작 게시글 댓글 조회
  // permit all
  @GetMapping("/board")
  public ResponseEntity<List<ReplyMemberDTO>> getListByBno(@Valid @RequestParam(value="bno") @NotNull(message = "bno cannot be null") Long bno, @RequestParam(value = "rno", required = false)Long rno) {
    log.info("getReplyListByBno....");
    List<ReplyMemberDTO> result;
    //상위 댓글만 조회
    if(rno==null) {
      result = replyService.parentReply(bno);
    }
    //대댓글 조회
    else{
      result=replyService.childReply(bno,rno);
    }
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  // authenticated
  @PostMapping("/register")
  public ResponseEntity<Map<String, Long>> register(@RequestBody @Valid ReplyRequestDTO replyRequestDTO) {
    log.info("saveReply... " + replyRequestDTO);
    Map<String, Long> result = new HashMap<>();
    result.put("bno", replyRequestDTO.getBno());

    try {
      replyService.saveReply(replyRequestDTO);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (Exception e) {
      log.error(e.getMessage());
      throw e;
    }
  }

  // authenticated
  @PutMapping("/update")
  public ResponseEntity<Map<String, Long>> update(@RequestBody @Valid ReplyUpdateRequestDTO replyUpdateRequestDTO) {
    if (!SecurityUtil.validateMno(replyUpdateRequestDTO.getMno())) {
      log.error("mno not matched");
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    Map<String, Long> result = new HashMap<>();
    result.put("rno", replyUpdateRequestDTO.getRno());
    log.info("updateReply...replyDTO : " + replyUpdateRequestDTO);
    replyService.modify(replyUpdateRequestDTO);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  // authenticated
  @PutMapping("/delete")
  public ResponseEntity<Map<String, Long>> delete(@RequestBody @Valid ReplyDeleteRequestDTO replyDeleteRequestDTO) {
    if (!SecurityUtil.validateMno(replyDeleteRequestDTO.getMno())) {
      log.error("mno not matched");
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    Map<String, Long> result = new HashMap<>();
    result.put("rno", replyDeleteRequestDTO.getRno());
    log.info("deleteReply...replyDTO : " + replyDeleteRequestDTO);
    replyService.delete(replyDeleteRequestDTO);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

//todo

// authenticated
//  @PostMapping(value = "/report", produces = MediaType.APPLICATION_JSON_VALUE)
//  public ResponseEntity<ResponseWrapDTO<Long>> report(@RequestBody ReportRequestDTO reportRequestDTO) {
//    ResponseWrapDTO response = new ResponseWrapDTO(false, null);
//    Long data = reportService.report(reportRequestDTO);
//    if (data == 1l) {
//      response.setResult(true);
//      response.setData(data);
//      return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//    //만약 신고한 유저가 존재하지 않는다면 null을 전달받음
//
//    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
//  }

}
