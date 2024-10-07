package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BrandDao;
import com.suwasethaclinic.dao.CategoryDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.Category;
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
public class CategoryController {

    @Autowired
    private CategoryDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;


    @GetMapping(value = "/category/list" , produces = "application/json")
    public List<Category>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    @GetMapping(value = "/category/listbyitem/{itemid}" , produces = "application/json")
    public List<Category>CategoryByItem(@PathVariable("itemid") Integer itemid){

        return dao.getCatgoryList(itemid);
    }


    //ui setting
    @Transactional
    @GetMapping(value = "/category" )
    public ModelAndView categoryui(){
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
        viewUI.addObject("modulename","Category");
        viewUI.addObject("title","Category");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("category.html");
            return  viewUI;
        }



    }


    //    save new category into database
    @Transactional
    @PostMapping(value = "/category")
    public String savecategory(@RequestBody Category category){
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        System.out.println(category);
        if (!logUserPriv.get("insert")){
            return "access denied";
        }

        Category etcategory=dao.getcategorybyname(category.getName());
        if (etcategory != null){
            return "Category already exists";
        }
        try {
            dao.save(category);
            return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }

    }


    //update brand record
    @Transactional
    @PutMapping(value = "/category")
    public String updatecategory(@RequestBody Category category){
        //        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("update")){
            return "access denied";
        }
//check category available on database by id
        Category extcategoryid=dao.getReferenceById(category.getId());
        if (extcategoryid==null){
            return "Category doesn't exists";
        }
//        check brand name available on database by name
        Category extcategory=dao.getcategorybyname(category.getName());
        if (extcategory!=null && extcategory.getId()!= category.getId()){
            return "Entered Category already exists";
        }
        try {
            dao.save(category);
            return "OK";
        }
        catch (Exception e){
            return "update not successful"+e.getMessage();
        }


    }


}
