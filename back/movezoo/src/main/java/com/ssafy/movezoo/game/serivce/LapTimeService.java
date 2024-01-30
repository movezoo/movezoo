package com.ssafy.movezoo.game.serivce;

import com.ssafy.movezoo.game.domain.LapTime;
import com.ssafy.movezoo.game.dto.LapTimeRequestDto;
import com.ssafy.movezoo.game.dto.LapTimeResponseDto;
import com.ssafy.movezoo.game.repository.LapTimeRepository;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
@RequiredArgsConstructor
public class LapTimeService {

    private final LapTimeRepository lapTimeRepository;
    private final UserRepository userRepository;

    public List<LapTimeResponseDto> findLapTimeList(int trackId){
        return lapTimeRepository.findLapTimeList(trackId);
    }

    public Optional<LapTime> findUserLapTime(int userId, int trackId){
       return lapTimeRepository.findUserLapTime(userId,trackId);
    }

    public LapTime addLapTime(LapTimeRequestDto lapTimeRequestDto){
        LapTime lapTime = new LapTime();
        User user = userRepository.findById(lapTimeRequestDto.getUserId());

        lapTime.setTrackId(lapTimeRequestDto.getTrackId());
        lapTime.setUser(user);
        lapTime.setRecord(lapTimeRequestDto.getRecord());

        user.addLapTime(lapTime);


        return lapTime;
    }



    public void updateLapTime(LapTimeRequestDto newLapTime){
        Optional<LapTime> userLapTime = findUserLapTime(newLapTime.getUserId(), newLapTime.getTrackId());
        if(userLapTime.isPresent()){
            LapTime lapTime = userLapTime.get();
            lapTime.setRecord(newLapTime.getRecord());
        }
    }
}
