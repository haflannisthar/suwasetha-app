package com.suwasethaclinic.Sms;

import com.twilio.Twilio;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {

    private final String ACCOUNT_SID = "AC30069be0828eb8944413c0c0a7cbcd43";
    private final String AUTH_TOKEN = "5e9b16503cde8a64fbfa43323ec6d6c3";

    public TwilioConfig() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }
}
