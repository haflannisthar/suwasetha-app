package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.CategoryDao;
import com.suwasethaclinic.dao.SubCategoryDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Category;
import com.suwasethaclinic.entity.SubCategory;
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
public class SubCategoryController {

    @Autowired
    private SubCategoryDao dao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/subcategory/list" , produces = "application/json")
    public List<SubCategory>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));

    }
//    filter by category
    @GetMapping(value = "/subcategory/listbycategory/{categoryid}" , produces = "application/json")
    public List<SubCategory>CategoryByItem(@PathVariable("categoryid") Integer categoryid){

        return dao.getSubCatgoryList(categoryid);
    }




    //ui setting
    @Transactional
    @GetMapping(value = "/subcategory" )
    public ModelAndView subcategoryui(){
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
        viewUI.addObject("modulename","Sub-Category");
        viewUI.addObject("title","Sub-Category");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("subcategory.html");
            return  viewUI;
        }



    }


//    //    save new category into database
    @Transactional
    @PostMapping(value = "/subcategory")
    public String savesubcategory(@RequestBody SubCategory subcategory){
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("insert")){
            return "access denied";
        }

        SubCategory etsubcategory=dao.getsubcategorybyname(subcategory.getName());
        if (etsubcategory != null){
            return "Sub-Category already exists";
        }
        try {
            dao.save(subcategory);
            return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }

    }

//
//    //update brand record
    @Transactional
    @PutMapping(value = "/subcategory")
    public String updatesubcategory(@RequestBody SubCategory subcategory){
        //        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");

        if (!logUserPriv.get("update")){
            return "access denied";
        }
//check category available on database by id
        SubCategory extsubcategoryid=dao.getReferenceById(subcategory.getId());
        if (extsubcategoryid==null){
            return "Sub-Category doesn't exists";
        }
//        check brand name available on database by name
        SubCategory extsubcategory=dao.getsubcategorybyname(subcategory.getName());
        if (extsubcategory!=null && extsubcategory.getId()!= subcategory.getId()){
            return "Entered Sub-Category already exists";
        }
        try {
            dao.save(subcategory);
            return "OK";
        }
        catch (Exception e){
            return "update not successful"+e.getMessage();
        }


    }


}
