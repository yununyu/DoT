package com.dot.tour_info_service_server.controller;

import com.dot.tour_info_service_server.dto.*;
import com.dot.tour_info_service_server.dto.request.folder.CartAllRequestDTO;
import com.dot.tour_info_service_server.dto.request.folder.FolderRegistRequestDTO;
import com.dot.tour_info_service_server.dto.request.folder.FolderAllRequestDTO;
import com.dot.tour_info_service_server.dto.response.folder.FolderItemResponseDTO;
import com.dot.tour_info_service_server.dto.response.folder.FolderNameResponseDTO;
import com.dot.tour_info_service_server.security.util.SecurityUtil;
import com.dot.tour_info_service_server.service.cart.CartService;
import com.dot.tour_info_service_server.service.folder.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// 전체 authenticated
@RequestMapping("/folder")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;

    private final CartService cartService;

    //폴더 내용 모두 들고오기
    @GetMapping(value = "/all/{mno}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseWrapDTO<List<FolderItemResponseDTO>>> allFolder(@PathVariable Long mno){
        List<FolderItemResponseDTO> data=folderService.getAllFolder(mno);
        ResponseWrapDTO<List<FolderItemResponseDTO>> response=new ResponseWrapDTO<>(true,data);
      return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //폴더명 모두 조회
    @GetMapping(value = "/title/{mno}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseWrapDTO<List<FolderNameResponseDTO>>>folderNames(@PathVariable Long mno){
        List<FolderNameResponseDTO> data=folderService.getTitle(mno);
        ResponseWrapDTO<List<FolderNameResponseDTO>> response=new ResponseWrapDTO<>(true,data);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    //폴더 등록 - valid완료
    @PostMapping(value = "/register",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseWrapDTO<Long>>register(@RequestBody FolderRegistRequestDTO folderRegistRequestDTO){
        ResponseWrapDTO response=new ResponseWrapDTO<>(false,null);
        if(SecurityUtil.validateMno(folderRegistRequestDTO.getMno())) {
            Long data = folderService.register(folderRegistRequestDTO);
            if (data > 0) {
                response.setResult(true);
                response.setData(data);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }else{
                return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(response,HttpStatus.UNAUTHORIZED);
    }

    //폴더명 수정 - valid 완료
    @PutMapping(value = "/update",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseWrapDTO<Long>>modify(@RequestBody FolderAllRequestDTO folderAllRequestDTO){
        ResponseWrapDTO response=new ResponseWrapDTO<>(false,null);
        if(SecurityUtil.validateMno(folderAllRequestDTO.getMno())) {
            Long data = folderService.modify(folderAllRequestDTO);
            if (data != -1l) {
                response.setResult(true);
                response.setData(data);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(response,HttpStatus.UNAUTHORIZED);
    }

    //폴더 삭제 -service에서 valid 완료
    @DeleteMapping(value = "/delete/{fno}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseWrapDTO<Long>> remove(@PathVariable Long fno){
        ResponseWrapDTO response = new ResponseWrapDTO(false,null);
        Long data=folderService.remove(fno);
        if (data!=-1l){
            response.setResult(true);
            response.setData(data);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
        return new ResponseEntity<>(response,HttpStatus.UNAUTHORIZED);
    }

    //스팟 등록 -value 완료
    @PostMapping(value = "/cart-append",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseWrapDTO<Long>>spotAdd(@RequestBody CartAllRequestDTO cartAllRequestDTO){

        ResponseWrapDTO response=new ResponseWrapDTO(false,null);
        if(SecurityUtil.validateMno(cartAllRequestDTO.getMno())) {
            Long data = cartService.addCart(cartAllRequestDTO);
            if (data != -1l) {
                response.setResult(true);
                response.setData(data);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(response,HttpStatus.UNAUTHORIZED);
    }

    //스팟 삭제 - valid완료
    @DeleteMapping(value="/cart-delete",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseWrapDTO<Long>>spotDelete(@RequestBody CartAllRequestDTO cartAllRequestDTO){
        ResponseWrapDTO response=new ResponseWrapDTO(false,null);
        if(SecurityUtil.validateMno(cartAllRequestDTO.getMno())) {
            Long data = cartService.deleteCart(cartAllRequestDTO);
            if (data != null) {
                response.setResult(true);
                response.setData(data);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(response,HttpStatus.UNAUTHORIZED);
    }

}
