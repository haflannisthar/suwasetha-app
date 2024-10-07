package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BankDao;
import com.suwasethaclinic.dao.BranchDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Bank;
import com.suwasethaclinic.entity.Branch;
import com.suwasethaclinic.entity.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BranchController {

    @Autowired
    private BranchDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/branch/findall" , produces = "application/json")
    public List<Branch>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    //    filter branch by city and bank
    @GetMapping(value = "/filterbranchbybankcity/{bankId}/{cityId}" , produces = "application/json")
    public  List<Branch> filterBranchByBankCity(@PathVariable("bankId") Integer bankId,@PathVariable("cityId") Integer cityId){
        return dao.filterBranchByBankCity(bankId,cityId);
    }

}
