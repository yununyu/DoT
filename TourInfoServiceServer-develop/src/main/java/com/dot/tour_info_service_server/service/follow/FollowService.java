package com.dot.tour_info_service_server.service.follow;


import com.dot.tour_info_service_server.dto.FollowResponseDTO;
import com.dot.tour_info_service_server.dto.request.follow.FollowRequestDTO;
import com.dot.tour_info_service_server.entity.follow.Follow;
import com.dot.tour_info_service_server.entity.follow.FollowPK;
import com.dot.tour_info_service_server.entity.Member;

import java.util.List;

public interface FollowService {
  List<FollowResponseDTO> getListOfFollower(Long mno);

  List<FollowResponseDTO> getListOfFollowing(Long mno);

  void follow(FollowRequestDTO followDTO);

  void unFollow(Long mno,Long follower);


  default Follow dtoToEntity(FollowRequestDTO followRequestDTO) {
    Follow follow = Follow.builder().
        followPk(FollowPK.builder()
            .member(Member.builder().mno(followRequestDTO.getMemberMno()).build())
            .follower(Member.builder().mno(followRequestDTO.getFollowerMno()).build())
            .build())
        .build();
    return follow;
  }

}
