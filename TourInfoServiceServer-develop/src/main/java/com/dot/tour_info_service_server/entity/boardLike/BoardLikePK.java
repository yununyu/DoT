package com.dot.tour_info_service_server.entity.boardLike;

import com.dot.tour_info_service_server.entity.Board;
import com.dot.tour_info_service_server.entity.Member;
import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BoardLikePK implements Serializable {

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member; // 좋아요한 유저번호 - 머지 후 import 해야함

    @ManyToOne(fetch = FetchType.LAZY)
    private Board board; // 좋아요한 게시글 - 머지 후 import 해야함
}
