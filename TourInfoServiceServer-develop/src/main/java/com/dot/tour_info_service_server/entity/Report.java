package com.dot.tour_info_service_server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Entity
//같은 사용자가 같은 게시글 또는 댓글을 여러번 신고불가능하도록 unique 설정
@Table(name = "report", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"complainant_mno", "board_bno"}),
        @UniqueConstraint(columnNames = {"complainant_mno","reply_rno"})
})
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Report extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sno;

    @Column(nullable = false)
    @ColumnDefault("false")
    private Boolean isDone;

    @Column(columnDefinition = "TEXT",nullable = false)
    private String content;

    @Column(nullable = false)
    private String message;

    private Long complainant_mno;

    private Long defendant_mno;

    private Long board_bno;

    private Long reply_rno;

    public void changeIsDone(Boolean isDone){this.isDone=isDone;};

}