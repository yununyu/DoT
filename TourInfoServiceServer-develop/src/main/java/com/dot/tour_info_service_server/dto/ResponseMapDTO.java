package com.dot.tour_info_service_server.dto;

import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class ResponseMapDTO {
    Map<String, Object> response = new HashMap<>();
}
