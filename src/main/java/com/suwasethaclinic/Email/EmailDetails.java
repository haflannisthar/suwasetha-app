package com.suwasethaclinic.Email;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EmailDetails {

    private String sendTo;
    private String msgBody;
    private String subject;
    private String attachment;

}
