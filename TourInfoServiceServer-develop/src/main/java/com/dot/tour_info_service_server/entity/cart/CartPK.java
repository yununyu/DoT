package com.dot.tour_info_service_server.entity.cart;

import com.dot.tour_info_service_server.entity.Folder;
import com.dot.tour_info_service_server.entity.Member;
import com.dot.tour_info_service_server.entity.Place;
import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.io.Serializable;

@Getter
@Builder
@Embeddable
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class CartPK implements Serializable {
    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    private Place place;

    @ManyToOne(fetch = FetchType.LAZY)
    private Folder folder;
}
