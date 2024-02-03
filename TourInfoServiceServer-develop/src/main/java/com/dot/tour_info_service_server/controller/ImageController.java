package com.dot.tour_info_service_server.controller;


import com.dot.tour_info_service_server.dto.FileDTO;
import com.dot.tour_info_service_server.dto.request.image.ImageDeleteRequestDTO;
import com.dot.tour_info_service_server.dto.ResponseUploadDTO;
import com.dot.tour_info_service_server.service.image.ImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@Log4j2
@RequiredArgsConstructor
// 전체 authenticated
@RequestMapping("image")
public class ImageController {

    private final ImageService imageService;

    @Transactional
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseUploadDTO> imgUpload(@RequestParam("image") MultipartFile multipartFile) {
        List<MultipartFile> fileList = new ArrayList<>();
        fileList.add(multipartFile);

        List<FileDTO> fileDTOS;
        try {
            fileDTOS = imageService.uploadFile(fileList);
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error("파일 저장 오류");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }


        ResponseUploadDTO response;
        try {
            response = imageService.ImageUpload(fileDTOS.get(0).getFileUrl());
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error("DB 오류");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(value = "/delete")
    public ResponseEntity<Void> deleteImage(@RequestBody ImageDeleteRequestDTO request) {
        try {
            for (String src : request.getSrcs()) {
                imageService.deleteImage(src);
            }
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error("삭제 오류");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
