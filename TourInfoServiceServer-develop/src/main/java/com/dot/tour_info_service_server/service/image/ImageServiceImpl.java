package com.dot.tour_info_service_server.service.image;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.dot.tour_info_service_server.dto.FileDTO;
import com.dot.tour_info_service_server.dto.ResponseUploadDTO;
import com.dot.tour_info_service_server.entity.Board;
import com.dot.tour_info_service_server.entity.Image;
import com.dot.tour_info_service_server.repository.ImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Log4j2
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final AmazonS3Client amazonS3Client;
    private final ImageRepository imageRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    // board image src DB upload
    @Override
    public ResponseUploadDTO ImageUpload(String saveName) {
        Image image = Image.builder()
                .src(saveName)
                .board(null)
                .build();
        image = imageRepository.save(image);
        return ResponseUploadDTO.builder()
                .ino(image.getIno())
                .src(image.getSrc())
                .build();
    }

    // image upload
    @Override
    public List<FileDTO> uploadFile(List<MultipartFile> multipartFiles) {
        List<FileDTO> files = new ArrayList<>();
        int count = 1;

        for (MultipartFile multipartFile : multipartFiles) {
            String originalFileName = multipartFile.getOriginalFilename();

            //String fileUrl = "http://" + bucket + "/upload_" + fileName;
            String renamedFileName = getRenamedFileName(originalFileName, count);
            count++;
            String fileUrl = "";

            log.info("renamedFileName = {}", renamedFileName);
            try {
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(multipartFile.getContentType());
                metadata.setContentLength(multipartFile.getSize());
                amazonS3Client.putObject(bucket, renamedFileName, multipartFile.getInputStream(), metadata);

                fileUrl = amazonS3Client.getUrl(bucket, renamedFileName).toString();
                log.info("fileUrl = {}", fileUrl);
            } catch (IOException e) {
                e.fillInStackTrace();
                log.error("file upload에 실패하였습니다.");
            }

            files.add(
                    FileDTO.builder()
                            .originalFileName(originalFileName)
                            .renamedFileName(renamedFileName)
                            .fileUrl(fileUrl)
                            .build());
        }
        return files;
    }

    // image ino board bno 연결
    @Override
    public void linkBoard(Long ino, Board board){
        Optional<Image> result = imageRepository.findById(ino);
        if(result.isEmpty()){
            log.info("image not found");
            return;
        }

        Image image = result.get();
        // 이미 연결된 image 연결 취소
        try {
            if(image.getBoard().getBno() != null)
                return;
        } catch (Exception e) {
            image.changeBoard(board);
            imageRepository.save(image);
        }
    }

    @Override
    public Object deleteFile(String fileName) {
        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, fileName);
        if (isObjectExist) {
            amazonS3Client.deleteObject(bucket, fileName);
        } else {
            return "file not found";
        }
        return "delete file";
    }

    // delete image s3 and db
    @Transactional
    public void deleteImage(String fileName) {
        String[] name = fileName.split("/");
        try {
            log.info(deleteFile(name[name.length-1]));
            imageRepository.deleteBySrc(fileName);
        } catch (Exception e) {
            e.fillInStackTrace();
            log.error(e.getMessage());
        }
    }

    private String getRenamedFileName(String originalFileName, int count) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault());
        Date date = new Date();
        String str = sdf.format(date);

        String ext = originalFileName.substring(originalFileName.indexOf(".") + 1);
        String renamedFileName = originalFileName.replaceAll(originalFileName, str) + "_"
                + String.format("%02d", count) + "." + ext;

        return renamedFileName;
    }
}
