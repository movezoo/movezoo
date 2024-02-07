package com.ssafy.movezoo.game.controller;

import com.ssafy.movezoo.game.domain.Item;
import com.ssafy.movezoo.game.dto.ItemResponseDto;
import com.ssafy.movezoo.game.serivce.ItemService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/item")
public class ItemController {

    private final ItemService itemService;
    @GetMapping
    public ResponseEntity<List<ItemResponseDto>> findItemList(Authentication authentication){

        log.info("item controller {}", authentication);
        log.info("item controller {}", authentication.getName());

        List<ItemResponseDto> itemList = itemService.findAll();

        return ResponseEntity.status(HttpStatus.OK).body(itemList);
    }
}
