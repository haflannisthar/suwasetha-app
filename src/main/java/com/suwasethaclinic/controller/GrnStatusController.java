package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.DrugStatusDao;
import com.suwasethaclinic.dao.GrnStatusDao;
import com.suwasethaclinic.entity.DrugStatus;
import com.suwasethaclinic.entity.GrnStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GrnStatusController {

    @Autowired
    private GrnStatusDao dao;



    @GetMapping(value = "/grnstatus/list" , produces = "application/json")
    public List<GrnStatus>findall(){

        return dao.findAll();
    }

}
