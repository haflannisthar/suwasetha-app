package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.DesignationDao;
import com.suwasethaclinic.dao.PrivilegeDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Designation;
import com.suwasethaclinic.entity.Privilege;
import com.suwasethaclinic.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
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
public class DesignationController {

    @Autowired
    private DesignationDao dao;

    @Autowired
    private  PrivilegeController privilegeController;

    @Autowired
    private  PrivilegeDao privilegeDao;

    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/designation/findall" , produces = "application/json")
    public List<Designation>findall(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }


    @GetMapping(value = "/designation")
    public ModelAndView desUI(){
        ModelAndView viewDes=new ModelAndView();
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewDes.addObject("roles", roles);

        User loggeduser=userDao.getUserByUsername(auth.getName());
        viewDes.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewDes.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewDes.addObject("loggedusername",auth.getName());
        viewDes.addObject("modulename","designation");
        viewDes.addObject("title","Designation");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        if (!logUserPriv.get("select")){
            viewDes.setViewName("errorpage.html");
            return  viewDes;
        }
        else {
            viewDes.setViewName("designation.html");
            return viewDes;
        }


    }

    @PostMapping(value = "/designation")
    public String saveDes(@RequestBody Designation designation){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }

       // check duplicate
        Designation extDes=dao.getDesignationByName(designation.getName());

        if (extDes!=null){
            return "Designation exists";
        }
        try {
         dao.save(designation);

            return "OK";
        }
        catch (Exception e){
           return "something went wrong "+e.getMessage();
        }

    }


    @PutMapping(value ="/designation")
    public  String updateDes(@RequestBody Designation designation){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }

        Designation extDes=dao.getReferenceById(designation.getId());

        if (extDes==null){
            return " Designation doesn't exists";
        }

        Designation extDesByName=dao.getDesignationByName(designation.getName());

        if (extDesByName!=null && extDesByName.getId()!=designation.getId()){
            return "Entered Designation Already Exists";
        }
        try {
            dao.save(designation);
            return "OK";
        }
        catch (Exception e){
            return "something went wrong" +e.getMessage();
        }
    }

    @DeleteMapping(value = "/designation"  ,params = {"role_id"})
    public String delete(@RequestBody Designation designation ,@RequestParam("role_id") Integer role_id){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("delete")){
            return "Access denied ";
        }
        Designation extDes=dao.getReferenceById(designation.getId());
        System.out.println(extDes);
        if (extDes==null){
            return " Designation doesn't exists";
        }
        try {


            dao.delete(designation);
            dao.save(designation);
            return "OK";
        }
        catch (Exception e){
            return "something went wrong" +e.getMessage();
        }

    }

}
