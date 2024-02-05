package com.ssafy.movezoo.auth.sevice;

import com.ssafy.movezoo.auth.dto.EmailMessage;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import com.ssafy.movezoo.user.sevice.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    private final UserRepository userRepository;

    public String sendMail(EmailMessage emailMessage, String type) {
        String authNum = createCode();

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        if (type.equals("password")) userRepository.updatePassword(emailMessage.getTo(), authNum);
        if (type.equals("email"))  userRepository.updateUserAuthCode(emailMessage.getTo() ,authNum);
        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(emailMessage.getTo()); // 수신자메일
            mimeMessageHelper.setSubject(emailMessage.getSubject()); // 제목
            mimeMessageHelper.setText(authNum); // 본문
            javaMailSender.send(mimeMessage);

            log.info("Success");

            return authNum;

        } catch (MessagingException e) {
            log.info("fail");
            throw new RuntimeException(e);
        }
    }

    // 인증번호 및 임시 비밀번호 생성 메서드
    public String createCode() {
        Random random = new Random();
        StringBuilder key = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(4);

            switch (index) {
                case 0:
                    key.append((char) ((int) random.nextInt(26) + 97));
                    break;
                case 1:
                    key.append((char) ((int) random.nextInt(26) + 65));
                    break;
                default:
                    key.append(random.nextInt(9));
            }
        }
        return key.toString();
    }

    //회원가입시 메일 인증 코드를 확인하는 함수
    public boolean checkAuthNumber(String usersEmail, String authNumber){
        Optional<User> userOptional = userRepository.findByEmail(usersEmail);

        // Optional이 비어있으면 false를 반환하도록 기본값을 설정
        User user = userOptional.orElse(null);

        String usersAuthNumber = user.getAuthNumber();

        return usersAuthNumber!=null && usersAuthNumber.equals(authNumber);
    }
}