package com.ssafy.movezoo.game.serivce;

import com.ssafy.movezoo.game.domain.MyRacer;
import com.ssafy.movezoo.game.domain.Racer;
import com.ssafy.movezoo.game.dto.RacerDto;
import com.ssafy.movezoo.game.repository.MyRacerRepository;
import com.ssafy.movezoo.game.repository.RacerRepository;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.sevice.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class RacerService {
    private final RacerRepository racerRepository;
    private final MyRacerRepository myRacerRepository;
    private final UserService userService;

    public Racer save(Racer racer){
        return racerRepository.save(racer);
    }
    public Racer findOne(Integer racerId){
        return racerRepository.findById(racerId);
    }
    public List<RacerDto> findRacerList(){
        List<RacerDto> result = new ArrayList<>();

        List<Racer> allRacer = racerRepository.findAllRacer();
        for(Racer racer : allRacer){
            result.add(new RacerDto(racer.getRacerId(),racer.getRacerName(),racer.getRacerPrice()));
        }

        return result;
    }

    public List<RacerDto> findMyRacerList(Integer userId){
        List<RacerDto> result = new ArrayList<>();
        List<MyRacer> myAllMyRacer = myRacerRepository.findMyAllMyRacer(userId);

        for(MyRacer myracer : myAllMyRacer){
            Racer racer = myracer.getRacer();
            result.add(new RacerDto(racer.getRacerId(),racer.getRacerName(),racer.getRacerPrice()));
        }

        return result;

    }

    public boolean isBuyRacer(int userId, int racerId){
        //이미 보유하고 있는 레이서를 사지 못한다
        User user = userService.findById(userId);
        List<MyRacer> myRacers = user.getMyRacers();
        System.out.println(myRacers);

        Racer buyRacer = racerRepository.findById(racerId);

        for(MyRacer mr : myRacers) {
            System.out.println("나의 레이서"+" "+mr.getRacer());
            System.out.println(buyRacer.equals(mr.getRacer()));
            if(buyRacer.equals(mr.getRacer())) return false;
        }

        //coin<price일때 구매못한다.
        System.out.println("racer price : " + buyRacer.getRacerPrice() +" user coin : "+ user.getCoin());
        if(!isBuy(user,buyRacer)){
            return false;
        }

        //사용자의 보유 재화와 레이서 가격을 비교 하여 coin >= price일때만 구메
        //구매후 coin을 차감하고 MyRacer에 Racer를 넣는다
        userService.useCoin(userId, buyRacer.getRacerPrice());

        MyRacer addMyRacer = new MyRacer();
        addMyRacer.setRacer(buyRacer);
        addMyRacer.setUser(user);
        user.addMyRacer(addMyRacer);
        return true;
    }

    public boolean isBuy(User user,Racer racer){
        return user.getCoin() >= racer.getRacerPrice();
    }

    public MyRacer addMyRacer(int userId,int racerId){
        MyRacer myRacer = new MyRacer();

        User user = userService.findById(userId);
        Racer racer = racerRepository.findById(racerId);
        myRacer.setUser(user);
        myRacer.setRacer(racer);

        user.getMyRacers().add(myRacer);
        return myRacer;
    }
}
