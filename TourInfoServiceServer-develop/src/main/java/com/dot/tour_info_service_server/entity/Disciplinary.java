
package com.dot.tour_info_service_server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString
public class Disciplinary {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long dno;

  @ManyToOne(fetch = FetchType.LAZY)
  private Member member;

  @Column(nullable = false)
  private String reason;

  private LocalDateTime strDate;  // 제재 시작 일자
  private LocalDateTime expDate;  // 제재 종료 일자
}