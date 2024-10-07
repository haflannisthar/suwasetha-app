package com.suwasethaclinic.controller;



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
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class PrescriptionController {

    @Autowired
    private PrescriptionDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private AppointmentSchedullingDao appointmentDao;

    @Autowired
    private AppointmentStatusDao appointmentStatusDao;




@Autowired
private BatchDao batchDao;




    @GetMapping(value = "/prescription/findall" , produces = "application/json")
    public List<Prescription> getallprescription(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

//    prescription list for payment  where prescription has drugs to buy from  in house pharmacy
    @GetMapping(value = "/prescription/getprescriptionlistforpayment" , produces = "application/json")
    public List<Prescription> getPrescriptionForPayment(){

        return dao.getPrescriptionForPayment();
    }

//get the prescription by doctor id to fill in the prescription table
    @GetMapping(value = "/prescription/prescriptionbydoctor/{doctorid}" , produces = "application/json")
    public List<Prescription> getPrescriptiondetailsbydoctor(@PathVariable("doctorid") Integer doctorid){

        List<Role> roles=userDao.getRoleNameById(doctorid);
        for (Role r:roles) {
            if (Objects.equals(r.getName(), "Admin")){
                return  dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
            }
        }
        return dao.getPrecriptionbyDoctorId(doctorid);


    }


    //disable refill button after 30 minutes fro added time
    @GetMapping(value = "/prescription/disableeditbtnbycode/{prescriptioncode}" , produces = "application/json")
    public Boolean disableEditBtnAfterThirtyMinsFromAddedTime(@PathVariable("prescriptioncode") String prescriptioncode){

//        get current date time
        LocalDateTime currentDateTime=LocalDateTime.now();
//get the prescription by code
         Prescription extPrescription=dao.disableEditBtnAfterThirtyMinsFromAddedTime(prescriptioncode);

         //extract the date part
        LocalDate prescriptionDate=extPrescription.getAddeddatetime().toLocalDate();
        LocalDate currentDate=currentDateTime.toLocalDate();

//        check the prescription added date is equal to current date
        if (currentDate.equals(prescriptionDate)) {
//            get the duration difference
            Duration diffBetween=Duration.between(extPrescription.getAddeddatetime(), currentDateTime);
//            get in minutes
            long minutesDiff=diffBetween.toMinutes();
            System.out.println("minutes diff"+minutesDiff);
            return minutesDiff < 30;
        }

         return false;
    }

    //get the prescription has sales drug list in house drug list  by prescription no
    @GetMapping(value = "/prescription/getprescriptionHouseDrugList/{prescriptionno}" , produces = "application/json")
    public List<PrescriptionHasSalesDrug> getPrescriptionInHouseDrugList(@PathVariable("prescriptionno") String prescriptionno){


        return dao.getPrescriptionInHouseDrugList(prescriptionno);


    }

//ui setting
    @Transactional
    @GetMapping(value = "/prescription" )
    public ModelAndView prescriptionui(){
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
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewUI.addObject("modulename","Prescription");
        viewUI.addObject("title","Prescription");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Prescription");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
           return  viewUI;
        }
        else {
            viewUI.setViewName("prescription.html");
            return  viewUI;
        }



    }

//    save new prescription into database
    @Transactional
   @PostMapping(value = "/prescription")
    public String savePrescription(@RequestBody Prescription prescription){
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Prescription");

        if (!logUserPriv.get("insert")){
            return "access denied";
        }
        String nextCode=dao.getnextcode();

        if (nextCode==null || nextCode.isEmpty()){
            prescription.setCode("SPR00001");
        }else{
            prescription.setCode(nextCode);

        }






        try {

                int counter=0;

//                counter is zero at start and if there drugs written for inside pharmacy counter will be increased
//            if counter is zero then no in house pharmacy drug were written so appointment change to completed else ongoing
            for (PrescriptionHasSalesDrug pr :prescription.getPrescriptionHasSalesDrugList()){

                if (pr.getInpharmacyoroutside()){
                    counter++;
                }
                 }
            //        get the appointment
            AppointmentScheduling extAppointment=appointmentDao.getReferenceById(prescription.getAppointment_id().getId());

            if (counter == 0){
                //        change the status to completed
                extAppointment.setAppstatus_id(appointmentStatusDao.getReferenceById(3));

            }else{
                //        change the status to on going
                extAppointment.setAppstatus_id(appointmentStatusDao.getReferenceById(2));

            }

            appointmentDao.save(extAppointment);



            for (PrescriptionHasSalesDrug pr :prescription.getPrescriptionHasSalesDrugList()){
                pr.setPrescription_id(prescription);


            }

            prescription.setAddeddatetime(LocalDateTime.now());
            dao.save(prescription);
            return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }

    }

//update prescription record
    @Transactional
    @PutMapping (value = "/prescription")
    public String update(@RequestBody Prescription prescription){
        //        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Prescription");

        if (!logUserPriv.get("update")){
            return "access denied";
        }
//check prescription available on database by id
        Prescription extPrescription=dao.getReferenceById(prescription.getId());
        if (extPrescription==null){
            return "Prescription doesn't exists";
        }

        //        get current date time
        LocalDateTime currentDateTime=LocalDateTime.now();

        //extract the date part
        LocalDate prescriptionDate=extPrescription.getAddeddatetime().toLocalDate();
        LocalDate currentDate=currentDateTime.toLocalDate();

//        check the prescription added date is equal to current date
        if (currentDate.equals(prescriptionDate)) {
//            get the duration difference
            Duration diffBetween=Duration.between(extPrescription.getAddeddatetime(), currentDateTime);
//            get in minutes
            long minutesDiff=diffBetween.toMinutes();
            System.out.println("minutes diff"+minutesDiff);

            if (minutesDiff >= 30){
                return "Update not Successful. Allowed Update Time Has Passed";

            }

        }


//
        try {
            int counter=0;

//                counter is zero at start and if there drugs written for inside pharmacy counter will be increased
//            if counter is zero then no ishouse pharmacy drug were written so appointment change to completed else ongoing
            for (PrescriptionHasSalesDrug pr :prescription.getPrescriptionHasSalesDrugList()){

                if (pr.getInpharmacyoroutside()){
                    counter++;
                }
            }
            //        get the appointment
            AppointmentScheduling extAppointment=appointmentDao.getReferenceById(prescription.getAppointment_id().getId());


            if (counter == 0){
                //        if appointment is not null change the status to on going
                if (extAppointment!=null ){
                    extAppointment.setAppstatus_id(appointmentStatusDao.getReferenceById(3));

                }
            }else{

                if (extAppointment!=null){
                    extAppointment.setAppstatus_id(appointmentStatusDao.getReferenceById(2));

                }
            }



            appointmentDao.save(extAppointment);



            for (PrescriptionHasSalesDrug pr :prescription.getPrescriptionHasSalesDrugList()){
                pr.setPrescription_id(prescription);


            }



            prescription.setUpdatedatetime(LocalDateTime.now());
            dao.save(prescription);
            return "OK";
        }
        catch (Exception e){
            return "update not successful"+e.getMessage();
        }


    }



}
