package com.dot.tour_info_service_server.repository;

import com.dot.tour_info_service_server.entity.Board;
import com.dot.tour_info_service_server.entity.Image;
import jakarta.transaction.Transactional;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

//    @Query("DELETE FROM Board b WHERE b.bno IN (SELECT bp.boardPlacePK.board.bno FROM BoardPlace bp WHERE bp.boardPlacePK.place.pno = :pno)")
//@Query("delete from Reply r where r.board.bno in ( select bp.boardPlacePK.board.bno from BoardPlace bp where bp.boardPlacePK.place.pno = :pno)")

    @Modifying
    @Transactional
    @Query("delete from Image i where i.board.bno in (select bp.boardPlacePK.board.bno from BoardPlace bp where bp.place.pno = :pno )")
    void removeImage(long pno);

    //게시글에 해당하는 image 삭제
    void deleteAllByBoard(Board board);

  //board 삭제시 해당하는 이미지삭제
  @Modifying
  @Query("delete from Image i where i.board.bno=:bno")
  void deleteByBno(Long bno);


  //bno 넣을때 경로만 반환
    @Transactional
    @Query("SELECT i.src FROM Image i WHERE i.board.bno=:bno")
    List<Object[]> getImageByBno(@Param("bno") Long bno);

    @Transactional
    @Modifying
    void deleteBySrc(String src);
}
