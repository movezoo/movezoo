package com.ssafy.movezoo.game.controller;

import com.ssafy.movezoo.game.domain.LapTime;
import com.ssafy.movezoo.game.dto.LapTimeRequestDto;
import com.ssafy.movezoo.game.dto.LapTimeResponseDto;
import com.ssafy.movezoo.game.serivce.LapTimeService;
import com.ssafy.movezoo.global.dto.SimpleResponseDto;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.sevice.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.SimpleTimeZone;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/laptime")
public class LapTimeController {

    private final LapTimeService lapTimeService;
    private final UserService userService;

    @GetMapping("/{trackId}")
    public ResponseEntity<List<LapTimeResponseDto>> findLapTimeList(@PathVariable Integer trackId) {
        List<LapTimeResponseDto> lapTimeList = lapTimeService.findLapTimeList(trackId);

        return ResponseEntity.status(HttpStatus.OK).body(lapTimeList);
    }

    @GetMapping("/{userId}/{trackId}")
    public ResponseEntity<LapTimeResponseDto> findUserLapTime(@PathVariable("userId") Integer userId, @PathVariable("trackId") Integer trackId) {
        Optional<LapTime> userLapTime = lapTimeService.findUserLapTime(userId, trackId);
        LapTimeResponseDto lapTimeResponseDto = new LapTimeResponseDto();

        if(userLapTime.isPresent()) {
            LapTime lapTime = userLapTime.get();
            System.out.println(lapTime);
            lapTimeResponseDto.setTrackId(lapTime.getTrackId());
            lapTimeResponseDto.setNickName(lapTime.getUser().getNickname());
            lapTimeResponseDto.setProfileImgUrl(lapTime.getUser().getProfileImgUrl());
            lapTimeResponseDto.setRecord(lapTime.getRecord());
        }

        return ResponseEntity.status(HttpStatus.OK).body(lapTimeResponseDto);
    }

    @PatchMapping
    public ResponseEntity<SimpleResponseDto> saveRecordLapTime(@RequestBody LapTimeRequestDto newLapTime) {
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        simpleResponseDto.setSuccess(true);
        simpleResponseDto.setMsg("기록저장완료");

        //trackId에 대한 정보가 없으면 생성후 종료

        Optional<LapTime> userLapTime = lapTimeService.findUserLapTime(newLapTime.getUserId(), newLapTime.getTrackId());
        if (userLapTime.isEmpty()) {
            lapTimeService.addLapTime(newLapTime);
            return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
        }

        LapTime oldLapTime = userLapTime.get();

        //trackId의 기록보다 크면 종료
        if (oldLapTime.getRecord() <= newLapTime.getRecord())
            return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);

        //trackId의 기록보다 작으면 더티채킹
        lapTimeService.updateLapTime(newLapTime);
        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
    }
}
