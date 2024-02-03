package com.dot.tour_info_service_server.repository;

import com.dot.tour_info_service_server.entity.follow.Follow;
import com.dot.tour_info_service_server.entity.follow.FollowPK;
import com.dot.tour_info_service_server.entity.Member;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, FollowPK> {

  //조회대상회원-> followerMno  팔로워->memberMno
  @Query("select f.followPk.follower.mno,f.followPk.follower.name, m.image from Follow f " +
          "left outer join Member m on m.mno = f.followPk.follower.mno " +
          "where f.followPk.member = :member")
  List<Object[]> getFollowersByMember(@Param("member") Member follower);

  //조회대상회원 -> memberMno 팔로잉->followerMno
  @Query("select f.followPk.member.mno,f.followPk.member.name, m.image from Follow f " +
          "left outer join Member m on m.mno = f.followPk.member.mno " +
          "where f.followPk.follower =:follower")
  List<Object[]> getMembersByFollower(@Param("follower") Member member);

  @Modifying
  @Query("DELETE FROM Follow f WHERE f.followPk.member = :member AND f.followPk.follower = :follower")
  void deleteByMemberAndFollower(@Param("member") Member member, @Param("follower") Member follower);

  @Modifying
  @Transactional
  @Query("delete from Follow f where f.followPk.member.mno = :mno or f.followPk.follower.mno = :mno")
  void deleteFollowByMno(Long mno);

}