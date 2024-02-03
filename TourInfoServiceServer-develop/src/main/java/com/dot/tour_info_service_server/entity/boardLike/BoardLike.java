package com.dot.tour_info_service_server.entity.boardLike;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString

public class BoardLike {
    @EmbeddedId
    private BoardLikePK boardLikePK;
}
