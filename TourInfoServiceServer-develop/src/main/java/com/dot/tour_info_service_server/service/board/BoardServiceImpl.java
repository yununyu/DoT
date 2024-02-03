package com.dot.tour_info_service_server.service.board;

import com.dot.tour_info_service_server.dto.*;
import com.dot.tour_info_service_server.dto.request.board.CourseBoardRequestDTO;
import com.dot.tour_info_service_server.dto.request.board.PlaceBoardRequestDTO;
import com.dot.tour_info_service_server.entity.*;
import com.dot.tour_info_service_server.entity.boardLike.BoardLikePK;
import com.dot.tour_info_service_server.entity.boardPlace.BoardPlace;
import com.dot.tour_info_service_server.entity.boardPlace.BoardPlacePK;
import com.dot.tour_info_service_server.repository.*;
import com.dot.tour_info_service_server.security.util.SecurityUtil;
import com.dot.tour_info_service_server.service.image.ImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Log4j2
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    private final ReplyRepository replyRepository;

    private final ImageRepository imageRepository;

    private final ImageService imageService;

    private final ReportRepository reportRepository;

    private final BoardPlaceRepository boardPlaceRepository;

    private final BoardLikeRepository boardLikeRepository;

    private final PlaceRepository placeRepository;

    @Override
    @Transactional
    public Long placeRegister(PlaceBoardRequestDTO placeBoardRequestDTO) {
        // boardDTO to Entity
        Board board = Board.builder()
                .title(placeBoardRequestDTO.getTitle())
                .content(placeBoardRequestDTO.getContent())
                .isAd(SecurityUtil.isBusinessman())
                .isCourse(false)
                .score(placeBoardRequestDTO.getScore())
                .likes(0)
                .writer(Member.builder().mno(SecurityUtil.getCurrentMemberMno()).build())
                .build();
        try {
            board = boardRepository.save(board);
            log.info("board 저장");
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error(e.getMessage());
            throw new RuntimeException("board 저장 불가");
        }

        // board - place fk 연결
        BoardPlace boardPlace = BoardPlace.builder()
                .boardPlacePK(BoardPlacePK.builder()
                        .day(0)
                        .orderNumber(0)
                        .board(Board.builder()
                                .bno(board.getBno())
                                .build())
                        .build())
                .place(Place.builder()
                        .pno(placeBoardRequestDTO.getPlace())
                        .build())
                .build();
        try {
            boardPlaceRepository.save(boardPlace);
            log.info("board-place 저장");
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error(e.getMessage());
            throw new RuntimeException("board-place 저장 불가");
        }

        // 미사용 image 삭제
        for (String src : placeBoardRequestDTO.getDeleteImages()) {
            imageService.deleteImage(src);
        }

        // image - board 연결
        for (Long ino : placeBoardRequestDTO.getImages()) {
            imageService.linkBoard(ino, board);
        }

        return board.getBno();
    }

    @Override
    @Transactional
    public Long courseRegister(CourseBoardRequestDTO courseBoardRequestDTO) {
        // boardDTO to entity
        Board board = Board.builder()
                .title(courseBoardRequestDTO.getTitle())
                .content(courseBoardRequestDTO.getContent())
                .isAd(SecurityUtil.isBusinessman())
                .isCourse(true)
                .score(courseBoardRequestDTO.getScore())
                .likes(0)
                .writer(Member.builder().mno(SecurityUtil.getCurrentMemberMno()).build())
                .build();
        try {
            board = boardRepository.save(board);
            log.info("board 저장" + board);
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error(e.getMessage());
            throw new RuntimeException("board 저장 불가");
        }

        // course place list  처리
        List<List<Long>> coursePlaceList = courseBoardRequestDTO.getCoursePlaceList();
        for (int i = 0; i < coursePlaceList.size(); i++) {
            List<Long> dailyPlace = coursePlaceList.get(i);
            for (int j = 0; j < dailyPlace.size(); j++) {
                BoardPlace boardPlace = BoardPlace.builder()
                        .boardPlacePK(BoardPlacePK.builder()
                                .day(i)
                                .orderNumber(j)
                                .board(Board.builder().bno(board.getBno()).build())
                                .build())
                        .place(Place.builder()
                                .pno(dailyPlace.get(j))
                                .build())
                        .build();
                try {
                    boardPlaceRepository.save(boardPlace);
                } catch (Exception e) {
                    e.fillInStackTrace();
                    log.error(e.getMessage());
                    throw new RuntimeException("board-place 저장 불가");
                }
            }
        }

        // 미사용 image 삭제
        for (String src : courseBoardRequestDTO.getDeleteImages()) {
            imageService.deleteImage(src);
        }

        // image - board 연결
        for (Long ino : courseBoardRequestDTO.getImages()) {
            imageService.linkBoard(ino, board);
        }

        return board.getBno();
    }

    @Transactional
    @Override
    public Long remove(Long bno) {
        replyRepository.deleteByChildRno(bno);
        replyRepository.deleteByBno(bno);
        imageRepository.deleteByBno(bno);
        boardLikeRepository.deleteByBno(bno);
        boardPlaceRepository.deleteByBno(bno);
        reportRepository.updateReportByBoardBno(bno); //null값으로 셋팅
        Board board = boardRepository.findById(bno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글 id."));
        boardRepository.deleteById(bno);
        return board.getBno();
    }


    @Override
    @Transactional
    public Long placeBoardModify(PlaceBoardRequestDTO placeBoardRequestDTO) {
        Optional<Board> result = boardRepository.findBoardByBnoAndIsCourseIsFalse(placeBoardRequestDTO.getBno());

        // 게시글 존재 여부
        if (result.isEmpty()) {
            throw new RuntimeException("존재하지 않는 게시글");
        }
        Board board = result.get();

        // 작성자 일치 여부
        if (!Objects.equals(board.getWriter().getMno(), placeBoardRequestDTO.getWriter())) {
            throw new RuntimeException("Bad Request");
        }

        // dto to entity
        board.changeTitle(placeBoardRequestDTO.getTitle());
        board.changeContent(placeBoardRequestDTO.getContent());
        board.changeScore(placeBoardRequestDTO.getScore());

        try {
            boardRepository.save(board);
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error("Board 수정 불가");
            throw new RuntimeException("Board 수정 불가");
        }

        //board - place builder
        BoardPlacePK boardPlacePK = BoardPlacePK.builder()
                .day(0)
                .orderNumber(0)
                .board(board)
                .build();

        // 기존의 board - place 일치 여부 조회
        if (!boardPlaceRepository.existsByBoardPlacePK(boardPlacePK)) {
            BoardPlace boardPlace = BoardPlace.builder()
                    .boardPlacePK(boardPlacePK)
                    .place(Place.builder()
                            .pno(placeBoardRequestDTO.getPlace())
                            .build())
                    .build();

            try {
                // board - place 수정
                boardPlaceRepository.deleteAllByBoardPlacePKBoard(board);
                boardPlaceRepository.save(boardPlace);
                log.info("board-place 저장");
            } catch (Exception e) {
                e.fillInStackTrace();
                log.error(e.getMessage());
                throw new RuntimeException("board-place 저장 불가");
            }
        }


        // 미사용 image 삭제
        for (String src : placeBoardRequestDTO.getDeleteImages()) {
            imageService.deleteImage(src);
        }

        // image - board 연결
        for (Long ino : placeBoardRequestDTO.getImages()) {
            imageService.linkBoard(ino, board);
        }

        return board.getBno();
    }

    @Transactional
    @Override
    public Long modifyCourse(CourseBoardRequestDTO courseBoardRequestDTO) throws IllegalAccessException, SQLException {
        Optional<Board> result = boardRepository.findBoardByBnoAndIsCourseIsTrue(courseBoardRequestDTO.getBno());

        if (result.isEmpty()) {
            throw new IllegalArgumentException("없는 게시글입니다.");
        }

        Board board = result.get();
        // 작성자 일치 여부
        if (!Objects.equals(board.getWriter().getMno(), courseBoardRequestDTO.getWriter())) {
            throw new RuntimeException("Bad Request");
        }

        // dto to entity
        board.changeTitle(courseBoardRequestDTO.getTitle());
        board.changeContent(courseBoardRequestDTO.getContent());
        board.changeScore(courseBoardRequestDTO.getScore());

        try {
            boardRepository.save(board);
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error("Board 수정 불가");
            throw new RuntimeException("Board 수정 불가");
        }

        // course place list  처리
        try {
            // board - place 삭제
            boardPlaceRepository.deleteAllByBoardPlacePKBoard(board);

            // 전체 일정
            List<List<Long>> coursePlaceList = courseBoardRequestDTO.getCoursePlaceList();
            for (int i = 0; i < coursePlaceList.size(); i++) {
                // 일자별 일정
                List<Long> dailyPlace = coursePlaceList.get(i);
                for (int j = 0; j < dailyPlace.size(); j++) {
                    BoardPlace boardPlace = BoardPlace.builder()
                            .boardPlacePK(BoardPlacePK.builder()
                                    .day(i)
                                    .orderNumber(j)
                                    .board(Board.builder().bno(board.getBno()).build())
                                    .build())
                            .place(Place.builder()
                                    .pno(dailyPlace.get(j))
                                    .build())
                            .build();

                    boardPlaceRepository.save(boardPlace);
                }
            }
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error(e.getMessage());
            throw new RuntimeException("board-place 수정 불가");
        }

        // 미사용 image 삭제
        for (String src : courseBoardRequestDTO.getDeleteImages()) {
            imageService.deleteImage(src);
        }

        // image - board 연결
        for (Long ino : courseBoardRequestDTO.getImages()) {
            imageService.linkBoard(ino, board);
        }

        return board.getBno();
    }

    //장소 포스팅 정보 조회
    @Override
    @Transactional
    public BoardInfoDTO getBoardByBno(Long bno) throws IllegalAccessException, SQLException {
        Board result = boardRepository.getPlaceBoardByBno(bno);
        List<Object[]> images = imageRepository.getImageByBno(bno);
        List<Object[]> placeList = boardPlaceRepository.loadListByBno(bno);

        if (result == null) {
            throw new IllegalArgumentException("없는 게시글입니다.");
        }

        boolean isLiked;
        if (!SecurityUtil.existAuthentiaction() || SecurityUtil.getCurrentMemberMno() == null) {
            isLiked = false;
        } else {
            isLiked = boardLikeRepository.existsByBoardLikePK(BoardLikePK.builder()
                    .board(Board.builder().bno(bno).build())
                    .member(Member.builder().mno(SecurityUtil.getCurrentMemberMno()).build())
                    .build());
        }


        List<List<PostingPlaceBoardDTO>> placeDTOS = new ArrayList<>();
        if (!placeList.isEmpty()) {
            placeDTOS.add(new ArrayList<>());
            int cnt = 0;
            for (Object[] tuple : placeList) {
                if (cnt != (Integer) tuple[0]) {
                    placeDTOS.add(new ArrayList<>());
                    cnt++;
                }
                List<Object[]> placeImage =
                        boardPlaceRepository.loadRepresentPlaceImageByPno((Long) tuple[2]);
                PostingPlaceBoardDTO postingPlaceBoardDTO = PostingPlaceBoardDTO.builder()
                        .pno((Long) tuple[2])
                        .name((String) tuple[3])
                        .lat((Double) tuple[4])
                        .lng((Double) tuple[5])
                        .roadAddress((String) tuple[6])
                        .localAddress((String) tuple[7])
                        .engAddress((String) tuple[8])
                        .build();

                if (placeImage != null && !placeImage.isEmpty()) {
                    Object[] imageArray = placeImage.get(0);
                    if (imageArray != null && imageArray.length > 0) {
                        postingPlaceBoardDTO.setSrc((String) imageArray[0]);
                    } else {
                        // 이미지 배열이 null 또는 비어 있는 경우
                        postingPlaceBoardDTO.setSrc(null);
                    }
                } else {
                    // 이미지 정보가 없는 경우
                    postingPlaceBoardDTO.setSrc(null);
                }
                placeDTOS.get((Integer) tuple[0]).add(postingPlaceBoardDTO);
            }
        }

        List<String> imageUrls = new ArrayList<>();
        for (Object[] image : images) {
            String src = (String) image[0];
            imageUrls.add(src);
        }

        BoardInfoDTO boardInfoDTO = BoardInfoDTO.builder()
                .title( result.getTitle())
                .content(result.getContent())
                .isCourse( result.getIsCourse())
                .regdate( result.getRegDate())
                .isAd( result.getIsAd())
                .likes(result.getLikes())
                .score( result.getScore())
                .moddate( result.getModDate())
                .isLiked(isLiked)
                .images(imageUrls.toArray(new String[0]))
                .postingPlaceBoardDTOS(placeDTOS)
                .build();

        if (result.getWriter() != null) {
            boardInfoDTO.setWriterDTO(WriterDTO.builder()
                    .mno(result.getWriter().getMno())
                    .name(result.getWriter().getName())
                    .build());
        } else {
            boardInfoDTO.setWriterDTO(WriterDTO.builder()
                    .mno(null)
                    .name(null)
                    .build());
        }
        return boardInfoDTO;
    }

    //코스 포스팅 정보 조회
    @Override
    public BoardInfoDTO getCourseByBno(Long bno) throws IllegalAccessException, SQLException {
        Board result = boardRepository.getCourseBoardByBno(bno);
        List<Object[]> images = imageRepository.getImageByBno(bno);
        List<Object[]> placeList = boardPlaceRepository.loadListByBno(bno);

        if (result == null) {
            throw new IllegalArgumentException("없는 게시글입니다.");
        }

        boolean isLiked;
        if (!SecurityUtil.existAuthentiaction() || SecurityUtil.getCurrentMemberMno() == null) {
            isLiked = false;
        } else {
            isLiked = boardLikeRepository.existsByBoardLikePK(BoardLikePK.builder()
                    .board(Board.builder().bno(bno).build())
                    .member(Member.builder().mno(SecurityUtil.getCurrentMemberMno()).build())
                    .build());
        }


        List<List<PostingPlaceBoardDTO>> placeDTOS = new ArrayList<>();
        if (!placeList.isEmpty()) {
            placeDTOS.add(new ArrayList<>());
            int cnt = 0;
            for (Object[] tuple : placeList) {
                if (cnt != (Integer) tuple[0]) {
                    placeDTOS.add(new ArrayList<>());
                    cnt++;
                }
                List<Object[]> placeImage =
                        boardPlaceRepository.loadRepresentPlaceImageByPno((Long) tuple[2]);
                PostingPlaceBoardDTO postingPlaceBoardDTO = PostingPlaceBoardDTO.builder()
                        .pno((Long) tuple[2])
                        .name((String) tuple[3])
                        .lat((Double) tuple[4])
                        .lng((Double) tuple[5])
                        .roadAddress((String) tuple[6])
                        .localAddress((String) tuple[7])
                        .engAddress((String) tuple[8])
                        .build();

                if (placeImage != null && !placeImage.isEmpty()) {
                    Object[] imageArray = placeImage.get(0);
                    if (imageArray != null && imageArray.length > 0) {
                        postingPlaceBoardDTO.setSrc((String) imageArray[0]);
                    } else {
                        // 이미지 배열이 null 또는 비어 있는 경우
                        postingPlaceBoardDTO.setSrc(null);
                    }
                } else {
                    // 이미지 정보가 없는 경우
                    postingPlaceBoardDTO.setSrc(null);
                }
                placeDTOS.get((Integer) tuple[0]).add(postingPlaceBoardDTO);
            }
        }

        List<String> imageUrls = new ArrayList<>();
        for (Object[] image : images) {
            String src = (String) image[0];
            imageUrls.add(src);
        }

        BoardInfoDTO boardInfoDTO = BoardInfoDTO.builder()
                .title( result.getTitle())
                .content(result.getContent())
                .isCourse( result.getIsCourse())
                .regdate( result.getRegDate())
                .isAd( result.getIsAd())
                .likes(result.getLikes())
                .score( result.getScore())
                .moddate( result.getModDate())
                .isLiked(isLiked)
                .images(imageUrls.toArray(new String[0]))
                .postingPlaceBoardDTOS(placeDTOS)
                .build();

        if (result.getWriter() != null) {
            boardInfoDTO.setWriterDTO(WriterDTO.builder()
                    .mno(result.getWriter().getMno())
                    .name(result.getWriter().getName())
                    .build());
        } else {
            boardInfoDTO.setWriterDTO(WriterDTO.builder()
                    .mno(null)
                    .name(null)
                    .build());
        }
        return boardInfoDTO;
    }


    // 회원별 장소 포스팅 정보 조회
    @Override
    public List<BoardMemberDTO> getBoardByMno(Long mno) {
        List<Object[]> result = boardRepository.getBoardByMno(mno);
        List<BoardMemberDTO> boardMemberDTOS = new ArrayList<>();
        if (result.isEmpty()) {
            return null;
        }
        for (Object[] object : result) {
            BoardMemberDTO boardMemberDTO = BoardMemberDTO.builder()
                    .bno((Long) object[0])
                    .title((String) object[1])
                    .replyCount((Long) object[2])
                    .regdate((LocalDateTime) object[3])
                    .src((String) object[4])
                    .likes((Integer) object[5])
                    .score((Double) object[6])
                    .writer((String) object[7])
                    .build();
            boardMemberDTOS.add(boardMemberDTO);
        }
        return boardMemberDTOS;
    }

    //장소별 장소 포스팅 조회
    @Override
    public List<BoardPlaceReplyCountDTO> getBoardByPno(Long pno, int page, Boolean isAd) throws IllegalAccessException, SQLException {
        PageRequest pageRequest = PageRequest.of(page, 10);
        Page<Object[]> pages = boardRepository.getBoardByPno(pno,pageRequest, isAd);
        List<Object[]> result = pages.getContent();
        List<BoardPlaceReplyCountDTO> boardPlaceReplyCountDTOS = new ArrayList<>();

        if (result.isEmpty()) {
            return null;
        }

        for (Object[] objects : result) {
            // bno을 보내주면 image 배열을 받아오는 작업
            Long bno = (Long) objects[1];
            List<String> imageUrls = new ArrayList<>();
            if(bno!=null) {
                List<Object[]> images = imageRepository.getImageByBno(bno);
                for (Object[] image : images) {
                    String src = (String) image[0];
                    imageUrls.add(src);
                }
            }
                BoardPlaceReplyCountDTO boardPlaceReplyCountDTO = BoardPlaceReplyCountDTO.builder()
                        .pno((Long) objects[0])
                        .bno((Long) objects[1])
                        .src(bno!=null? imageUrls.toArray(new String[0]):null)
                        .title((String) objects[2])
                        .replyCount((Long) objects[3])
                        .writer((String) objects[4])
                        .regdate((LocalDateTime) objects[5])
                        .likes((Integer) objects[6])
                        .score((Double) objects[7])
                        .isAd((Boolean) objects[8])
                        .lat((Double) objects[9])
                        .lng((Double) objects[10])
                        .engAddress((String) objects[11])
                        .localAddress((String) objects[12])
                        .roadAddress((String) objects[13])
                        .name((String) objects[14])
                        .build();
                boardPlaceReplyCountDTOS.add(boardPlaceReplyCountDTO);


        }
        return boardPlaceReplyCountDTOS;
    }

    @Override
    public List<BoardMemberDTO> getCourseBoardByMno(Long mno) {
        List<Object[]> result = boardRepository.getCourseBoardByMno(mno);
        List<BoardMemberDTO> boardMemberDTOS = new ArrayList<>();
        if (result.isEmpty()) {
            return null;
        }
        for (Object[] object : result) {
            BoardMemberDTO boardMemberDTO = BoardMemberDTO.builder()
                    .bno((Long) object[0])
                    .title((String) object[1])
                    .replyCount((Long) object[2])
                    .regdate((LocalDateTime) object[3])
                    .src((String) object[4])
                    .likes((Integer) object[5])
                    .score((Double) object[6])
                    .writer((String) object[7])
                    .build();
            boardMemberDTOS.add(boardMemberDTO);
        }
        return boardMemberDTOS;
    }

    @Override
    public List<BoardSearchDTO> findCourseBoard(String search, int page, Boolean isAd) {
        PageRequest pageRequest = PageRequest.of(page, 10);
        Page<Object[]> pages = boardRepository.findCourseBoard(search, pageRequest, isAd);
        List<Object[]> result = pages.getContent();

        List<BoardSearchDTO> boardSearchDTOS = new ArrayList<>();
        if (result.isEmpty()) {
            return null;
        }
        for (Object[] objects : result) {
            // bno을 보내주면 image 배열을 받아오는 작업
            Long bno = (Long) objects[0];
            List<Object[]> images = imageRepository.getImageByBno(bno);
            List<String> imageUrls = new ArrayList<>();
            for (Object[] image : images) {
                String src = (String) image[0];
                imageUrls.add(src);
            }

            BoardSearchDTO boardSearchDTO = BoardSearchDTO.builder()
                    .bno((Long) objects[0])
                    .title((String) objects[1])
                    .likes((Integer) objects[2])
                    .score((Double) objects[3])
                    .writer((String) objects[4])
                    .regDate((LocalDateTime) objects[5])
                    .isAd((Boolean) objects[6])
                    .srcList(imageUrls.toArray(new String[0]))
                    .build();
            boardSearchDTOS.add(boardSearchDTO);
        }
        return boardSearchDTOS;
    }

    // 메인 조회
    @Override
    public MainResponseDTO mainBoard(Long mno) {
        //가장 게시글 많은 장소
        List<Object[]> result = placeRepository.mostLikePlace();
        List<MainPlaceResponseDTO> mainPlaceResponseDTOS = new ArrayList<>();
        for (Object[] objects : result) {
            MainPlaceResponseDTO mainPlaceResponseDTO = MainPlaceResponseDTO.builder()
                    .pno((Long) objects[0])
                    .name((String) objects[1])
                    .src((String) objects[2])
                    .cart((int) objects[3])
                    .board_count((Long)objects[4])
                    .category((Category) objects[5])
                    .build();
            mainPlaceResponseDTOS.add(mainPlaceResponseDTO);
        }

        //최근 게시글
        List<Object[]> result1 = boardRepository.recentlyBoard();
        List<MainBoardResponseDTO> mainBoardResponseDTOS = new ArrayList<>();
        for (Object[] objects : result1) {
            MainBoardResponseDTO mainBoardResponseDTO = MainBoardResponseDTO.builder()
                    .bno((Long) objects[0])
                    .title((String) objects[1])
                    .src((String) objects[2])
                    .isCourse((Boolean) objects[3])
                    .name((String)objects[4])
                    .likes((int)objects[5])
                    .score((Double)objects[6])
                    .regDate((LocalDateTime) objects[7])
                    .build();
            mainBoardResponseDTOS.add(mainBoardResponseDTO);
        }

        //가장 좋아요 많은 코스 게시글
        List<Object[]> result2 = boardRepository.mostLikeCourse();
        List<MostListCourseDTO> mostListCourseDTOS = new ArrayList<>();
        for (Object[] objects : result2) {
            MainBoardResponseDTO mainBoardResponseDTO = MainBoardResponseDTO.builder()
                    .bno((Long) objects[0])
                    .title((String) objects[1])
                    .src((String) objects[2])
                    .isCourse((Boolean) objects[3])
                    .name((String)objects[4])
                    .likes((int)objects[5])
                    .score((Double) objects[6])
                    .regDate((LocalDateTime) objects[7])
                    .build();

            List<Place> places=boardRepository.mostLikeCoursePlace((Long)objects[0]);
            List<MainPlaceDTO> mainPlaceDTOS=new ArrayList<>();
            for (Place place:places){
                MainPlaceDTO mainPlaceDTO=MainPlaceDTO.builder()
                        .name(place.getName())
                        .lat(place.getLat())
                        .lng(place.getLng())
                        .roadAddress(place.getRoadAddress())
                        .engAddress(place.getEngAddress())
                        .localAddress(place.getLocalAddress())
                        .build();
                mainPlaceDTOS.add(mainPlaceDTO);
            }

            MostListCourseDTO mostListCourseDTO=MostListCourseDTO.builder()
                    .mainBoardResponseDTO(mainBoardResponseDTO)
                    .placeList(mainPlaceDTOS)
                    .build();
            mostListCourseDTOS.add(mostListCourseDTO);
        }

        //팔로워 게시글
        List<Object[]> result3 = boardRepository.followerBoard(mno);
        List<MainBoardResponseDTO> mainBoardResponseDTOS2 = new ArrayList<>();
        for (Object[] objects : result3) {
            MainBoardResponseDTO mainBoardResponseDTO = MainBoardResponseDTO.builder()
                    .bno((Long) objects[0])
                    .title((String) objects[1])
                    .src((String) objects[2])
                    .isCourse((Boolean) objects[3])
                    .name((String)objects[4])
                    .likes((int)objects[5])
                    .score((Double)objects[6])
                    .regDate((LocalDateTime) objects[7])
                    .build();
            mainBoardResponseDTOS2.add(mainBoardResponseDTO);
        }

        //광고
        List<Object[]> result4 = boardRepository.adBoard();
        List<MainBoardResponseDTO> mainBoardResponseDTOS3 = new ArrayList<>();
        for (Object[] objects : result4) {
            MainBoardResponseDTO mainBoardResponseDTO = MainBoardResponseDTO.builder()
                    .bno((Long) objects[0])
                    .title((String) objects[1])
                    .src((String) objects[2])
                    .isCourse((Boolean) objects[3])
                    .name((String)objects[4])
                    .likes((int)objects[5])
                    .score((Double)objects[6])
                    .regDate((LocalDateTime) objects[7])
                    .build();
            mainBoardResponseDTOS3.add(mainBoardResponseDTO);
        }

        MainResponseDTO mainResponseDTO = new MainResponseDTO(mainPlaceResponseDTOS, mainBoardResponseDTOS, mostListCourseDTOS, mainBoardResponseDTOS2, mainBoardResponseDTOS3);

        System.out.println(mainResponseDTO);

        return mainResponseDTO;
    }

}
