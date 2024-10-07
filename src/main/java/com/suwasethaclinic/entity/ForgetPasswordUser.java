package com.suwasethaclinic.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForgetPasswordUser {

    private String username;
    private String email;
    private String otp;
    private String newpassword;


}
