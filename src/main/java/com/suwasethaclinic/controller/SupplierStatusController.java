package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.DrugStatusDao;
import com.suwasethaclinic.dao.SupplierStatusDao;
import com.suwasethaclinic.entity.DrugStatus;
import com.suwasethaclinic.entity.SupplierStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SupplierStatusController {

    @Autowired
    private SupplierStatusDao dao;



    @GetMapping(value = "/supplierstatus/list" , produces = "application/json")
    public List<SupplierStatus>findall(){

        return dao.findAll();
    }

}
