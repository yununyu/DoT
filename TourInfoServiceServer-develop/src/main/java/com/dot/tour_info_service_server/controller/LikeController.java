package com.dot.tour_info_service_server.controller;


import com.dot.tour_info_service_server.dto.request.like.LikeRequestDTO;
import com.dot.tour_info_service_server.security.util.SecurityUtil;
import com.dot.tour_info_service_server.service.like.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
@Log4j2
@RequiredArgsConstructor
// 전체 authenticated
@RequestMapping("like")
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/board")
    public ResponseEntity<Void> likeBoard(@RequestBody LikeRequestDTO request) throws SQLException {
        if (!SecurityUtil.validateMno(request.getMno()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        try {
            likeService.likeBoard(request.getMno(), request.getBno());
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/board")
    public ResponseEntity<Void> unLikeBoard(@RequestBody LikeRequestDTO request) throws SQLException {
        if (!SecurityUtil.validateMno(request.getMno()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        try {
            likeService.unLikeBoard(request.getMno(), request.getBno());
        } catch (SQLException e) {
            log.error(e.getMessage());
            throw e;
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
