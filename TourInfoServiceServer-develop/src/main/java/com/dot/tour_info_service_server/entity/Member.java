package com.dot.tour_info_service_server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class Member extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long mno;

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(nullable = true)
  private LocalDate birth;

  @Column//modify
  private String phone;

  @Column(nullable = false)
  private String name;

  private String image; // 이미지 url

  @ColumnDefault("false")
  @Column(nullable = false)
  private boolean fromSocial; // 소셜 로그인 여부

  @ColumnDefault("0")
  @Column(nullable = false)
  private int disciplinary;

  private String businessId; // 사업자 번호

  private boolean isApprove; // 사업자 승인 여부

  @ColumnDefault("false")
  @Column(nullable = false)
  private boolean isReset; // 비밀번호 초기화 대상 여부


  @ColumnDefault("false")
  private Boolean isValidate;

  public void changeIsValidate(Boolean isValidate){this.isValidate=isValidate;};

  @ElementCollection(fetch = FetchType.LAZY)
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private Set<Role> roleSet = new HashSet<>();

  public void addMemberRole(Role role){
    roleSet.add(role);
  }

  public void changePassword(String password) {
    this.password = password;
  }

  public void changeIsReset(boolean isReset) {
    this.isReset = isReset;
  }

  public void changeName(String name) {
    this.name = name;
  }

  public void changePhone(String phone) {
    this.phone = phone;
  }

  public void changeImage(String image) {
    this.image = image;
  }
}
