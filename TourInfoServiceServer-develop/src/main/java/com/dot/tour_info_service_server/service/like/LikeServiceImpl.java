package com.dot.tour_info_service_server.service.like;

import com.dot.tour_info_service_server.entity.Board;
import com.dot.tour_info_service_server.entity.boardLike.BoardLike;
import com.dot.tour_info_service_server.entity.boardLike.BoardLikePK;
import com.dot.tour_info_service_server.entity.Member;
import com.dot.tour_info_service_server.repository.BoardLikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.sql.SQLException;

@Service
@Log4j2
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {
    private final BoardLikeRepository boardLikeRepository;

    @Override
    public boolean likeBoard(Long mno, Long bno) throws SQLException {
        BoardLikePK boardLikePK = BoardLikePK.builder()
                .board(Board.builder()
                        .bno(bno)
                        .build())
                .member(Member.builder()
                        .mno(mno)
                        .build())
                .build();

        BoardLike boardLike = BoardLike.builder()
                .boardLikePK(boardLikePK)
                .build();

        try {
            boardLikeRepository.save(boardLike);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new SQLException("등록 불가");
        }

        return true;
    }

    @Override
    public boolean unLikeBoard(Long mno, Long bno) throws SQLException {
        BoardLikePK boardLikePK = BoardLikePK.builder()
                .board(Board.builder()
                        .bno(bno)
                        .build())
                .member(Member.builder()
                        .mno(mno)
                        .build())
                .build();

        try {
            boardLikeRepository.deleteById(boardLikePK);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new SQLException("삭제 불가");
        }

        return true;
    }
}
