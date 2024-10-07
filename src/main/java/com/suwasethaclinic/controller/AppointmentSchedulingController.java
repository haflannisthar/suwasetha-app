package com.suwasethaclinic.controller;


import com.suwasethaclinic.Sms.SmsService;
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

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class AppointmentSchedulingController {

    @Autowired
    private AppointmentSchedullingDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private AvailableDateTimeDao dateTimeDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PatientDao patientDao;

    @Autowired
    private AppointmentStatusDao statusDao;

    @Autowired
    private SmsService smsService;

//complete appointmentList
    @GetMapping(value = "/appointment/findall" , produces = "application/json")
    public List<AppointmentScheduling> getAppointmentDetails(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }


//    get pending appointment list for appointment payment
@GetMapping(value = "/appointment/getpendingappointmentlist" , produces = "application/json")
public List<AppointmentScheduling> getPendingAppointmentListDetails(){



    return dao.getPendingAppointmentList();
}


    //    get ongoing appointment list for prescription payment
    @GetMapping(value = "/appointment/getongoingappointmentlist" , produces = "application/json")
    public List<AppointmentScheduling> getOngoingAppointmentListDetails(){


        return dao.getOngoingAppointmentListDetails();
    }


    //    get appointment list for dashboard
    @GetMapping(value = "/appointment/getallappointentfortheday/{userid}" , produces = "application/json")
    public List<AppointmentScheduling> getAppointmentListForCurrentDay(@PathVariable("userid") Integer userid){

        LocalDate currentDate = LocalDate.now();

        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


//        get the logged user 
        User loggedUser=userDao.getUserByUsername(auth.getName());

//        if the user role is admin then show all the appointment for current day
        for (Role r:loggedUser.getRoles()) {
            if (Objects.equals(r.getName(), "Admin") || Objects.equals(r.getName(), "Manager")){
               return dao.findAll(currentDate);
            }
        }

//        else show the appointment for the doctor current day
        return dao.getAppointmentListForCurrentDay(userid,currentDate);
    }

//    get appointment list for Prescription
    @GetMapping(value = "/appointment/getappointmentlist/{userid}" , produces = "application/json")
    public List<AppointmentScheduling> getAppointmentforprescription(@PathVariable("userid") Integer userid){

//        get the current time
        LocalDate currentDate = LocalDate.now();

//        get two variables one is plus 1 hour and other is minus 1 hour
        LocalTime currentTimePlusOneHour = LocalTime.now().plusHours(1);
        LocalTime currentTimeMinusOneHour = LocalTime.now().minusHours(1);
        LocalTime currentTime=LocalTime.now();




//        get the session closer to current time when there is only one session/ get the session list when there are multiple session with the closest start time and end time
//     *    example 1 [current time 18.00 , plusHour 19.00 , minusHour 17.00][session time is 19.00-21.00]
//        this check for startTime<=plus hour and end time>=minus hour [both should pass]
//        18:00<=19:00 [pass] and 21:00>=17:00 [pass] so get the session time
//     *   example 2 [current time 18:00 , plusHour 19:00 , minusHour 17:00][session time 20:00-23:00]
//        20:00<=19:00 [fail] and 23:00>=17:00 [pass] so return nothing
//     *   example 3 [current time 18:00 , plusHour 19:00 , minusHour 17:00][session time 14:00-16:00]
////        14:00<=19:00 [pass] and 16:00>=17:00 [fail] so return nothing
//               LocalTime currentsSession=dateTimeDao.getCurrentsSessionTime(userid,currentDate,currentTimePlusOneHour,currentTimeMinusOneHour);

//        if there are sessions that end time and other session start time are within 1 hour then get the list
        List<LocalTime> SessionTimes = dateTimeDao.getCurrentsSessionTime(userid, currentDate, currentTimePlusOneHour, currentTimeMinusOneHour);

        LocalTime currentsSession = null;
        Duration smallestDifference = Duration.ofHours(24);
        if (SessionTimes.size()==1){
            currentsSession=SessionTimes.get(0);
        }else{
            for(LocalTime session:SessionTimes){
                System.out.println("Sessions :"+session );
                Duration diff=Duration.between(currentTime,session).abs();
                if (diff.compareTo(smallestDifference) < 0) {
                    smallestDifference = diff;
                    System.out.println("smallestDifference"+smallestDifference);
                    currentsSession = session;
                    System.out.println("currentsSession" +currentsSession);
                }
            }
        }
        System.out.println("final currentsSession"+currentsSession);

//get the appointment that are in current session
        return dao.getAppointmentForPrescription(userid,currentDate,currentsSession);

    }


    //    /get count by doctor and date start time and end time
    @GetMapping(value = "/appointment/getstarttimebydoctor/{date}/{doctorid}/{starttimeforday}" , produces = "application/json")
    public Integer getStartTime(@PathVariable("date") LocalDate date, @PathVariable("doctorid") Integer doctorid,@PathVariable("starttimeforday") LocalTime starttimeforday){

//        get the end time for a session by doctor id , date , starttime
        LocalTime endTimeForDay=dateTimeDao.getEndTimeForGivenSession(date,doctorid,starttimeforday);

//
//        get the pending appointment count  by doctor and date and between start and end time
        return dao.getEndTimeByDoctorAndDate(date,doctorid,starttimeforday,endTimeForDay);

    }

    //    /get last added record end time
    @GetMapping(value = "/appointment/getlastappointmentendtime/{date}/{doctorid}/{starttimeforday}" , produces = "application/json")
    public LocalTime getLastAddedRecordEndTime(@PathVariable("date") LocalDate date, @PathVariable("doctorid") Integer doctorid,@PathVariable("starttimeforday") LocalTime starttimeforday){


//        get the last added pending status record end time  by doctor and date and between start and end time
        System.out.println(dao.getLastAddedRecordEndTimeActive(date,doctorid,starttimeforday));
        return dao.getLastAddedRecordEndTimeActive(date,doctorid,starttimeforday);
//        return dao.getLastAddedRecordEndTime(date,doctorid,starttimeforday);


    }

    //    /check session end time has reached or not by comparing session end time in available date time record to last record added time
    @GetMapping(value = "/appointment/checksessionendtime/{date}/{doctorid}/{starttimeforday}" , produces = "application/json")
    public Boolean checkSessionEndTime(@PathVariable("date") LocalDate date, @PathVariable("doctorid") Integer doctorid,@PathVariable("starttimeforday") LocalTime starttimeforday){


//        get the last added record end time  by doctor and date and between start and end time [appointment dao]
        LocalTime lastRecordAddedEndTime=dao.getLastAddedRecordEndTime(date,doctorid,starttimeforday);

//        get the session end time by date, doctor id , date in available date time
        LocalTime sessionEndTimeInAvailableDateTime=dateTimeDao.sessionEndTimeByDateDoctorAndSessionStartTime(date,doctorid,starttimeforday);

//      if  last added record end time is ahead of session end time so return true
//        else return false

        if (lastRecordAddedEndTime!=null){
            if (lastRecordAddedEndTime.isAfter(sessionEndTimeInAvailableDateTime)){
                return true;
            }else {
                return false;
            }
        }
       return false;

    }



    //   get the appointment count for a day by doctor name channelling date and session start time
    @GetMapping(value = "/appointment/getappointmentcountfordateandtime/{doctorid}/{date}/{starttimeforday}" , produces = "application/json")
    public Boolean getAppointmentTimeByDoctorName(@PathVariable("doctorid") Integer doctorid, @PathVariable("date") LocalDate date,@PathVariable("starttimeforday") LocalTime starttimeforday){
        return dao.getAppointmentTimeByDoctorName(doctorid, date, starttimeforday) > 0;

//         return dao.getAppointmentTimeByDoctorName(doctorname,date,starttimeforday);

    }



    //    /get start session time  list by doctor and date
//
    @GetMapping(value = "/appointment/getstartendtimebydoctor/{date}/{doctorid}" , produces = "application/json")
    public List<LocalTime> getStartEndTime(@PathVariable("date") LocalDate date, @PathVariable("doctorid") Integer doctorid){

//        session time List
        List<LocalTime> sessionTimes;

        List<LocalTime> AvailableTimes = new ArrayList<LocalTime>();

        LocalTime currenttime=LocalTime.now();
//if the selected date is equal current date then send the current time as a parameter so,
//        we can reject  the appointment(doctor availability) end time that has passed the current time
        if (date.isEqual(LocalDate.now())){
            System.out.println("15");
            sessionTimes= dateTimeDao.getStartAndEndTimeListForCurrentDate(date,doctorid,currenttime);


            for (LocalTime time:sessionTimes) {
                System.out.println(time);
//                get registered appointment count for a day
            Integer RegPatientCount=dao.getPatientCount(date,doctorid,time);
//            get the patient count for a given day
            Integer noOfPatient=dateTimeDao.getTotalPatientCountForADay(date,doctorid,time);
            if (noOfPatient>RegPatientCount){
                AvailableTimes.add(time);
            }


            }

            return AvailableTimes;
            


        }else{
            System.out.println("51");
            sessionTimes =dateTimeDao.getstartandedntimelist(date,doctorid);
            for (LocalTime time:sessionTimes) {
//                get registered appointment count for a day
                Integer RegPatientCount=dao.getPatientCount(date,doctorid,time);
//            get the patient count for a given day
                Integer noOfPatient=dateTimeDao.getTotalPatientCountForADay(date,doctorid,time);
//            check that the created appointment exceeded the limit
                if (noOfPatient>RegPatientCount){
                    AvailableTimes.add(time);
                }


            }

            return AvailableTimes;
        }


    }



//    get the appointment added date time to set transfer date time min value
@GetMapping(value = "/appointment/getaddeddatetime/{appointmentid}" , produces = "application/json")
public LocalDateTime getAppointmentAddedDateTime(@PathVariable("appointmentid") Integer appointmentid){
    return dao.getAppointmentAddedDateTime(appointmentid);

}

    //    get the appointment  time to set transfer date time max value
    @GetMapping(value = "/appointment/getappointmenttime/{appointmentid}" , produces = "application/json")
    public AppointmentScheduling getAppointmentTime(@PathVariable("appointmentid") Integer appointmentid){
        return dao.getAppointmentTime(appointmentid);

    }

    //    get the total created appointment count by doctor id , channelling date, session start time
    @GetMapping(value = "/appointment/gettotalcreatedappointment/{doctorid}/{date}/{starttime}" , produces = "application/json")
    public Integer getTotalCreatedAppointmentCount(@PathVariable("doctorid") Integer doctorid,@PathVariable("date") String date,@PathVariable("starttime") String starttime){
        System.out.println(dao.getTotalCreatedAppointmentCount(doctorid,LocalDate.parse(date),LocalTime.parse(starttime)));
        return dao.getTotalCreatedAppointmentCount(doctorid,LocalDate.parse(date),LocalTime.parse(starttime));

    }



//ui setting
    @Transactional
    @GetMapping(value = "/appointment" )
    public ModelAndView appointmentUI(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        User loggeduser=userDao.getUserByUsername(auth.getName());
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);
        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename","Appointment Scheduling");
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());

        viewUI.addObject("title","Appointment Scheduling");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Appointment Scheduling");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
           return  viewUI;
        }
        else {
            viewUI.setViewName("appointment.html");
            return  viewUI;
        }



    }

    //ui setting
    @Transactional
    @GetMapping(value = "/appointment", params ={"appdate","doctorfullname","starttime"})
    public ModelAndView appUIByAppointmentDateDoctor(@RequestParam("appdate") String appdate,@RequestParam("doctorfullname") String doctorfullname,@RequestParam("starttime") String starttime){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        User loggeduser=userDao.getUserByUsername(auth.getName());
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename","Appointment Scheduling");
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());

        viewUI.addObject("title","Appointment Scheduling");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Appointment Scheduling");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("appointment.html");
            return  viewUI;
        }



    }

//    save appointment into database
    @Transactional
    @PostMapping(value = "/appointment")
    public String save(@RequestBody AppointmentScheduling appointmentScheduling){


        //        authentication and authorization need to come
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Appointment Scheduling");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }



        //        get the end time of a session by doctor id , date , starttime
//        date,doctorid,starttimeforday
        LocalTime endTimeForSession=dateTimeDao.getEndTimeForGivenSession(appointmentScheduling.getChannellingdate(),appointmentScheduling.getEmployee_id().getId(),appointmentScheduling.getSessionstarttime());


//        get the count for a session by providing doctor id date and appointment between the sart and end time of the session
        int count=dao.getcount(appointmentScheduling.getChannellingdate(),appointmentScheduling.getEmployee_id().getId(),appointmentScheduling.getSessionstarttime(),endTimeForSession);

        int patientCount=dateTimeDao.getPatientCount(appointmentScheduling.getChannellingdate(),appointmentScheduling.getEmployee_id().getId(),appointmentScheduling.getSessionstarttime(),endTimeForSession);

        if (count>patientCount){
            return "maximum patient count reached \n doctor "+appointmentScheduling.getEmployee_id().getFullname()+"\n date"+appointmentScheduling.getChannellingdate()
                    +"\n session time "+ appointmentScheduling.getSessionstarttime()+"-"+endTimeForSession;
        }

        try {
//            get the next appointment no
            String  nextAppNo=dao.getNextAppNo();
//if the appointment no is null then set the year part (2025) +'000001'
            if (nextAppNo==null){
                nextAppNo= LocalDate.now().getYear()+"000001";

            }
            appointmentScheduling.setAppno(nextAppNo);


            Integer LastChannellingNo=dao.getLastChannellingNo(appointmentScheduling.getChannellingdate(),appointmentScheduling.getEmployee_id().getId(),appointmentScheduling.getSessionstarttime(),endTimeForSession);

            if (LastChannellingNo == null){
                appointmentScheduling.setChannaliingno(1);
            }else {
                appointmentScheduling.setChannaliingno(LastChannellingNo+1);
            }

            appointmentScheduling.setAddeddatetime(LocalDateTime.now());
            appointmentScheduling.setAddeduser(userDao.getUserByUsername(auth.getName()).getId());


               //send sms
                String smsBody="Your Appointment is scheduled for the day "+appointmentScheduling.getChannellingdate()+"\nDoctor name "+appointmentScheduling.getEmployee_id().getCallingname()+"\n Appointment Time "+appointmentScheduling.getStarttime()+"\n Appointment Number "+appointmentScheduling.getAppno()+"\n" +
                        "Please be there 20 minutes before the Appointment time";
                smsService.sendSms("+94720365294", smsBody);





            dao.save(appointmentScheduling);
            return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }
    }


    //delete mapping to change appointment status
    @Transactional
    @DeleteMapping(value = "/appointment")
    public String delete(@RequestBody AppointmentScheduling appointmentScheduling) {
//        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Appointment Scheduling");
        if (!logUserPriv.get("delete")){
            return "Access denied ";
        }

        try {
//               check appointment exist in database
            AppointmentScheduling extApp = dao.getReferenceById(appointmentScheduling.getId());
            if (extApp == null) {
                return "Appointment not found";
            }

//            get the channelling date
            LocalDate sessionDate=extApp.getChannellingdate();
//            get the session start time
            LocalTime sessionStartTime=extApp.getSessionstarttime();


//            current time
            LocalDateTime currentDateTime = LocalDateTime.now();
//            combine session date and end time
            LocalDateTime sessionStartDateTime = sessionDate.atTime(sessionStartTime);



//            session is in the future so reassign
            if (sessionDate.isAfter(LocalDate.now()) || (sessionDate.equals(LocalDate.now()) && currentDateTime.isBefore(sessionStartDateTime))){
//get all appointment that is after the deleted appointment
                List<AppointmentScheduling> appointmentList=dao.getAppointmentListAfterDeletedAppointment(sessionDate, sessionStartTime,extApp.getStarttime(), extApp.getEmployee_id().getId());

                if (!appointmentList.isEmpty()){
                    // Reassign the appointments
                    LocalTime nextStartTime = extApp.getStarttime();
                    for (AppointmentScheduling appointment : appointmentList) {
                        appointment.setStarttime(nextStartTime);
                        nextStartTime = nextStartTime.plusMinutes(10);
                        appointment.setEndtime(nextStartTime);
                        dao.save(appointment);
                    }
                }



            }
//            else if (sessionDate.isAfter(LocalDate.now())) {
//
//                List<AppointmentScheduling> appointmentList=dao.getAppointmentListAfterDeletedAppointment(sessionDate, sessionStartTime,extApp.getStarttime(), extApp.getEmployee_id().getId());
//
//                if (!appointmentList.isEmpty()){
//                    // Reassign the appointments
//                    LocalTime nextStartTime = extApp.getStarttime();
//                    for (AppointmentScheduling appointment : appointmentList) {
//                        appointment.setStarttime(nextStartTime);
//                        nextStartTime = nextStartTime.plusMinutes(10);
//                        appointment.setEndtime(nextStartTime);
//                        dao.save(appointment);
//                    }
//                }
//            }

            extApp.setAppstatus_id(statusDao.getReferenceById(4));
            dao.save(extApp);





            return "OK";
        } catch (Exception e) {
            return "Deleted not successful" + e.getMessage();
        }


    }

//update appointment
@Transactional
@PutMapping(value = "/appointment")
public String update(@RequestBody AppointmentScheduling appointmentScheduling){

    //        authentication and authorization need to come
    Authentication auth= SecurityContextHolder.getContext().getAuthentication();
    HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Appointment Scheduling");
    if (!logUserPriv.get("update")){
        return "Access denied ";
    }

    AppointmentScheduling extapp=dao.getReferenceById(appointmentScheduling.getId());

    if (extapp==null){
        return "Appointment doesn't exists";
    }

//    check whether there is an appointment created for that doctor , channelling date, start time and end time
    AppointmentScheduling extAppByStartAndEndTime=dao.checkAppByStartAndEndTime(appointmentScheduling.getEmployee_id().getId(),appointmentScheduling.getChannellingdate(),appointmentScheduling.getStarttime(),appointmentScheduling.getEndtime());

//    check that the objects status is not equal to deleted
    if (appointmentScheduling.getAppstatus_id().getId()!=4){
//        extAppByStartAndEndTime is not null and extAppByStartAndEndTime id is not equal to appointmentScheduling id which means both are different object
             if (extAppByStartAndEndTime!=null && extAppByStartAndEndTime.getId()!= appointmentScheduling.getId()){
//                 return the error message that saying appointment created for that time so cannot update
                 return "Update not successful.\n Another Appointment has created for that time. \n Please create new Appointment";
             }
    }

    try {


        appointmentScheduling.setUpdatedatetime(LocalDateTime.now());
        appointmentScheduling.setUpdateuser(userDao.getUserByUsername(auth.getName()).getId());
//
//send sms only if the channelling date or session time is changed
        if (!appointmentScheduling.getChannellingdate().equals(extapp.getChannellingdate())  || !extapp.getSessionstarttime().equals(appointmentScheduling.getSessionstarttime()) ){
//            send sms
            String smsBody="Your Appointment is Rescheduled for date "+appointmentScheduling.getChannellingdate()+"\n Appointment Time "+appointmentScheduling.getStarttime()+"\n" +
                    "Please be there 20 minutes before the Appointment time";
               smsService.sendSms("+94720365294", smsBody);
        }



        dao.save(appointmentScheduling);
        return "OK";
    }
    catch (Exception e){
        return "save not successful"+e.getMessage();
    }
}
}
