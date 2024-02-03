package com.dot.tour_info_service_server.service.reply;

import com.dot.tour_info_service_server.dto.ReplyListDTO;
import com.dot.tour_info_service_server.dto.ReplyMemberDTO;
import com.dot.tour_info_service_server.dto.request.reply.ReplyDeleteRequestDTO;
import com.dot.tour_info_service_server.dto.request.reply.ReplyRequestDTO;
import com.dot.tour_info_service_server.dto.request.reply.ReplyUpdateRequestDTO;
import com.dot.tour_info_service_server.entity.Member;
import com.dot.tour_info_service_server.entity.Reply;
import com.dot.tour_info_service_server.repository.ReplyRepository;
import com.dot.tour_info_service_server.security.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReplyServiceImpl implements ReplyService {
  private final ReplyRepository replyRepository;

//  @Override
//  public List<ReplyDTO> getListOfReplyByBoard(Long bno) {
//    Board board = Board.builder().bno(bno).build();
//    List<Reply> result = replyRepository.getRepliesByBoardOrderByRnoAsc(board);
//    return result.stream().map(reply -> entityToDto(reply)).collect(Collectors.toList());
//  }


  //부모 댓글 조회
  @Override
  public List<ReplyMemberDTO> parentReply(Long bno) {
    List<Object[]> result=replyRepository.getParentReply(bno);
    List<ReplyMemberDTO> replyMemberDTOS=new ArrayList<>();
    for(Object[] object:result){
      ReplyMemberDTO replyMemberDTO=ReplyMemberDTO.builder()
              .rno((Long)object[0])
              .text((String)object[1])
              .parent_rno((Long)object[2])
              .regDate((LocalDateTime) object[3])
              .mno((Long)object[4])
              .name((String)object[5])
              .src((String)object[6])
              .build();
      replyMemberDTOS.add(replyMemberDTO);
    }
    return replyMemberDTOS;
  }

  //자식 댓글 조회
  @Override
  public List<ReplyMemberDTO> childReply(Long bno, Long rno) {
    List<Object[]> result=replyRepository.getChildReply(bno,rno);
    List<ReplyMemberDTO> replyMemberDTOS=new ArrayList<>();
    for(Object[] object:result){
      ReplyMemberDTO replyMemberDTO=ReplyMemberDTO.builder()
              .rno((Long)object[0])
              .text((String)object[1])
              .parent_rno((Long)object[2])
              .regDate((LocalDateTime) object[3])
              .mno((Long)object[4])
              .name((String)object[5])
              .src((String)object[6])
              .build();
      replyMemberDTOS.add(replyMemberDTO);
    }
    return replyMemberDTOS;
  }


  @Override
  public List<ReplyRequestDTO> getListOfReplyByMember(Long mno) {
    Member member = Member.builder().mno(mno).build();
    List<Reply> result = replyRepository.getRepliesByMemberOrderByRegDate(member);
    return result.stream().map(reply -> entityToDto(reply)).collect(Collectors.toList());
  }

  @Override
  public List<ReplyListDTO> showReplyList(Long mno) {
    List<Object[]> result = replyRepository.showReplyList(mno);
    List<ReplyListDTO> replyList = new ArrayList<>();

    if(!result.isEmpty()){
      for(Object[] list : result){
        ReplyListDTO replyListDTO = ReplyListDTO.builder()
                .rno((Long)list[0])
                .mno((Long)list[1])
                .bno((Long)list[2])
                .title((String)list[3])
                .text((String)list[4])
                .regdate((LocalDateTime)list[5])
                .isCourse((boolean)list[6])
                .build();
        replyList.add(replyListDTO);
      }
      return replyList;
    }
    return null;
  }

  @Override
  public void saveReply(ReplyRequestDTO replyRequestDTO){
    Reply reply = dtoToEntity(replyRequestDTO);
    replyRepository.save(reply);
  }

  @Override
  public void modify(ReplyUpdateRequestDTO replyUpdateRequestDTO) {
    Optional<Reply> result = replyRepository.findById(replyUpdateRequestDTO.getRno());
    if (result.isPresent()) {
      Reply reply = result.get();
      if (!SecurityUtil.validateMno(reply.getMember().getMno())){
        log.error("modify reply_mno not matched");
        throw new RuntimeException("자신의 댓글만 수정 가능합니다");
      }
      reply.changeText(replyUpdateRequestDTO.getText());
      replyRepository.save(reply);
    }
  }

  @Override
  public void delete(ReplyDeleteRequestDTO replyDeleteRequestDTO) {
    Optional<Reply> result = replyRepository.findById(replyDeleteRequestDTO.getRno());
    if (result.isPresent()) {
      Reply reply = result.get();
      if (!SecurityUtil.validateMno(reply.getMember().getMno())){
        log.error("delete reply_mno not matched");
        throw new RuntimeException("자신의 댓글만 삭제 가능합니다");
      }
      reply.changeText("삭제된 댓글입니다");
      reply.changeMember(null);
      replyRepository.save(reply);
    }
  }
}
