package com.dot.tour_info_service_server.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class Place extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pno; //장소번호

    @Column(nullable = false)
    private String name; //장소명

    @Column(nullable = false)
    private Double lng; // 경도

    @Column(nullable = false)
    private Double lat; // 위도

    private String roadAddress; //도로명 주소
    private String localAddress; // 주소
    private String engAddress; //영문 주소

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Category category = Category.ETC; //음식점,숙소,관광지,기타, 전체

    @ColumnDefault("0")
    @Column(nullable = false)
    private int cart; //장바구니 담은 총 갯수

}
