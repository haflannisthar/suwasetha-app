package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.DrugStatusDao;
import com.suwasethaclinic.dao.PurchaseDrugStatusDao;
import com.suwasethaclinic.entity.DrugStatus;
import com.suwasethaclinic.entity.PurchaseDrugStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PurchaseDrugStatusController {

    @Autowired
    private PurchaseDrugStatusDao dao;



    @GetMapping(value = "/purchasedrugstatus/list" , produces = "application/json")
    public List<PurchaseDrugStatus>findall(){

        return dao.findAll();
    }




}
