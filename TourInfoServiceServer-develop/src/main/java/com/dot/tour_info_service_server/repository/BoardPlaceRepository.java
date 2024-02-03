package com.dot.tour_info_service_server.repository;

import com.dot.tour_info_service_server.entity.Board;
import com.dot.tour_info_service_server.entity.boardPlace.BoardPlace;
import com.dot.tour_info_service_server.entity.boardPlace.BoardPlacePK;
import jakarta.transaction.Transactional;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardPlaceRepository extends JpaRepository<BoardPlace, BoardPlacePK> {

    // boardPlace place_pno set null
    @Modifying
    @Transactional
    @Query("Update BoardPlace bp set bp.place.pno = null where bp.place.pno = :pno")
    void updateBoardPlacePno(Long pno);

    @Modifying
    @Transactional
    @Query("delete from BoardPlace bp where bp.place.pno = :pno")
    void removeBoardPlaceByPno(Long pno);

    //게시글에 해당하는것 삭제
    void deleteAllByBoardPlacePKBoard(Board board);

    //bno를 넣을때 해당되는 데이터 삭제
    @Modifying
    @Transactional
    @Query("Delete from BoardPlace bp where bp.boardPlacePK.board.bno = :bno")
    void deleteByBno(Long bno);


   // 장소 대표이미지 조회
    @Query("select i.src " +
            "from BoardPlace bp left outer join Place p on (bp.place.pno = p.pno) " +
            "left outer join Image i on (bp.boardPlacePK.board.bno = i.board.bno) " +
            "left outer join Board b on (bp.boardPlacePK.board.bno = b.bno) " +
            "where b.isCourse = false and p.pno =:pno " +
            "group by p.pno")
    List<Object[]> loadRepresentPlaceImageByPno(@Param("pno") Long pno);

    // 코스 장소 리스트 조회
    @Query("select bp.boardPlacePK.day, bp.boardPlacePK.orderNumber, bp.place.pno , p.name, p.lat, p.lng, " +
            "p.roadAddress, p.localAddress, p.engAddress " +
            "from BoardPlace bp left join Place p on bp.place.pno = p.pno " +
            "where bp.boardPlacePK.board.bno = :bno")
    List<Object[]> loadListByBno(@Param("bno") Long bno);

    // table 존재 여부 조회
    boolean existsByBoardPlacePK(BoardPlacePK boardPlacePK);
}
