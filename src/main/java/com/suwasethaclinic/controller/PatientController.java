package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.*;
import com.suwasethaclinic.entity.AppointmentScheduling;
import com.suwasethaclinic.entity.Patient;
import com.suwasethaclinic.entity.Role;
import com.suwasethaclinic.entity.User;
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
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class PatientController {

    @Autowired
    private PatientDao dao;

    @Autowired
    private  PrivilegeController privilegeController;
    @Autowired
    private PatientStatusDao statusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private AppointmentSchedullingDao appointmentSchedullingDao;

    @Autowired
    private AppointmentStatusDao appointmentStatusDao;

    @GetMapping(value = "/patient/findall" , produces = "application/json")
    public List<Patient>findAll(){

        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

//    get active patient list
    @GetMapping(value = "/patient/list" , produces = "application/json")
    public List<Patient>activePlist(){

        return dao.activePlist();
    }

    //    get active patient list by contact number
    @GetMapping(value = "/patient/getPatientList/{contactno}" , produces = "application/json")
    public List<Patient>activePlistByContactNumber(@PathVariable("contactno") String contactno){

        return dao.activePlistByContactNumber(contactno);
    }

//contact Number list
    @GetMapping(value = "/patient/contactlist" , produces = "application/json")
    public List<Patient>activePlistContactNumber(){

        return dao.activePlistContactNo();
    }

//    get the patient date of birth by appointment id and return it
@GetMapping(value = "/patient/getdob/{appid}", produces = "application/json")
public LocalDate patientAge(@PathVariable("appid") Integer appid){

        return   dao.getPatientDob(appid);
}


    @GetMapping(value = "/patient")
    public ModelAndView patientUI(){
        ModelAndView viewUi=new ModelAndView();
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUi.addObject("roles", roles);

        User loggeduser=userDao.getUserByUsername(auth.getName());
        viewUi.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUi.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewUi.addObject("loggedusername",auth.getName());
        viewUi.addObject("modulename","Patient");
        viewUi.addObject("title","Patient");


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Patient");
        if (!logUserPriv.get("select")){
            viewUi.setViewName("errorpage.html");
            return viewUi;
        }
        else {
            viewUi.setViewName("patient.html");
            return viewUi;
        }

    }

    @Transactional
    @PostMapping(value = "/patient")
    public  String patientSave(@RequestBody Patient patient){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Patient");
        if (!logUserPriv.get("insert")){
            return "access denied";
        }


        try {





            //get the next patient reg no from database
            String nextPatNo=dao.getNextPatNumber();
            if (nextPatNo.equals("") || nextPatNo.equals(null)) {
                patient.setRegno("PR000001");
            } else {
                patient.setRegno(nextPatNo);
            }
            patient.setAddeddatetime(LocalDateTime.now());
//            get the logged user
            User loggedUser=userDao.getUserByUsername(auth.getName());
            patient.setUser_id(loggedUser);

            dao.save(patient);
            return "OK";
        }
        catch (Exception e){
            return "something went wrong" +e.getMessage();
        }

    }

    //function to change the patient status to delete.
    @Transactional
    @DeleteMapping(value = "/patient")
    public String patientDelete(@RequestBody Patient patient){
        //        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

//get the privilege for given module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Patient");
        if (!logUserPriv.get("delete")){
            return "Access denied ";
        }
        try {
//            check the patient in db by id
            Patient extPat=dao.getReferenceById(patient.getId());
            if (extPat==null){
                return "Patient not found";
            }
            patient.setDeleteddatetime(LocalDateTime.now());

//            get logged user
            User loggeduser=userDao.getUserByUsername(auth.getName());
            patient.setUser_id(loggeduser);


            List<AppointmentScheduling> extAppointmentList=appointmentSchedullingDao.getPendingAppointmentByPatientId(patient.getId());

            for (AppointmentScheduling ap:extAppointmentList) {
                ap.setAppstatus_id(appointmentStatusDao.getReferenceById(4));
                appointmentSchedullingDao.save(ap);
            }


            dao.save(patient);
            return "OK";
        }
        catch (Exception e){
            return "something went wrong"+e.getMessage();
        }
    }

    @Transactional
    @PutMapping(value = "/patient")
    public String patientUpdate(@RequestBody Patient patient){
        //        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

//get the privilege for given module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Patient");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }
//        check patient available on database by id
        Patient extPat=dao.getReferenceById(patient.getId());
        if (extPat==null){
            return "patient not found";

        }

        try {

           patient.setLastmodifydatetime(LocalDateTime.now());
           dao.save(patient);
           return "OK";

        }
        catch (Exception e){
            return "something went wrong "+e.getMessage();
        }
    }


}
