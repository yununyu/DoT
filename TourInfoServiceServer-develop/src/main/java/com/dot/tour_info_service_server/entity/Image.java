package com.dot.tour_info_service_server.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class Image extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ino;

    @ManyToOne(fetch = FetchType.LAZY)
    private Board board; //게시글번호 - 머지 후 import 해야함

    @Column(nullable = false)
    private String src; //이미지 경로

    public void changeBoard(Board board){
        this.board = board;
    }
}
