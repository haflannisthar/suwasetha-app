package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BrandDao;
import com.suwasethaclinic.dao.UnitTypeDao;
import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.UnitType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UnitTypeController {

    @Autowired
    private UnitTypeDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/unittype/list" , produces = "application/json")
    public List<UnitType>findAll(){
        return dao.findAll();
    }

}
