package com.dot.tour_info_service_server.repository;

import com.dot.tour_info_service_server.entity.Board;
import com.dot.tour_info_service_server.entity.boardLike.BoardLike;
import com.dot.tour_info_service_server.entity.boardLike.BoardLikePK;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface BoardLikeRepository extends JpaRepository<BoardLike, BoardLikePK> {


//    @Query("delete from Image i where i.board.bno in (select bp.boardPlacePK.board.bno from BoardPlace bp where bp.boardPlacePK.place.pno = :pno )")


    @Modifying
    @Transactional
    @Query("delete from BoardLike bl where bl.boardLikePK.board.bno in (select bp.boardPlacePK.board.bno from BoardPlace bp where bp.place.pno = :pno)")
    void removeBoardLike(Long pno);

    //게시글에 해당하는 좋아요 삭제
    void deleteAllByBoardLikePKBoard(Board board);

    // bno를 받을 때 해당하는 좋아요 삭제
    @Modifying
    @Transactional
    @Query("Delete from BoardLike bl where bl.boardLikePK.board.bno=:bno")
    void deleteByBno(Long bno);

    @Modifying
    @Transactional
    @Query("delete from BoardLike bl where bl.boardLikePK.member.mno = :mno")
    void removeBoardLIkeByMno(Long mno);


    // 게시글 좋아요 여부
    boolean existsByBoardLikePK(BoardLikePK boardLikePK);


}
