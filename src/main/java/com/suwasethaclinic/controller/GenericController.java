package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BrandDao;
import com.suwasethaclinic.dao.GenericDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.Generic;
import com.suwasethaclinic.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class GenericController {

    @Autowired
    private GenericDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/generic/list" , produces = "application/json")
    public List<Generic>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }


    //ui setting
    @Transactional
    @GetMapping(value = "/generic" )
    public ModelAndView genericui(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

//        System.out.println(auth.getAuthorities());

//        Collection<? extends GrantedAuthority> roles = auth.getAuthorities();




        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        User loggeduser=userDao.getUserByUsername(auth.getName());

        viewUI.addObject("roles", roles);
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("modulename","Generic");
        viewUI.addObject("title","Generic");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("generic.html");
            return  viewUI;
        }



    }


    //    save new generic into database
    @Transactional
    @PostMapping(value = "/generic")
    public String savegeneric(@RequestBody Generic generic){
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("insert")){
            return "access denied";
        }

        Generic etbrand=dao.getgenericbyname(generic.getName());
        if (etbrand != null){
            return "Generic name already exists";
        }
        try {
            dao.save(generic);
            return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }

    }


//update generic record
    @Transactional
    @PutMapping(value = "/generic")
    public String updategeneric(@RequestBody Generic generic){
        //        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("update")){
            return "access denied";
        }
//check generic available on database by id
        Generic extgenericid=dao.getReferenceById(generic.getId());
        if (extgenericid==null){
            return "Generic doesn't exists";
        }
//        check generic name available on database by name
        Generic extgeneric=dao.getgenericbyname(generic.getName());
        if (extgeneric!=null && extgeneric.getId()!= generic.getId()){
            return "Entered Generic already exists";
        }
        try {
            dao.save(generic);
            return "OK";
        }
        catch (Exception e){
            return "update not successful"+e.getMessage();
        }


    }



}


