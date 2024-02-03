package com.dot.tour_info_service_server.service.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@Log4j2
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {
    private final JavaMailSender javaMailSender;

    @Override
    public void sendEmailToMember(String email, String title, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        try {
            //받는사람
            message.setTo(email);
            //제목
            message.setSubject(title);
            //내용
            message.setText(text);

            javaMailSender.send(message);

        } catch (MailException e) {
            // 메일 전송이 실패하면 예외가 발생
            e.printStackTrace();
        }
    }

    @Override
    public void sendPassword(String email, String name, String password) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        String title = name + "님의 DoT 임시 비밀번호 발급안내";
        String text = name + "님의 임시 비밀번호 발급 안내 입니다.\n" +
                "임시 비밀번호 " + password + " 로 발급되었습니다.";

        //받는사람
        helper.setFrom(new InternetAddress("noreply@DoT.com", "DoT", "UTF-8"));
        //받는사람
        helper.setTo(email);
        //제목
        helper.setSubject(title);
        //내용
        helper.setText(text, true);

        javaMailSender.send(message);
    }

    @Override
    public void sendValidateUrl(String email, String name, String token) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        String title = name + "님의 DoT 이메일 인증";
        String text = "<h1>" + name + "님의 DoT 가입을 축하드립니다.</h1>" +
                "<p>보내드린 <a href='http://localhost:8080/auth/email/validation?email=" + email + "&token=" + token +
                "'>주소</a> 로 10분 이내로 접속하여 인증해 주세요.</p>" +
                "<p>가입하신 내역이 없다면 이 메일을 무시하셔도 됩니다.</p>" +
                "<meta charset='UTF-8'>";


        helper.setFrom(new InternetAddress("noreply@DoT.com", "DoT", "UTF-8"));
        //받는사람
        helper.setTo(email);
        //제목
        helper.setSubject(title);
        //내용
        helper.setText(text, true);

        javaMailSender.send(message);
    }

    @Override
    public void reSendValidateUrl(String email, String name, String token) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        String title = name + "님의 DoT 이메일 인증(재전송)";
        String text = "<h1>" + name + "님의 재전송된 이메일 인증 입니다.</h1>" +
                "<p>보내드린 <a href='http://localhost:8080/auth/email/validation?email=" + email + "&token=" + token +
                "'>주소</a> 로 10분 이내로 접속하여 인증해 주세요.</p>" +
                "<p>가입하신 내역이 없다면 이 메일을 무시하셔도 됩니다.</p>" +
                "<meta charset='UTF-8'>";


        helper.setFrom(new InternetAddress("noreply@DoT.com", "DoT", "UTF-8"));
        //받는사람
        helper.setTo(email);
        //제목
        helper.setSubject(title);
        //내용
        helper.setText(text, true);

        javaMailSender.send(message);
    }
}
