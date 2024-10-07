package com.suwasethaclinic.controller;


import com.suwasethaclinic.Email.EmailDetails;
import com.suwasethaclinic.Email.EmailService;
import com.suwasethaclinic.dao.*;
import com.suwasethaclinic.entity.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class DoctorAvailabilityController {

    @Autowired
    private DoctorAvailabilityDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private AvailableDateTimeDao dateTimeDao;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmployeeDao employeeDao;


    @Autowired
    private AppointmentSchedullingDao appointmentSchedullingDao;


//    data for table
@GetMapping(value = "/doctoravailability/findall" , produces = "application/json")
public List<DoctorAvailability> findalldata(){

    return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
}
//all available date list for appointment reporting
//    @GetMapping(value = "/availabeldatetime/getavailabledatelistforreport" , produces = "application/json")
//    public List<LocalDate> getAllAvailableDateList(){
//
//        return dateTimeDao.getAllAvailableDateList();
//    }

//get the end date of last record of doctor by id
@GetMapping(value = "/doctoravailability/getenddatebydoctorid/{doctorid}" ,produces = "application/json")
public LocalDate getlastrecordenddate(@PathVariable("doctorid") Integer doctorid){
    return dao.getlastrecordenddate(doctorid);
}



    //get the record of doctor by id and doctor availability between current date and one week ahead of current date
    @GetMapping(value = "/doctoravailability/getdetailsbydoctorid/{doctorid}", produces = "application/json")
    public List<LocalDate> getdoctoravailablerecord(@PathVariable("doctorid") Integer doctorid) {

        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        LocalDate oneweek = currentDate.plusDays(7);

        List<LocalDate> availableDates = new ArrayList<>();

        List<AvailableDateandTime> channellingDates = dao.getdoctoravailablerecord(doctorid, currentDate, oneweek);

        for (AvailableDateandTime date : channellingDates) {
            System.out.println(date.getAvailabledate() + " " + date.getStartingtime());

            Integer appCount = appointmentSchedullingDao.getTotalCreatedAppointmentCount(doctorid, date.getAvailabledate(), date.getStartingtime());

            if (appCount < date.getNoofpatients()) {
                if (date.getAvailabledate().isEqual(currentDate)) {
                    // Check if the current time is before the session end time
                    if (currentTime.isBefore(date.getEndtime())) {
                        if (!availableDates.contains(date.getAvailabledate())) {
                            availableDates.add(date.getAvailabledate());
                        }
                    }
                } else {
                    // For dates other than the current date
                    if (!availableDates.contains(date.getAvailabledate())) {
                        availableDates.add(date.getAvailabledate());
                    }
                }
            }
        }

        return availableDates;
    }



    @GetMapping(value = "/doctoravailability/getavailabledatetimebydoctoridanddate/{doctorid}/{date}" , produces = "application/json")
    public List<AvailableDateandTime> getAvailableDateAndTimeByDoctorDate(@PathVariable("doctorid") Integer doctorid,@PathVariable("date") String date){
                return  dateTimeDao.getAvailableDateAndTimeByDoctorDate(LocalDate.parse(date),doctorid);
    }


    //ui setting
    @Transactional
    @GetMapping(value = "/doctoravailability" )
    public ModelAndView doctorAvailabilityUI(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        User loggeduser=userDao.getUserByUsername(auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("modulename","Doctor Availability");
        viewUI.addObject("title","Doctor Availability");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Doctor Availability");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
           return  viewUI;
        }
        else {
            viewUI.setViewName("doctoravailability.html");
            return  viewUI;
        }



    }


    // post mapping to add doctor availability record to database
    @Transactional
    @PostMapping(value = "/doctoravailability")
    public String save(@RequestBody DoctorAvailability doctorAvailability) {
//        authentication and authorization need to come
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Doctor Availability");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }


        try {
            System.out.println("1");
//        check that the schedule available in database

            DoctorAvailability extAvailability=dao.getdoctoravailability(doctorAvailability.getEmployee_id().getId(),doctorAvailability.getStartdate());


            if (extAvailability!=null){

                String extStartDate= String.valueOf(extAvailability.getStartdate());
                String extEndDate= String.valueOf(extAvailability.getEnddate());


                return "Following Doctor Availability Schedule already available\n Start date : "+extStartDate +"  End date : "+extEndDate;
            }
            System.out.println(doctorAvailability.getStartdate()+" "+doctorAvailability.getEnddate());

            for (AvailableDateandTime adt:doctorAvailability.getAvailableDateandTimeList()){
                adt.setDoctoravailability_id(doctorAvailability);
            }

            doctorAvailability.setAddeddatetime(LocalDateTime.now());
            doctorAvailability.setAddeduser(userDao.getUserByUsername(auth.getName()).getId());


            dao.save(doctorAvailability);


            //           send email
            EmailDetails emailDetails=new EmailDetails();

//            get the ext doctor
            Employee extDoctor=employeeDao.getReferenceById(doctorAvailability.getEmployee_id().getId());

            emailDetails.setSendTo(extDoctor.getEmail());
            emailDetails.setSubject("Your Schedule for the Upcoming Week at SuwaSetha Clinic Kuruwita");


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
                    "    .import_note { color: #880808;}" +
                    "    table { width: 100%; border-collapse: collapse; }" +
                    "    th, td { padding: 10px; border: 1px solid #ddd; }" +
                    "    th { background-color: #f3f3f3; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>";

            String messageTitle = "<div class='text-center mb-3'>" +
                    "<h1>Dear " + doctorAvailability.getEmployee_id().getCallingname() + ",</h1>" +
                    "<h4>We hope this message finds you well. Please find below your schedule for the upcoming week: </h4>" +
                    "</div>";


            String messageBody = "<div class='mb-3'>" +
                    "<p> Start Date :  " + doctorAvailability.getStartdate() + "</p>" +
                    "<p>End Date : " + doctorAvailability.getEnddate() + "</p>" +
                    "<p>Note : " + doctorAvailability.getNote() + "</p>" +
                    "</div><div class='text-center mb-3'><h4>Schedule</h4></div><div class='text-center mb-3'><table border=1>" +
                    "<tr><th>Date</th><th>Start Time</th><th>End Time</th></tr>";

       String scheduleList="";
            for (AvailableDateandTime avd:doctorAvailability.getAvailableDateandTimeList()) {
                scheduleList=scheduleList+"<tr><td>"+avd.getAvailabledate()+"</td><td>"+avd.getStartingtime()+"</td><td>"+avd.getEndtime()+"</td></tr>";
            }


            String messageFooter ="</table></div><div class='text-center mb-3'>" +
                    "<h4 style='color:#343a40'>If you have any questions or need to make any adjustments to your schedule, please do not hesitate to contact us.<br/>" +
                    "</h4>" +
                    "<h4 style='color:#343a40'>Thank you for your dedication and hard work. We look forward to another successful week!<br/>" +
                    "</h4>" +
                    "</div>"+
                    "<div class='text-center mt-3'>" +
                    "<h3>Best Regards,<br>SUWASETHA CLINIC</h3>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

// Combine all parts into one email body
            String emailDocAvailDetails = messageHeader + messageTitle + messageBody+ scheduleList+messageFooter;



//           email send
            emailDetails.setMsgBody(emailDocAvailDetails);
            emailService.sendMail(emailDetails);

            return "OK";



        } catch (Exception e) {
            return "Save not successful" + e.getMessage();
        }


    }


    // put mapping to update doctor availability record to database
    @Transactional
    @PutMapping(value = "/doctoravailability")
    public String update(@RequestBody DoctorAvailability doctorAvailability){
        //        authentication and authorization need to come
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Doctor Availability");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }

        DoctorAvailability extdoctoravailability=dao.getReferenceById(doctorAvailability.getId());

        if (extdoctoravailability==null){
            return "Doctor availability doesn't exists";
        }

//        check for duplicate availability record
        DoctorAvailability extAvailability=dao.getdoctoravailability(doctorAvailability.getEmployee_id().getId(),doctorAvailability.getStartdate());


        if (extAvailability!=null && extAvailability.getId()!=doctorAvailability.getId()){

            String extStartDate= String.valueOf(extAvailability.getStartdate());
            String extEndDate= String.valueOf(extAvailability.getEnddate());



            return "Following Doctor Availability Schedule already available\n Start date : "+extStartDate +"  End date : "+extEndDate;
        }

        try {
            for (AvailableDateandTime adt:doctorAvailability.getAvailableDateandTimeList()){
                adt.setDoctoravailability_id(doctorAvailability);
            }

            doctorAvailability.setUpdatedatetime(LocalDateTime.now());
            doctorAvailability.setUpdateuser(userDao.getUserByUsername(auth.getName()).getId());


            dao.save(doctorAvailability);


            return "OK";
        }
        catch (Exception e){
            return "Update not successful "+e.getMessage();

        }




    }



}
