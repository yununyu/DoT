package com.dot.tour_info_service_server.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class Reply extends BaseEntity{
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long rno;

  @ManyToOne(fetch = FetchType.LAZY)
  private Member member;

  @ManyToOne(fetch = FetchType.LAZY)
  private Board board;

  @Column(nullable = false, length =1000)
  private String text;    // 댓글 내용

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_rno")
  private Reply parent;   // 부모 댓글



  public void changeText(String text) {
    this.text = text;
  }

  public void changeMember(Member member) {
    this.member = member;
  }
}
