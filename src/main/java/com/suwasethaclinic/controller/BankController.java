package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BankDao;
import com.suwasethaclinic.dao.BrandDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Bank;
import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

@RestController
public class BankController {

    @Autowired
    private BankDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/bank/findall" , produces = "application/json")
    public List<Bank>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }



}
