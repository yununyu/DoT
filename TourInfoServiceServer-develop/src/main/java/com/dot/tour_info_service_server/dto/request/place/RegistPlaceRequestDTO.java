package com.dot.tour_info_service_server.dto.request.place;

import com.dot.tour_info_service_server.entity.Category;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RegistPlaceRequestDTO {
    @NotBlank(message = "name cannot be blank")
    private String name;
    @NotNull(message = "longitude cannot be null")
    @Min(value = -180, message = "longitude cannot be less than -180 degrees")
    @Max(value = 180, message = "longitude cannot be more than 180 degrees")
    private Double lng;
    @NotNull(message = "latitude cannot be null")
    @Min(value = -90, message = "latitude cannot be less than -90 degrees")
    @Max(value = 90, message = "latitude cannot be more than 90 degrees")
    private Double lat;
    private String roadAddress;
    private String localAddress;
    private String engAddress;
    @NotNull(message = "category cannot be null")
    private Category category;
}
