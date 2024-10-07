package com.suwasethaclinic.Sms;

import com.twilio.Twilio;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {

    private final String ACCOUNT_SID = "";
    private final String AUTH_TOKEN = "";

    public TwilioConfig() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }
}
