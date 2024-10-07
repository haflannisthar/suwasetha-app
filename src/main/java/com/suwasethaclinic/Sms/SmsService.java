package com.suwasethaclinic.Sms;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;


@Service
@EnableAsync
public class SmsService {

    private final String Twilio_Phone_Number = "+12562428454";

//    @Async
//    public void sendSms(String to, String body) {
//        Message message = Message.creator(
//                new PhoneNumber(to),
//                new PhoneNumber(TWILIO_NUMBER),
//                body
//        ).create();
//
//        System.out.println("SMS sent: " + message.getSid());
//    }

        @Async
    public void sendSms(String to, String body) {
        try {
            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(Twilio_Phone_Number),
                    body
            ).create();

            System.out.println("SMS sent: " + message.getSid());
        }
        catch (Exception e) {
            System.out.println("Failed to send SMS " + e.getMessage());
        }
    }



}
