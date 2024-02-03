package com.dot.tour_info_service_server.dto.request.image;

import lombok.*;

import java.util.List;

@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ImageDeleteRequestDTO {
    List<String> srcs;
}
