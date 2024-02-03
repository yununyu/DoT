package com.dot.tour_info_service_server.service.follow;


import com.dot.tour_info_service_server.dto.FollowResponseDTO;
import com.dot.tour_info_service_server.dto.request.follow.FollowRequestDTO;
import com.dot.tour_info_service_server.entity.follow.Follow;
import com.dot.tour_info_service_server.entity.Member;
import com.dot.tour_info_service_server.repository.FollowRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {
    private final FollowRepository followRepository;

    @Override
    public List<FollowResponseDTO> getListOfFollower(Long mno) {
        Member member = Member.builder().mno(mno).build();
        List<Object[]> result = followRepository.getFollowersByMember(member);
        List<FollowResponseDTO> followerList = new ArrayList<>();
        if (!result.isEmpty()) {
            for (Object[] list : result) {
                FollowResponseDTO followResponseDTO = FollowResponseDTO.builder()
                        .mno((Long) list[0])
                        .name((String) list[1])
                        .image((String) list[2])
                        .build();
                followerList.add(followResponseDTO);
            }
            return followerList;
        }
        return null;
    }

    @Override
    public List<FollowResponseDTO> getListOfFollowing(Long mno) {
        Member member = Member.builder().mno(mno).build();
        List<Object[]> result = followRepository.getMembersByFollower(member);
        List<FollowResponseDTO> followingList = new ArrayList<>();
        if (!result.isEmpty()) {
            for (Object[] list : result) {
                FollowResponseDTO followResponseDTO = FollowResponseDTO.builder()
                        .mno((Long) list[0])
                        .name((String) list[1])
                        .image((String) list[2])
                        .build();
                followingList.add(followResponseDTO);
            }
            return followingList;
        }
        return null;
    }

    @Override
    public void follow(FollowRequestDTO followRequestDTO) {
        Follow follow = dtoToEntity(followRequestDTO);
        followRepository.save(follow);
    }

    @Override
    @Transactional
    public void unFollow(Long mno, Long follower) {
        followRepository.deleteByMemberAndFollower(Member.builder().mno(mno).build(), Member.builder().mno(follower).build());
    }
}
