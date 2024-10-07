package com.suwasethaclinic.controller;



import com.suwasethaclinic.Email.EmailDetails;
import com.suwasethaclinic.Email.EmailService;
import com.suwasethaclinic.dao.EmployeeDao;

import com.suwasethaclinic.dao.EmployeeStatusDao;
import com.suwasethaclinic.dao.RoleDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Employee;
import com.suwasethaclinic.entity.Role;
import com.suwasethaclinic.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@RestController
public class EmployeeController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private EmployeeDao dao;

    @Autowired
    private EmployeeStatusDao statusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private RoleDao roleDao;

    @GetMapping(value = "/employee")
    public ModelAndView empUi() {
        ModelAndView viewEp = new ModelAndView();
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        User loggeduser=userDao.getUserByUsername(auth.getName());
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewEp.addObject("roles", roles);
        viewEp.addObject("rolename",loggeduser.getRoles().iterator().next().getName());


        viewEp.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewEp.addObject("loggedusername",auth.getName());
        viewEp.addObject("modulename","Employee");
        viewEp.addObject("title","Employee");
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("select")){
            viewEp.setViewName("errorpage.html");
            return  viewEp;
        }
        else {
            viewEp.setViewName("employee.html");
            return  viewEp;
        }

    }


//    get doctor channelling fee by doctor id
@GetMapping(value = "/employee/getdoctorchannallingfee/{doctorid}", produces = "application/json")
public BigDecimal getDoctorChannellingFee(@PathVariable("doctorid") Integer doctorid)
{
    return dao.getDoctorChannellingFee(doctorid);
}


    @GetMapping(value = "/employee/findall", produces = "application/json")
    public List<Employee> findall() {
        return dao.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

//    get doctor list
    @GetMapping(value = "/employee/getdoctorlist", produces = "application/json")
    public List<Employee> doctorList() {
        return dao.getDoctorList();
    }

//    get doctor list who has scheduled availability in doctor availability table
    @GetMapping(value = "/employee/getavailabledoctorlist", produces = "application/json")
    public List<Employee> doctorAvailableList() {
        LocalDate currentDate = LocalDate.now();

        return dao.doctorAvailableList(currentDate);
    }


// get employee who dont have user account
@Transactional
@GetMapping(value = "/employee/empwithoutuseraccount" , produces = "application/json")
public List<Employee>getEmpwithoutUserAccount(){
        return dao.getEmployeeWithoutUserAccount();
}


// post mapping to add employee record to database
@Transactional
    @PostMapping(value = "/employee")
    public String save(@RequestBody Employee employee) {
//        authentication and authorization need to come
  Authentication auth= SecurityContextHolder.getContext().getAuthentication();
  HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }

        try {
            //            check nic exists in Database
            Employee extNic = dao.getEmployeeByNic(employee.getNic());

            if (extNic != null) {
                return "save not successful nic exists ";
            }

//            check email exist in database
            Employee extEmail = dao.getEmployeeByEmail(employee.getEmail());

            if (extEmail != null) {
                return "save not successful email exists ";
            }
//check mobile avialble on database
            Employee extEmpByMobile=dao.getEmployeeByMobile(employee.getMobile());
            if (extEmpByMobile != null) {
                return "save not successful mobile number exists ";
            }

//set added date time
            employee.setAddeddatetime(LocalDateTime.now());

//            get the next employee no from database and set to employee
            String nextEmpno = dao.getNextEmpno();

            if (nextEmpno.equals("") || nextEmpno.equals(null)) {
                employee.setEmpnumber("SSE00001");
            } else {
                employee.setEmpnumber(nextEmpno);     // emp no auto generated
            }
           Employee savedEmp= dao.save(employee);

//            send email
            EmailDetails emailDetails=new EmailDetails();
            emailDetails.setSendTo(employee.getEmail());
            emailDetails.setSubject(employee.getCallingname()+" Welcome to the Company!. Email regarding Employee Details.");

            String employeeHeader="<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head><body>";

            String messageTitle="<h1>Dear " + employee.getFullname() + ",\nWelcome to the company! We are excited to have you on board.<br>Following are the Details and ifthere" +
                    "are any changes please contact the manager</h1>";

            String messageEmployeeBody="<h6>Full Name : </h6><p>"+employee.getFullname()+"</p><br/>" +
                    "<h6>Employee Number  : </h6><p>"+employee.getEmpnumber()+"</p><br/>"+
                    "<h6>Nic : </h6><p>"+employee.getNic()+"</p><br/>"+
                    "<h6>Mobile Number : </h6><p>"+employee.getMobile()+"</p><br/>"+
                    "<h6>Land Number : </h6><p>"+employee.getLandno()+"</p><br/>"+
                    "<h6>Address : </h6><p>"+employee.getAddress()+"</p><br/>"+
                    "<h6>Gender : </h6><p>"+employee.getAddress()+"</p><br/>"+
                    "<h6>Civil Status : </h6><p>"+employee.getCivilstatus()+"</p><br/>"+
                    "<h6>Date Of Birth : </h6><p>"+employee.getDateofbirth()+"</p><br/>"+
                    "<h6>Employee Status : </h6><p>"+employee.getEmployeestatus_id().getName()+"</p><br/><br/>"+
                   "<h3>Best Regards SUWASETHA CLINIC </h3>";

            String messageEmployeeFooter="</body></html>";

            String emailEmployeeDetails=employeeHeader+messageTitle+messageEmployeeBody+messageEmployeeFooter;

            emailDetails.setMsgBody(emailEmployeeDetails);
            emailService.sendMail(emailDetails);


            User newUser=new User();
            newUser.setUsername(savedEmp.getEmpnumber());
            newUser.setEmail(savedEmp.getEmail());
            newUser.setPassword(bCryptPasswordEncoder.encode(savedEmp.getNic()));
            newUser.setStatus(true);
            newUser.setAddeddatetime(LocalDateTime.now());
            newUser.setEmployee_id(dao.getReferenceById(savedEmp.getId()));

            Set<Role> roles=new HashSet<Role>();
            roles.add(roleDao.getRoleByName(savedEmp.getDesignation_id().getName()));


            newUser.setRoles(roles);

            userDao.save(newUser);

            //           send email on user account create
            EmailDetails emailDetailsUser=new EmailDetails();
            emailDetailsUser.setSendTo(newUser.getEmail());
            emailDetailsUser.setSubject(newUser.getEmployee_id().getCallingname()+" Account Creation Confirmation.");


            String userMailHeader = "<!DOCTYPE html>" +
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

            String userMessageTitle = "<div class='text-center mb-3'>" +
                    "<h1>Dear " + newUser.getEmployee_id().getFullname() + ",</h1>" +
                    "<h4>We are excited to have you on board. Your account has been successfully created. Below are your account details</h4>" +
                    "</div>";

            String datePart= String.valueOf(newUser.getAddeddatetime());
            System.out.println(datePart.substring(0,10));

            String messageUserBody = "<div class='mb-3'>" +
                    "<p> User Name:" + newUser.getUsername() + "</p>" +
                    "<p>Password:" + savedEmp.getNic() + "</p>" +
                    "<p> Role :" + newUser.getRoles().iterator().next().getName() + "</p>" +
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
            String emailUserDetails = userMailHeader + userMessageTitle + messageUserBody + messageUserFooter;



//           email send
            emailDetailsUser.setMsgBody(emailUserDetails);
            emailService.sendMail(emailDetailsUser);

            return "OK";
        } catch (Exception e) {
            return "Save not successful" + e.getMessage();
        }


    }

    //delete mapping to change employee status
    @Transactional
    @DeleteMapping(value = "/employee")
    public String delete(@RequestBody Employee employee) {
//        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        //           check access to delete by providing logged user name an d module name

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
//        if user don't have access return error message
        if (!logUserPriv.get("delete")){
            return "Access denied ";
        }

        try {
//               check employee exist in database
            Employee extEmp = dao.getReferenceById(employee.getId());
            if (extEmp == null) {
                return "Employee not found";
            }


//        set employee status to deleted
            extEmp.setEmployeestatus_id(statusDao.getReferenceById(3));
//            set the deleted datetime
            extEmp.setDeletedatetime(LocalDateTime.now());
//            save the employee
            dao.save(extEmp);

//            need in-active user account
            User extUser=userDao.getUserByEmployeeId(extEmp.getId());

            if(extUser != null){
                extUser.setStatus(false);
                userDao.save(extUser);
            }

//            return OK
            return "OK";
        } catch (Exception e) {
//            if there are any exceptions return error message with exception
            return "Deleted not successful" + e.getMessage();
        }


    }



//    put method to update employee details
   @Transactional
    @PutMapping(value = "/employee")
    public String update(@RequestBody Employee employee){
//        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

//        check access
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }
//        check employee by employeeid
        Employee extEmp=dao.getReferenceById(employee.getId());
        if (extEmp==null){
            return "Employee doesn't exists ";
        }
//        check duplicate for mobile no
        Employee extEmpByMobile=dao.getEmployeeByMobile(employee.getMobile());

        if (extEmpByMobile!=null && extEmpByMobile.getId()!=employee.getId()){
            return "Entered Mobile number already exists";
        }
//        check duplicate for nic
        Employee extEmpByNic=dao.getEmployeeByNic(employee.getNic());
        if (extEmpByNic!=null && extEmpByNic.getId()!=employee.getId()){
            return "Entered Nic already exists";
        }
//        check duplicate for email
        Employee extEmpByEmail=dao.getEmployeeByEmail(employee.getEmail());
        if (extEmpByEmail!=null && extEmpByEmail.getId()!=employee.getId()){
            return "Entered Email already exists";
        }
       try {

           if (employee.getEmployeestatus_id().getId() == 2 || employee.getEmployeestatus_id().getId() == 3){
               //            need in-active user account
               User extUser=userDao.getUserByEmployeeId(employee.getId());

               if(extUser != null){
                   extUser.setStatus(false);
                   userDao.save(extUser);
               }
           }

//           send email
           EmailDetails emailDetails=new EmailDetails();
           emailDetails.setSendTo(employee.getEmail());
           emailDetails.setSubject(employee.getCallingname()+" Welcome to the Company!. Email regarding Employee Details.");


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
                   "</style>" +
                   "</head>" +
                   "<body>" +
                   "<div class='container'>";

           String messageTitle = "<div class='text-center mb-3'>" +
                   "<h1>Dear " + employee.getFullname() + ",</h1>" +
                   "<h4>Welcome to the company! We are excited to have you on board.<br>Following are your details. If there are any changes, please contact the manager.</h4>" +
                   "</div>";

           String messageEmployeeBody = "<div class='mb-3'>" +
                   "<p>Employee Number:" + employee.getEmpnumber() + "</p>" +
                   "<p>Full Name:" + employee.getFullname() + "</p>" +
                   "<p>Calling Name:" + employee.getCallingname() + "</p>" +
                   "<p>NIC:" + employee.getNic() + "</p>" +
                   "<p>Mobile Number:" + employee.getMobile() + "</p>" +
                   "<p>Land Number:" + employee.getLandno() + "</p>" +
                   "<p>Address:" + employee.getAddress() + "</p>" +
                   "<p>Gender:" + employee.getGender() + "</p>" +
                   "<p>Civil Status:" + employee.getCivilstatus() + "</p>" +
                   "<p>Date Of Birth:" + employee.getDateofbirth() + "</p>" +
                   "<p>Employee Status:" + employee.getEmployeestatus_id().getName() + "</p>" +
                   "</div>";

           String messageEmployeeFooter = "<div class='text-center mt-3'>" +
                   "<h3>Best Regards,<br>SUWASETHA CLINIC</h3>" +
                   "</div>" +
                   "</div>" +
                   "</body>" +
                   "</html>";

// Combine all parts into one email body
           String emailEmployeeDetails = employeeHeader + messageTitle + messageEmployeeBody + messageEmployeeFooter;



//           email send
           emailDetails.setMsgBody(emailEmployeeDetails);
           emailService.sendMail(emailDetails);

//           set update date time
          employee.setLastmodifydatetime(LocalDateTime.now());
          dao.save(employee);
          return "OK";
       }
       catch (Exception e){
           return "Update not successful"+e.getMessage();
       }
    }




}
