package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BrandDao;
import com.suwasethaclinic.dao.RoleDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.*;
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
public class BrandController {

    @Autowired
    private BrandDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/brand/list" , produces = "application/json")
    public List<Brand>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    //    get brand list item by category id
    @GetMapping(value = "/brand/listbycategory/{categoryid}" ,produces = "application/json")
    public List<Brand> brandlist(@PathVariable("categoryid") Integer categoryid){
        return dao.brandlist(categoryid);
    }






//ui setting
    @Transactional
    @GetMapping(value = "/brand" )
    public ModelAndView brandui(){
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
        viewUI.addObject("modulename","Brand");
        viewUI.addObject("title","Brand");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
           return  viewUI;
        }
        else {
            viewUI.setViewName("brand.html");
            return  viewUI;
        }



    }

//    save new brand into database
    @Transactional
   @PostMapping(value = "/brand")
    public String savebrand(@RequestBody Brand brand){
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("insert")){
            return "access denied";
        }

        Brand etbrand=dao.getbrandbyname(brand.getName());
        if (etbrand != null){
            return "Brand name already exists";
        }
        try {
            dao.save(brand);
            return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }

    }

//update brand record
    @Transactional
    @PutMapping (value = "/brand")
    public String updatebrand(@RequestBody Brand brand){
        //        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("update")){
            return "access denied";
        }
//check brand available on database by id
        Brand extbrandid=dao.getReferenceById(brand.getId());
        if (extbrandid==null){
            return "Brand doesn't exists";
        }
//        check brand name available on database by name
        Brand extbrand=dao.getbrandbyname(brand.getName());
        if (extbrand!=null && extbrand.getId()!= brand.getId()){
            return "Entered brand already exists";
        }
        try {
            dao.save(brand);
            return "OK";
        }
        catch (Exception e){
            return "update not successful"+e.getMessage();
        }


    }



}
