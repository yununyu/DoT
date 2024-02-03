package com.dot.tour_info_service_server.dto;

import lombok.*;

@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ResponseUploadDTO {
    private Long ino;
    private String src;
}
