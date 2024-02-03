package com.dot.tour_info_service_server.service.folder;

import com.dot.tour_info_service_server.dto.request.folder.FolderRegistRequestDTO;
import com.dot.tour_info_service_server.dto.request.folder.FolderAllRequestDTO;
import com.dot.tour_info_service_server.dto.response.folder.FolderItemResponseDTO;
import com.dot.tour_info_service_server.dto.response.folder.FolderNameResponseDTO;
import com.dot.tour_info_service_server.entity.Folder;
import com.dot.tour_info_service_server.entity.Member;

import java.util.List;

public interface FolderService {

    //폴더 전부 조회
    List<FolderItemResponseDTO> getAllFolder(Long mno);

    //폴더명 조회
    List<FolderNameResponseDTO> getTitle(Long mno);

    //폴더 등록
    Long register(FolderRegistRequestDTO folderRegistRequestDTO );

    //폴더명 수정 - 성공 시 폴더번호, 실패시 -1
    Long modify(FolderAllRequestDTO folderAllRequestDTO);

    //폴더 삭제 - 성공 시 폴더번호, 실패시 -1
    Long remove(Long fno);



    //Folder dtoToEntity
    default Folder dtoToEntity(FolderAllRequestDTO folderAllRequestDTO){
        Folder folder=Folder.builder()
                .fno(folderAllRequestDTO.getFno())
                .member(Member
                        .builder()
                        .mno(folderAllRequestDTO.getMno())
                        .build())
                .title(folderAllRequestDTO.getTitle())
                .build();
        return folder;
    }

    //Folder entityToDto
    default FolderAllRequestDTO entityToDto(Folder folder){
        FolderAllRequestDTO folderAllRequestDTO = FolderAllRequestDTO.builder()
                .fno(folder.getFno())
                .mno(folder.getMember().getMno())
                .title(folder.getTitle())
                .build();
        return folderAllRequestDTO;
    }


}
