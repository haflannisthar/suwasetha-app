package com.suwasethaclinic.controller;



import com.suwasethaclinic.dao.RoleDao;

import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Module;
import com.suwasethaclinic.entity.Role;
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
public class RoleController {

    @Autowired
    private RoleDao dao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private  PrivilegeController privilegeController;

    @GetMapping(value = "/role/list" , produces = "application/json")
    public List<Role>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    @GetMapping(value = "/role")
    public ModelAndView roleUI(){
        ModelAndView viewUI=new ModelAndView();

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
        viewUI.addObject("modulename","Role");
        viewUI.addObject("title","Role");


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.hmtl");
            return  viewUI;
        }
        else {
            viewUI.setViewName("role.html");
            return  viewUI;
        }

    }


    @Transactional
    @PostMapping(value = "/role")
    public String save(@RequestBody Role role){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"User");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }
        try {
            Role extrole=dao.getRoleByName(role.getName());
            if (extrole!=null){
                return "Role already exists";
            }
            dao.save(extrole);
            return "OK";


        }
        catch (Exception e){
            return "something went wrong "+e.getMessage();
        }

    }



    @Transactional
    @DeleteMapping(value = "/role")
    public String delete(@RequestBody Role role){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"User");
        if (!logUserPriv.get("delete")){
            return "Access denied ";
        }
        try {
            Role extrole=dao.getReferenceById(role.getId());
            if (extrole!=null){
                return "role not found";
            }
            dao.delete(extrole);
            return "OK";


        }
        catch (Exception e){
            return "something went wrong "+e.getMessage();
        }

    }

    @Transactional
    @PutMapping(value = "/role")
    public String update(@RequestBody Role role){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"User");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }

        Role extrolebyId=dao.getReferenceById(role.getId());
        if (extrolebyId==null ){
            return "role doesn't exists";
        }

            Role extrole=dao.getRoleByName(role.getName());
            if (extrole!=null && extrole.getId()!= role.getId()){
                return "Entered Role Already Exists";
            }
            try {
            dao.save(role);
            return "OK";


        }
        catch (Exception e){
            return "something went wrong "+e.getMessage();
        }

    }


}
