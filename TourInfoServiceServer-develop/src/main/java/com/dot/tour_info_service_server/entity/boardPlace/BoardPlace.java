package com.dot.tour_info_service_server.entity.boardPlace;

import com.dot.tour_info_service_server.entity.Place;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class BoardPlace {
    @EmbeddedId
    private BoardPlacePK boardPlacePK;

    @ManyToOne(fetch = FetchType.LAZY)
    private Place place;
}
