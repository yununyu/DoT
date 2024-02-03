package com.dot.tour_info_service_server.entity.cart;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class Cart {
    @EmbeddedId
    private CartPK cartPK;
}
