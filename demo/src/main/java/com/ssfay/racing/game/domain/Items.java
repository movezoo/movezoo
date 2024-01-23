package com.ssfay.racing.game.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "Items")
public class Items {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "items_id")
    private int itemsId;

    @Column(name = "items_name")
    private String itemsName;

    @Column(name = "items_img_url")
    private String itemsImgUrl;

    @Column(name = "items_description", columnDefinition = "TEXT")
    private String itemsDescription;

    // ... (Getter와 Setter, 그리고 기타 메서드 생략)
}

