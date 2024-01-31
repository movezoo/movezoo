package com.ssafy.movezoo.game.controller;


import com.ssafy.movezoo.game.domain.Racer;
import com.ssafy.movezoo.game.dto.BuyRacerDto;
import com.ssafy.movezoo.game.dto.RacerDto;
import com.ssafy.movezoo.game.serivce.RacerService;
import com.ssafy.movezoo.global.dto.SimpleResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/racer")
public class RacerController {

    private final RacerService racerService;
    @GetMapping
    public ResponseEntity<List<RacerDto>> searchRacerList(){
        List<RacerDto> racerList = racerService.findRacerList();
        return ResponseEntity.status(HttpStatus.OK).body(racerList);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<RacerDto>> searchMyRacerList(@PathVariable("userId") Integer userId){
        List<RacerDto> racerList = racerService.findMyRacerList(userId);
        return ResponseEntity.status(HttpStatus.OK).body(racerList);
    }

    @PostMapping
    public ResponseEntity<SimpleResponseDto> buyItRacer(@RequestBody BuyRacerDto buyRacerDto){
        boolean buyRacer = racerService.isBuyRacer(buyRacerDto.getUserId(), buyRacerDto.getRacerId());

        SimpleResponseDto simpleResponseDto =new SimpleResponseDto();
        if(buyRacer){
            simpleResponseDto.setSuccess(true);
            simpleResponseDto.setMsg("구입완료");
            return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
        }
        simpleResponseDto.setSuccess(false);
        simpleResponseDto.setMsg("구매불가");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(simpleResponseDto);
    }

}
