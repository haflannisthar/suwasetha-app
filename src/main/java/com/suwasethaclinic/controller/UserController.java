package com.suwasethaclinic.controller;


import com.suwasethaclinic.Email.EmailDetails;
import com.suwasethaclinic.Email.EmailService;
import com.suwasethaclinic.dao.EmployeeDao;
import com.suwasethaclinic.dao.RoleDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Role;
import com.suwasethaclinic.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private UserDao dao;

    @Autowired
    private EmployeeDao employeeDao;


    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private EmailService emailService;

    @GetMapping(value = "/findall" , produces = "application/json")
    public List<User>findAll(){
        return dao.findAll();
    }


    @GetMapping(value = "/getuserbyid/{userid}",produces ="application/json" )
    public User getuserbyid(@PathVariable("userid") Integer userid){
       return dao.getuserbyid(userid);
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

        User loggeduser=dao.getUserByUsername(auth.getName());
        viewUser.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUser.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewUser.addObject("loggedusername",auth.getName());
        viewUser.addObject("modulename","User");
        viewUser.addObject("title","User");
        viewUser.setViewName("user.html");
        return  viewUser;
    }

//    function to save user details
    @PostMapping
    public String saveUser(@RequestBody User user){

//        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"User");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }

//        check duplicate for email,username,employee
        User extUser=dao.getUserByEmployeeId(user.getEmployee_id().getId());

        if (extUser!=null){
             return "Entered EMPLOYEE already exists ";

        }
        User extUserByUsername=dao.getUserByUsername(user.getUsername());
        if (extUserByUsername !=null){
            return "Entered USERNAME already exists ";

        }
        User extUserByEmail=dao.getUserByEmail(user.getEmail());
        if (extUserByEmail !=null){
            return "Entered NIC already exists ";

        }

        try {

            user.setAddeddatetime(LocalDateTime.now());


            //           send email
            EmailDetails emailDetails=new EmailDetails();
            emailDetails.setSendTo(user.getEmail());
            emailDetails.setSubject(user.getEmployee_id().getCallingname()+" Account Creation Confirmation.");


            String employeeHeader = "<!DOCTYPE html>" +
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
                    "    h1, h3 { color: #343a40; }" +
                    "    h6 { color: #6c757d; }" +
                    "    p { color: #495057; margin: 0 0 1rem; }" +
                    "    .import_note { color: #880808;}" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>";

            String messageTitle = "<div class='text-center mb-3'>" +
                    "<h1>Dear " + user.getEmployee_id().getFullname() + ",</h1>" +
                    "<h4>We are excited to have you on board. Your account has been successfully created. Below are your account details</h4>" +
                    "</div>";

            String datePart= String.valueOf(user.getAddeddatetime());
            System.out.println(datePart.substring(0,10));

            String messageUserBody = "<div class='mb-3'>" +
                    "<p> User Name:" + user.getUsername() + "</p>" +
                    "<p>Password:" + user.getPassword() + "</p>" +
                    "<p> Role :" + user.getRoles().iterator().next().getName() + "</p>" +
                    "<p> Account Creation Date :" + datePart.substring(0,10) + "</p>" +
                    "</div>";


            String messageUserFooter ="<div class='text-center mb-3'>" +
                    "<h2 class='import_note'>Do not Share the USERNAME and PASSWORD with anyone.</h2><br/>" +
                    "<h4>If you have any questions or need further assistance, please do not hesitate to contact your manager.<br/>" +
                    "We look forward to working with you!</h4>" +
                    "</div>"+
                    "<div class='text-center mt-3'>" +
                    "<h3>Best Regards,<br>SUWASETHA CLINIC</h3>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

// Combine all parts into one email body
            String emailUserDetails = employeeHeader + messageTitle + messageUserBody + messageUserFooter;



//           email send
            emailDetails.setMsgBody(emailUserDetails);
            emailService.sendMail(emailDetails);



            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            dao.save(user);
            return "OK";

        }
        catch (Exception e){
            return "Save not completed" +e.getMessage();
        }


    }


  @DeleteMapping
    public  String deleteUser(@RequestBody User user){
//        authentication and authorization
      Authentication auth= SecurityContextHolder.getContext().getAuthentication();


      HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
      if (!logUserPriv.get("delete")){
          return "Access denied ";
      }
//      check the  user is exists
      User extUser=dao.getReferenceById(user.getId());
     if (extUser==null){
         return "User doesn't exists ";
     }

     try{
         user.setStatus(false);
         dao.save(user);
         return  "OK";
     }
     catch (Exception e){
         return "Delete not completed" +e.getMessage();
     }
  }

@PutMapping
public  String updateUser(@RequestBody User user){


//        authentication and authorization
    Authentication auth= SecurityContextHolder.getContext().getAuthentication();


    HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
    if (!logUserPriv.get("update")){
        return "Access denied ";
    }
//    check the user exists
        User extUser=dao.getReferenceById(user.getId());

    if (extUser==null){
        return "User not Found";

    }

//    check duplicate of email and  username
    User extUserName=dao.getUserByUsername(user.getUsername());
    if (extUserName!=null && !user.getId().equals(extUserName.getId())) {
        return "Entered Username Already Exists  ";
    }

    try {
        dao.save(user);


        return "OK";


    } catch (Exception e) {
        // TODO: handle exception
        return "update is not completed" + e.getMessage();
    }
}


}
