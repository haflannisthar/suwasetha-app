package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.DesignationDao;
import com.suwasethaclinic.dao.PatientStatusDao;
import com.suwasethaclinic.entity.Designation;
import com.suwasethaclinic.entity.PatientStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

@RestController
public class PatientStatusController {

    @Autowired
    private PatientStatusDao dao;



    @GetMapping(value = "/patientstatus/list" , produces = "application/json")
    public List<PatientStatus>findall(){

        return dao.findAll();
    }

}
