package com.dot.tour_info_service_server.repository;

import com.dot.tour_info_service_server.dto.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import com.dot.tour_info_service_server.entity.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
    Optional<Member> findById(@Param("mno") Long mno);

    @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
    Optional<Member> findByEmailAndFromSocialIsFalse(@Param("email") String email);

    @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
    Optional<Member> findByEmail(@Param("email") String email);

    //@Query("select * from Member m where m.name =:name and m.phone =:phone")
    @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
    Optional<Member> findMemberByNameAndPhone(@Param("name") String name, @Param("phone") String phone);

    // 중복 여부(true: 중복, false: 중복x)
    boolean existsByEmail(String email);

    // 회원 프로필 조회 ( mno, 이름, 팔로잉수, 팔로워수, 찜목록수, 이미지)
    @Query(value = "select m.mno as mno, m.name, count( f1.followPk.follower.mno) as followings, count( f2.followPk.member.mno) as followers, " +
            "count( c.cartPK.member.mno) as cart, m.image " +
            "from Member m left outer join Follow f1 on m.mno = f1.followPk.follower.mno  " +
            "left outer join Follow f2 on m.mno = f2.followPk.member.mno " +
            "left outer join Cart c on m.mno = c.cartPK.member.mno " +
            "where m.mno  = :mno " +
            "group by m.mno")
    List<Object[]> findProfileByMno(@Param("mno") Long mno);

    // 회원 검색 ( mno, 이미지, 이름 ,팔로워 수 , 팔로잉 수, 팔로우 여부) - 해당 부분 허가 된 사람+관리자 제외 검색 되도록 수정했습니다. + 팔로잉, 팔로워 수 추가
    @Query("select m.mno, m.image, m.name, " +
            "(SELECT COUNT(*) FROM Follow f2  LEFT OUTER JOIN Member m3 ON m3.mno=f2.followPk.member.mno WHERE m3.mno=m.mno GROUP BY m3.mno), " +
            "(SELECT COUNT(*) FROM Follow f2  LEFT OUTER JOIN Member m3 ON m3.mno=f2.followPk.follower.mno WHERE m3.mno=m.mno GROUP BY m3.mno), " +
            "exists (select m2  from Member m2 left outer join Follow f on f.followPk.member.mno=m2.mno where f.followPk.follower.mno=:mno and m2.mno=m.mno) as followCheck " +
            "from Member m join m.roleSet r " +
            "where r!='ADMIN' and  m.isApprove=true and m.name like %:name%")
    Page<Object[]> searchUser(@Param("name") String name, Long mno, PageRequest pageRequest);



    // 팔로워 수 조회 (mno로 검색)
    @Query("select count(f.followPk.member.mno) from Follow f where f.followPk.member.mno = :mno")
    Long showFollowers(Long mno);

    // 팔로워 수 조회 (이름으로 검색)
    @Query("select count(f.followPk.member.mno) from Follow f " +
            "left outer join Member m on m.mno = f.followPk.member.mno " +
            "where m.name = :name")
    Long showFollowersByName(String name);

    // 팔로잉 수 조회 (mno로 검색)
    @Query("select count(f.followPk.follower.mno) from Follow f where f.followPk.follower.mno = :mno")
    Long showFollowings(Long mno);

    // 팔로잉 수 조회 (이름으로 검색)
    @Query("select count(f.followPk.follower.mno) from Follow f " +
            "left outer join Member m on m.mno = f.followPk.follower.mno " +
            "where m.name = :name")
    Long showFollowingsByName(String name);

    // 회원정보조회
    @Query("select m.mno, m.image, m.name, m.email, m.phone, m.birth, m.roleSet, m.fromSocial from Member m where m.mno = :mno ")
    @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
    List<Object[]> userInfo(Long mno);

    // 회원가입대기 조회
    @Query("select m.mno, m.name, m.email, m.businessId from Member m where m.isApprove = false")
    Page<Object[]> showJoinWaiting(PageRequest pageRequest);

    // 회원가입 승인
    @Modifying
    @Transactional
    @Query("update Member m set m.isApprove = true where m.mno = :mno")
    void joinMember(Long mno);

    // 찜목록 수 조회
    @Query("select count(c.cartPK.member.mno) from Cart c where c.cartPK.member.mno = :mno")
    Long showCart(Long mno);

    //회원 조회 - 전체 (관리자)
    @Transactional
    @Query("select m.mno,m.name,m.email,m.phone,m.regDate,m.roleSet,d.expDate " +
            "from Member m join m.roleSet r left outer join Disciplinary d on m.mno=d.member.mno " +
            "where r!='ADMIN' and  m.isApprove=true and m.name like concat('%',:name,'%') " +
            "group by m.mno")
    Page<Object[]> searchMemberAll(String name, PageRequest pageRequest);

    // 회원 조회 - 사업자 (관리자)
    @Transactional
    @Query ("select m.mno,m.name,m.email,m.phone,m.regDate,m.roleSet,d.expDate " +
            "from Member m join m.roleSet r left outer join Disciplinary d on m.mno=d.member.mno " +
            "where r='BUSINESSPERSON' and m.isApprove=true and m.name like concat('%',:name,'%') " +
            "group by m.mno")
    Page<Object[]> searchBusiness(String name,PageRequest pageRequest);

    //회원 조회 - 일반 유저 (관리자)
    @Transactional
    @Query("select m.mno,m.name,m.email,m.phone,m.regDate,m.roleSet,d.expDate " +
            "from Member m join m.roleSet r left outer join Disciplinary d on m.mno=d.member.mno " +
            "where r='MEMBER' and m.isApprove=true and m.name like concat('%',:name,'%') " +
            "group by m.mno")
    Page<Object[]> searchNomal(String name,PageRequest pageRequest);

    //회원 조회 - 정지된 유저
    @Transactional
    @Query("select m.mno,m.name,m.email,m.phone,m.regDate,m.roleSet,d.expDate " +
            "from Member m join m.roleSet r left outer join Disciplinary d on m.mno=d.member.mno  " +
            "where r!='ADMIN' and m.isApprove=true and d.expDate>now() and m.name like %:name% " +
            "group by m.mno")
    Page<Object[]> searchDisciplinary(String name,PageRequest pageRequest);

    //회원 이미지 변경
    @Modifying
    @Transactional
    @Query("update Member m set m.image = :src where m.mno= :mno")
    void updateMemberImage(String src, Long mno);
}
