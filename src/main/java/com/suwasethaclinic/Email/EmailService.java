package com.suwasethaclinic.Email;

import jakarta.mail.MessagingException;

public interface EmailService {

    // Method
    // To send a simple email
    void sendSimpleMail(EmailDetails details);


     void sendMail(EmailDetails details) throws MessagingException;


        // Method
    // To send an email with attachment
    String sendMailWithAttachment(EmailDetails details);

}
