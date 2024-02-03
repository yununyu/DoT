package com.dot.tour_info_service_server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class Board extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bno;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT",nullable = false)
    private String content;

    @Column(nullable = false)
    private Boolean isAd;

    @Column(nullable = false)
    private Boolean isCourse;

    @ColumnDefault("0")
    @Column(nullable = false)
    private Double score;

    @ColumnDefault("0")
    @Column(nullable = false)
    private int likes;

    @ManyToOne(fetch= FetchType.LAZY)
    private Member writer;


    public void changeTitle(String title) {
        this.title = title;
    }

    public void changeContent(String content) {
        this.content = content;
    }

    public void changeScore(double score) {
        this.score = score;
    }
}
