package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.DrugStatusDao;
import com.suwasethaclinic.dao.PatientStatusDao;
import com.suwasethaclinic.entity.DrugStatus;
import com.suwasethaclinic.entity.PatientStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DrugStatusController {

    @Autowired
    private DrugStatusDao dao;



    @GetMapping(value = "/drugstatus/list" , produces = "application/json")
    public List<DrugStatus>findall(){

        return dao.findAll();
    }

}
