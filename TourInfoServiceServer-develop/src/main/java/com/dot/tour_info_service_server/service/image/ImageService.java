package com.dot.tour_info_service_server.service.image;

import com.dot.tour_info_service_server.dto.FileDTO;
import com.dot.tour_info_service_server.dto.ResponseUploadDTO;
import com.dot.tour_info_service_server.entity.Board;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    ResponseUploadDTO ImageUpload(String saveName);
    void deleteImage(String fileName);
    List<FileDTO> uploadFile(List<MultipartFile> multipartFiles);

    // image ino board bno 연결
    void linkBoard(Long ino, Board board);

    Object deleteFile(String fileName);
}
