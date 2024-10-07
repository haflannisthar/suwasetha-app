package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BrandDao;
import com.suwasethaclinic.dao.ProductTypeDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.ProductType;
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
public class ProductTypeController {

    @Autowired
    private ProductTypeDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/producttype/list" , produces = "application/json")
    public List<ProductType>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }


    //ui setting
    @Transactional
    @GetMapping(value = "/producttype" )
    public ModelAndView Producttypeui(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        User loggeduser=userDao.getUserByUsername(auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("modulename","Product-type");
        viewUI.addObject("title","Product-type");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("productType.html");
            return  viewUI;
        }



    }

    //    save new record into database
    @Transactional
    @PostMapping(value = "/producttype")
    public String saveproducttype(@RequestBody ProductType productType){
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("insert")){
            return "access denied";
        }

        ProductType etproducttype=dao.getproducttypebyname(productType.getName());
        if (etproducttype != null){
            return "product type name already exists";
        }
        try {
            dao.save(productType);
            return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }

    }

    //update  record
    @Transactional
    @PutMapping(value = "/producttype")
    public String updateproducttype(@RequestBody ProductType productType){
        //        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("update")){
            return "access denied";
        }
//check product type available on database by id
        ProductType extproductbyid=dao.getReferenceById(productType.getId());
        if (extproductbyid==null){
            return "Product type doesn't exists";
        }
//        check brand name available on database by name
        ProductType extproducttype=dao.getproducttypebyname(productType.getName());
        if (extproducttype!=null && extproducttype.getId()!= productType.getId()){
            return "Entered Product type already exists";
        }
        try {
            dao.save(productType);
            return "OK";
        }
        catch (Exception e){
            return "update not successful"+e.getMessage();
        }


    }


}
