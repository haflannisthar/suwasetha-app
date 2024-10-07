package com.suwasethaclinic.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeUserProfile {

    private Integer id;
    private String username;
    private String currentpassword;
    private String newpassword;
    private String email;
    private String user_photo_name;
    private byte[] user_photo;

}
