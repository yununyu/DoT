package com.dot.tour_info_service_server.service.folder;

import com.dot.tour_info_service_server.dto.request.folder.FolderRegistRequestDTO;
import com.dot.tour_info_service_server.dto.request.folder.FolderAllRequestDTO;
import com.dot.tour_info_service_server.dto.response.folder.FolderItemResponseDTO;
import com.dot.tour_info_service_server.dto.response.folder.FolderNameResponseDTO;
import com.dot.tour_info_service_server.entity.Folder;
import com.dot.tour_info_service_server.entity.Member;
import com.dot.tour_info_service_server.repository.BoardPlaceRepository;
import com.dot.tour_info_service_server.repository.CartRepository;
import com.dot.tour_info_service_server.repository.FolderRepository;
import com.dot.tour_info_service_server.security.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Log4j2
public class FolderServiceImpl implements FolderService{

    //폴더 repository
    private final FolderRepository folderRepository;

    //장바구니 repository
    private final CartRepository cartRepository;

    private final BoardPlaceRepository boardPlaceRepository;

    //폴더 전부 조회
    @Override
    public List<FolderItemResponseDTO> getAllFolder(Long mno) {
        List<Object[]> result = folderRepository.getFolderAll(mno);
        Map<Long, FolderItemResponseDTO> folderMap = new HashMap<>();

        for (Object[] objects : result) {
            List<Object[]> placeImage = boardPlaceRepository.loadRepresentPlaceImageByPno((Long) objects[2]);
            Long fno = (Long) objects[0];
            String title = (String) objects[1];
            Long pno = (Long) objects[2];
            String name = (String) objects[3];

            FolderItemResponseDTO folderItemResponseDTO = folderMap.computeIfAbsent(fno, k -> FolderItemResponseDTO.builder().fno(fno).title(title).pno(new ArrayList<>()).name(new ArrayList<>()).src(new ArrayList<>()).build());
            folderItemResponseDTO.getPno().add(pno);
            folderItemResponseDTO.getName().add(name);

            if (placeImage != null && !placeImage.isEmpty()) {
                Object[] imageArray = placeImage.get(0);
                if (imageArray != null && imageArray.length > 0) {
                    folderItemResponseDTO.getSrc().add((String) imageArray[0]);
                }
            }
        }

        return new ArrayList<>(folderMap.values());
    }

    //폴더명 조회
    @Override
    public List<FolderNameResponseDTO> getTitle(Long mno) {
        List<Folder> result=folderRepository.getFolderTitle(mno);
        List<FolderNameResponseDTO>folderNameDTOS=new ArrayList<>();
        for (Folder folder:result){
            FolderNameResponseDTO folderNameResponseDTO=FolderNameResponseDTO.builder()
                    .fno(folder.getFno())
                    .title(folder.getTitle())
                    .build();
            folderNameDTOS.add(folderNameResponseDTO);
        }
        return folderNameDTOS;
    }

    //폴더 등록
    @Override
    public Long register(FolderRegistRequestDTO folderRegistRequestDTO) {
        Folder folder=Folder.builder()
                .member(Member.builder().mno(folderRegistRequestDTO.getMno()).build())
                .title(folderRegistRequestDTO.getTitle())
                .build();
        folderRepository.save(folder);
        return folder.getFno();
    }

    //폴더 수정
    @Override
    public Long modify(FolderAllRequestDTO folderAllRequestDTO) {
        Long num= folderAllRequestDTO.getFno();
        Optional<Folder> result=folderRepository.findById(num);
        if(result.isPresent()) {
            Folder folder=result.get();
            folder.changeTitle(folderAllRequestDTO.getTitle());
            folderRepository.save(folder);
            return folder.getFno();
        }
        return -1l;
    }

    //폴더 삭제
    @Override
    public Long remove(Long fno) {
        Optional<Folder> result=folderRepository.findById(fno);
        if(result.isPresent()){
            Folder folder=result.get();
            if(SecurityUtil.validateMno(folder.getMember().getMno())){
                cartRepository.deleteAllByCartPK_Folder(folder);
                folderRepository.deleteById(fno);
                return fno;
            }
        }
        return -1l;
    }
}
