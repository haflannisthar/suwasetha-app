package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BankDao;
import com.suwasethaclinic.dao.CityDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Bank;
import com.suwasethaclinic.entity.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CityController {

    @Autowired
    private CityDao dao;


    @GetMapping(value = "/city/findall" , produces = "application/json")
    public List<City>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }


//    filter by city
    @GetMapping(value = "/filtercitybybank/{bankId}" , produces = "application/json")
    public  List<City> filterCityByBank(@PathVariable("bankId") Integer bankId){
         return dao.filterCityByBank(bankId);
    }


}
