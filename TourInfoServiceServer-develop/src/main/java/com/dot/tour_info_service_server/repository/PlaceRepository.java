package com.dot.tour_info_service_server.repository;

import com.dot.tour_info_service_server.entity.Category;
import com.dot.tour_info_service_server.entity.Place;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PlaceRepository extends JpaRepository<Place, Long> {

    //게시글이 가장 많은 장소 3곳 정보
    @Transactional
    @Query("select p.pno, p.name,i.src,p.cart,count(distinct b.bno),p.category " +
            "from Place p left outer join BoardPlace bp on (bp.place.pno=p.pno) " +
            "left outer join Board b on (b.bno=bp.boardPlacePK.board.bno and b.writer.mno is not null)" +
            "left outer join Image i on(b.bno=i.board.bno) " +
            "group by p.pno " +
            "order by count(distinct b.bno) desc " +
            "limit 3")
    List<Object[]> mostLikePlace();

    // 카테고리, 검색어로 장소 검색
    @Query("select p.pno, p.name, p.lng, p.lat, p.roadAddress, p.localAddress, p.engAddress, p.category, p.cart, p.regDate, p.modDate " +
            "from Place p " +
            "where :filter is null and " +
            "(p.name like %:search% or p.localAddress like %:search% or " +
            "p.roadAddress like %:search% or p.engAddress like %:search%) " +
            "or p.category = :filter and " +
            "(p.name like %:search% or p.localAddress like %:search% or " +
            "p.roadAddress like %:search% or p.engAddress like %:search%) " +
            "group by p.pno")
    Page<Object[]> searchPlace(Category filter, String search, PageRequest pageRequest);

    // 프로시저 실행
    @Procedure("Count_pno")
    List<Object[]> getPlaceCount(Long mno);

}
