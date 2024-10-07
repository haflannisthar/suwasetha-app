package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.CategoryDao;
import com.suwasethaclinic.dao.PurchaseDrugProuctTypeDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Category;
import com.suwasethaclinic.entity.PurchaseDrugProductType;
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
public class PurchaseDrugProductTypeController {

    @Autowired
    private PurchaseDrugProuctTypeDao dao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/purchaseproducttype/list" , produces = "application/json")
    public List<PurchaseDrugProductType>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }


    //ui setting
    @Transactional
    @GetMapping(value = "/purchaseproducttype" )
    public ModelAndView purchaseproductypeui(){
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
        viewUI.addObject("modulename","Purchase-Drug");
        viewUI.addObject("title","Purchase-Drug");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Purchase-Drug");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {

            viewUI.setViewName("Purchaseproducttype.html");
            return  viewUI;
        }



    }


    //    save new product type into database
    @Transactional
    @PostMapping(value = "/purchaseproducttype")
    public String saveprt(@RequestBody PurchaseDrugProductType purchaseDrugProductType){
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("insert")){
            return "access denied";
        }

        PurchaseDrugProductType extprtype=dao.getpdproducttypebyname(purchaseDrugProductType.getName());
        if (extprtype != null){
            return "Product Type already exists";
        }
        try {
            dao.save(purchaseDrugProductType);
            return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }

    }

//
//    //update product type record
    @Transactional
    @PutMapping(value = "/purchaseproducttype")
    public String updatepr(@RequestBody PurchaseDrugProductType purchaseDrugProductType){
        //        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("update")){
            return "access denied";
        }
//check category available on database by id
        PurchaseDrugProductType extyid=dao.getReferenceById(purchaseDrugProductType.getId());
        if (extyid==null){
            return "Product type doesn't exists";
        }
//        check brand name available on database by name
        PurchaseDrugProductType extpr=dao.getpdproducttypebyname(purchaseDrugProductType.getName());
        if (extpr!=null && extpr.getId()!= purchaseDrugProductType.getId()){
            return "Entered Product Type already exists";
        }
        try {
            dao.save(purchaseDrugProductType);
            return "OK";
        }
        catch (Exception e){
            return "update not successful"+e.getMessage();
        }


    }


}
