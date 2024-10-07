package com.suwasethaclinic.controller;

import com.suwasethaclinic.Email.EmailDetails;
import com.suwasethaclinic.Email.EmailService;
import com.suwasethaclinic.dao.RoleDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/profile")
public class profileController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @Autowired
    private EmailService emailService;


    @GetMapping(value = "/loggeduser" , produces = "application/json")
    public User getByUsername(){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        User loggedUser=userDao.getUserByUsername(auth.getName());
        loggedUser.setPassword(null);
//        return userDao.getuserdetails(auth.getName());

        return loggedUser;

    }

    @GetMapping(value = "/changeuserprofile" , produces = "application/json")
    public ChangeUserProfile changeUserDetails(){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        User loggedUser=userDao.getUserByUsername(auth.getName());

        ChangeUserProfile changeUserProfile=new ChangeUserProfile();
        changeUserProfile.setId(loggedUser.getId());
        changeUserProfile.setUsername(loggedUser.getUsername());
        changeUserProfile.setEmail(loggedUser.getEmail());
        changeUserProfile.setUser_photo(loggedUser.getUser_photo());
        changeUserProfile.setUser_photo_name(loggedUser.getUser_photo_name());



        return changeUserProfile;

    }



    @GetMapping
    public ModelAndView UserUI(){
        ModelAndView viewUser=new ModelAndView();
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUser.addObject("roles", roles);

        User loggeduser=userDao.getUserByUsername(auth.getName());
        viewUser.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUser.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewUser.addObject("loggedusername",auth.getName());
        viewUser.addObject("modulename","User-Profile");
        viewUser.addObject("title","User-Profile");


        viewUser.setViewName("profile.html");

        return  viewUser;
    }

    @PutMapping(value = "/changedetails")
    public String updateuser(@RequestBody ChangeUserProfile changeUserProfile){


        User extUser=userDao.getReferenceById(changeUserProfile.getId());

//        check username duplicate
        User extUserByUsername=userDao.getUserByUsername(changeUserProfile.getUsername());
        if (extUserByUsername!=null && !changeUserProfile.getId().equals(extUserByUsername.getId())) {
            return "Entered Username already exists ";
        }
//check email duplicate
        User extUserByEmail=userDao.getUserByEmail(changeUserProfile.getEmail());
        if (extUserByEmail!=null && !changeUserProfile.getId().equals(extUserByEmail.getId())) {
            return "Entered Email already exists ";
        }

        try {

            if (changeUserProfile.getCurrentpassword()!=null){

                if (bCryptPasswordEncoder.matches(changeUserProfile.getCurrentpassword(),extUser.getPassword())){
                    if (bCryptPasswordEncoder.matches(changeUserProfile.getNewpassword(),extUser.getPassword())){
                        return "The new password cannot be the same as the old password. Please choose a different password.";
                    }else {
                        extUser.setPassword(bCryptPasswordEncoder.encode(changeUserProfile.getNewpassword()));
                    }
                }else{
                    return "Password Mismatch.Please check again";
                }

            }

            extUser.setUsername(changeUserProfile.getUsername());
            extUser.setEmail(changeUserProfile.getEmail());
            extUser.setUser_photo_name(changeUserProfile.getUser_photo_name());
            extUser.setUser_photo(changeUserProfile.getUser_photo());


            userDao.save(extUser);
            return "OK";
        }catch (Exception e){
           return "User Details Update Not Successful"+e.getMessage();
        }



    }






//    forgot password change
//    send otp
@PostMapping(value = "/sendotp")
public String sendOtp(@RequestBody ForgetPasswordUser forgetPasswordUser){
    User extUserByUsernameEmail=userDao.getUserByUserNameEmail(forgetPasswordUser.getUsername(),forgetPasswordUser.getEmail());

if (extUserByUsernameEmail==null){
    return "Password Change Unsuccessful.User Not Found";
}

    try {

        EmailDetails emailDetails=new EmailDetails();
//
        emailDetails.setSendTo(extUserByUsernameEmail.getEmail());

        emailDetails.setSubject("Password Change OTP for Your Account");


        String messageHeader = "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "    body {  margin: 0; padding: 0;  }" +
                "    .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f3f2f0; }" +
                "    .text-center { text-align: center; }" +
                "    .mb-3 { margin-bottom: 1rem; }" +
                "    .mt-3 { margin-top: 1rem; }" +
                "    h1, h3,h4 { color: #343a40; }" +
                "    p { color: #495057; margin: 0 0 1rem; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>";

        String messageTitle = "<div class='text-center mb-3'>" +
                "<h1>Dear " + extUserByUsernameEmail.getEmployee_id().getCallingname() + ",</h1>" +
                "<h4> Please use the following OTP to proceed with the password change:<br/></h4>" +
                "</div>";

         String otpCode=OTP();

        String messageBody = "<div class='mb-3'>" +
                "<p> Otp :  " + otpCode + "</p>" +"</div>";

        String messageFooter ="<div class='text-center mb-3'>" +
                "<h4 style='color:#343a40'>If you did not request this otp for password change, please ignore this email or contact our support team if you believe this is an error.<br/>" +
                "</h4>" +
                "</div>"+
                "<div class='text-center mt-3'>" +
                "<h3>Best Regards,<br>SUWASETHA CLINIC</h3>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

// Combine all parts into one email body
        String emailOtpDetails = messageHeader + messageTitle + messageBody+ messageFooter;
        emailDetails.setMsgBody(emailOtpDetails);
        emailService.sendMail(emailDetails);


        extUserByUsernameEmail.setOtp(otpCode);
        userDao.save(extUserByUsernameEmail);


        return "OK";
    }catch (Exception e){
        return "Password Change Unsuccessful."+e.getMessage();
    }



}


//generate otp code
    static String OTP() {


        // Using numeric values
        String numbers = "0123456789";

        // Using random method
        Random rndm_method = new Random();

        char[] otp = new char[6];

        for (int i = 0; i < 6; i++)
        {
            // Use of charAt() method : to get character value
            // Use of nextInt() as it is scanning the value as int
            otp[i] =numbers.charAt(rndm_method.nextInt(numbers.length()));
        }

        String otpCode="";

        for (int i = 0; i <otp.length ; i++) {
            otpCode=otpCode + otp[i];
        }


        return otpCode;
    }


    //    forgot password change
//    verify otp
    @PostMapping(value = "/checkotp")
    public String verifyOtp(@RequestBody ForgetPasswordUser forgetPasswordUser){
        User extUserByUsernameEmail=userDao.getUserByUserNameEmail(forgetPasswordUser.getUsername(),forgetPasswordUser.getEmail());

        if (extUserByUsernameEmail==null){
            return "Password Change Unsuccessful.User Not Found";
        }

        try {
             if (forgetPasswordUser.getOtp().equals(extUserByUsernameEmail.getOtp())){
                 extUserByUsernameEmail.setOtp(null);
                 userDao.save(extUserByUsernameEmail);
                 return "OK";
             }else{
                 return "OTP match Failed.Please re-check the OTP";
             }

        }catch (Exception e){
            return "OTP check Unsuccessful."+e.getMessage();
        }



    }



    @PostMapping(value = "/changenewpassword")
    public String changePassword(@RequestBody ForgetPasswordUser forgetPasswordUser){
        User extUserByUsernameEmail=userDao.getUserByUserNameEmail(forgetPasswordUser.getUsername(),forgetPasswordUser.getEmail());

        if (extUserByUsernameEmail==null){
            return "Password Change Unsuccessful.User Not Found";
        }

        try {
            if (forgetPasswordUser.getNewpassword()!=null){
                if (bCryptPasswordEncoder.matches(forgetPasswordUser.getNewpassword(),extUserByUsernameEmail.getPassword())){
                    return "The new password cannot be the same as the old password. Please choose a different password.";
                }else {
                    extUserByUsernameEmail.setPassword(bCryptPasswordEncoder.encode(forgetPasswordUser.getNewpassword()));
                }
            }else {
               return "Error password Change";
            }

            userDao.save(extUserByUsernameEmail);
            return "OK";

        }catch (Exception e){
            return "Password check Unsuccessful."+e.getMessage();
        }



    }



//    grant privilege to remove an item
@GetMapping(value = "/verifyuser/{username}/{password}" , produces = "application/json")
public Boolean grantPrivilege(@PathVariable("username") String username,@PathVariable("password") String password) {
    User extUser = userDao.getUserByUsername(username);

    if (extUser==null){
        return false;
    }

    try {
        if (bCryptPasswordEncoder.matches(password, extUser.getPassword())) {
            Set<Role> roleList = extUser.getRoles();

            for (Role role : roleList) {
                if (Objects.equals(role.getName(), "Manager") || Objects.equals(role.getName(), "Admin")) {
                    return true;
                }
            }
        }
            return false;

    } catch (Exception e) {
        return false;
    }


}

}

