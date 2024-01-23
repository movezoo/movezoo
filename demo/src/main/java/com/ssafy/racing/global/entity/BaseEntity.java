package com.ssafy.racing.global.entity;

import jakarta.persistence.MappedSuperclass;

import java.time.LocalDate;

/*
각 객체를 생성, 수정할때 날짜를 기록하고자한다. 그렇기 위해서 필드를 추가해야하는데 번거롭다!
그래서 클래스를 따로 만들고 MappedSuperclass를 사용하여 매핑정보로만 사용하겠다는걸 명시한다.
즉 공통적으로 사용할
 */
//JAP에서 상속 받을 객체의 annotation은 Entity또는 MappedSuperclass!
@MappedSuperclass   //엔티티가 아니다 테이블 생성X 매핑X
public abstract class BaseEntity {
    private String createdBy;
    private LocalDate createdDate;
    private String lastModifiedBy;
    private String lastModifiedDate;

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(String lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}
