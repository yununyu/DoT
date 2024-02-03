package com.dot.tour_info_service_server.repository;

import com.dot.tour_info_service_server.entity.Board;
import com.dot.tour_info_service_server.entity.Place;
import jakarta.transaction.Transactional;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    // 게시글이 코스 게시글이면 true, 장소 게시글이면 false

    @Query("select b.isCourse from Board b where b.bno in (select bp.boardPlacePK.board.bno from BoardPlace bp where bp.place.pno = :pno)")
    Boolean boardIsCourse(Long pno);

    // pno로 작성한 게시글 bno 반환
    @Query("select b.bno from Board b where b.bno in (select bp.boardPlacePK.board.bno from BoardPlace bp where bp.place.pno = :pno)")
    List<Long> returnBnos(Long pno);

    // 게시글 삭제
    @Modifying
    @Transactional
    @Query("delete from Board b where b.bno in (select bp.boardPlacePK.board.bno from BoardPlace bp where bp.place.pno = :pno)")
    void removeBoard(Long pno);

    @Modifying
    @Transactional
    @Query("update Board b set b.writer.mno = null where b.writer.mno = :mno ")
    void setNullMno(Long mno);

    // 장소 포스팅 정보 조회 board, place, image, boardLike repository 처리
    @Query("SELECT b " +
            "from Board b " +
            "where b.bno =:bno and b.isCourse = false ")
    Board getPlaceBoardByBno(Long bno);

    // 코스 포스팅 정보 조회
    @Transactional
    @Query("SELECT b " +
            "from Board b " +
            "where b.bno =:bno and b.isCourse = true ")
    Board getCourseBoardByBno(Long bno);

    // 메인페이지
    //최근 올라온 장소 게시글 10개
    @Query("select b.bno,b.title,i.src, b.isCourse, m.name ,b.likes,b.score,b.regDate " +
            "from Board b left outer join Image i on(b.bno=i.board.bno) left outer join Member m on b.writer.mno=m.mno " +
            "where b.isCourse=false " +
            "group by b.bno " +
            "order by b.regDate desc " +
            "limit 10 ")
    List<Object[]> recentlyBoard();

    // 가장 많은 추천을 받은 코스 게시글 - 메인
    @Query("select b.bno, b.title, i.src, b.isCourse, m.name ,b.likes,b.score,b.regDate  " +
            "from Board b left outer join Image i on(b.bno=i.board.bno) left outer join Member m on b.writer.mno=m.mno " +
            "where b.isCourse=true " +
            "order by b.likes desc " +
            "limit 10")
    List<Object[]> mostLikeCourse();

    //코스에 해당하는 1일차 코스
    @Query("select p " +
            "from Place p left outer join BoardPlace bp on p.pno=bp.place.pno " +
            "where bp.boardPlacePK.day=0 and bp.boardPlacePK.board.bno=:bno")
    List<Place> mostLikeCoursePlace(Long bno);



    //팔로워들의 게시글 - 메인
    @Query("select b.bno,b.title,i.src, b.isCourse,m.name ,b.likes,b.score,b.regDate " +
            "from Board b left outer join Member m on(m.mno=b.writer.mno) " +
            "left outer join Follow f on(f.followPk.member.mno=m.mno) " +
            "left outer join Image i on(b.bno=i.board.bno) " +
            "where f.followPk.follower.mno=:mno " +
            "group by b.bno " +
            "order by b.regDate desc " +
            "limit 10")
    List<Object[]> followerBoard(Long mno);

    //광고 게시글 - 메인
    @Query("select b.bno,b.title,i.src, b.isCourse,m.name ,b.likes,b.score,b.regDate " +
            "from Board b left outer join Image i on (b.bno=i.board.bno) left outer join Member m on b.writer.mno=m.mno " +
            "where b.isAd=true " +
            "group by b.bno " +
            "order by b.regDate desc " +
            "limit 10")
    List<Object[]> adBoard();


    //   회원별 장소 포스팅 조회
    @Query("select b.bno, b.title, count(r.rno), b.regDate, i.src, b.likes, b.score, b.writer.name from Board b " +
            "left outer join Image i on b.bno = i.board.bno " +
            "left outer join Reply r on b.bno = r.board.bno " +
            "left outer join Member m on b.writer.mno = m.mno " +
            "where b.writer.mno =:mno and b.isCourse = false " +
            "group by b.bno")
    List<Object[]> getBoardByMno(@Param("mno") Long mno);

    // 장소별 장소 포스팅 조회
    @Transactional
    @Query("select p.pno, b.bno, b.title , count(r.rno), b.writer.name, b.regDate,COALESCE( b.likes,0), b.score ,b.isAd, " +
            "p.lat, p.lng, p.engAddress, p.localAddress, p.roadAddress, p.name  " +
            "from Place p " +
            "left outer join BoardPlace  bp  on  p.pno=bp.place.pno " +
            "left outer join Board b on (b.bno = bp.boardPlacePK.board.bno and b.isCourse=false and b.isAd=:isAd) " +
            "left outer join b.writer w  " +
            "left outer join Reply r on b.bno = r.board.bno " +
            "where p.pno = :pno " +
            "group by b.bno  ")
    Page<Object[]> getBoardByPno(Long pno,PageRequest pageRequest, Boolean isAd);

    // 회원별 코스 포스팅 조회
    @Query("select b.bno, b.title, count(r.rno), b.regDate, i.src, b.likes, b.score, b.writer.name from Board b " +
            "left outer join Image i on b.bno = i.board.bno " +
            "left outer join Reply r on b.bno = r.board.bno " +
            "left outer join Member m on b.writer.mno = m.mno " +
            "where b.writer.mno =:mno and b.isCourse = true " +
            "group by b.bno")
    List<Object[]> getCourseBoardByMno(@Param("mno") Long mno);

    //코스 검색 조회
    @Query("select b.bno, b.title, b.likes, b.score, b.writer.name, b.regDate, b.isAd from Board b " +
            "left outer join BoardPlace bp on b.bno = bp.boardPlacePK.board.bno " +
            "where (b.title like %:search% or  " +
            "bp.place.name like %:search% or b.writer.name like %:search%) and b.isCourse = true " +
            "and b.isAd=:isAd " +
            "group by b.bno")
    Page<Object[]> findCourseBoard(String search, PageRequest pageRequest, Boolean isAd);

    // place 검색
    Optional<Board> findBoardByBnoAndIsCourseIsFalse(Long bno);

    // course 검색
    Optional<Board> findBoardByBnoAndIsCourseIsTrue(Long bno);
}
