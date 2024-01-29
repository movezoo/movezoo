package com.ssafy.movezoo.game.serivce;


import com.ssafy.movezoo.game.domain.Item;
import com.ssafy.movezoo.game.dto.ItemResponseDto;
import com.ssafy.movezoo.game.repository.ItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    public Item save(Item item){
        return itemRepository.save(item);
    }
    public List<ItemResponseDto> findAll() {
        List<ItemResponseDto> result = new ArrayList<>();

        List<Item> itemList = itemRepository.findAll();

        for (Item item : itemList) {
            ItemResponseDto itemResponseDto = new ItemResponseDto();
            itemResponseDto.setItemImgUrl(item.getItemImgUrl());
            itemResponseDto.setItemName(item.getItemName());
            itemResponseDto.setItemDescription(item.getItemDescription());

            result.add(itemResponseDto);
        }
        return result;
    }

}
