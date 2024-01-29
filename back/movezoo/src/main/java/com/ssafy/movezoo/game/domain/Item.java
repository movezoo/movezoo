package com.ssafy.movezoo.game.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Item")
@Setter
@Getter
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private int itemId;

    @Column(name = "item_name")
    private String itemName;

    @Column(name = "item_img_url")
    private String itemImgUrl;

    @Column(name = "item_description", columnDefinition = "TEXT")
    private String itemDescription;

    // ... (Getter와 Setter, 그리고 기타 메서드 생략)
}

