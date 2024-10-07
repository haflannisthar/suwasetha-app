package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.ModuleDao;
import com.suwasethaclinic.dao.RoleDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Module;
import com.suwasethaclinic.entity.Role;
import com.suwasethaclinic.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
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
public class ModuleController {

    @Autowired
    private ModuleDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;


    @GetMapping(value = "/module")
    public ModelAndView modUI(){
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
        viewUI.addObject("modulename","Module");
        viewUI.addObject("title","Module");



        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.hmtl");
            return  viewUI;
        }
        else {
            viewUI.setViewName("modules.html");
            return  viewUI;
        }

    }

    @GetMapping(value = "/module/list" , produces = "application/json")
    public List<Module>findAll(){
        return dao.findAll();
    }

    @GetMapping(value = "/module/listbyrole", params = {"roleid"})
    public List<Module>getByRole(@RequestParam("roleid") Integer roleid){
        return dao.getModuleByRole(roleid);
    }

    @Transactional
    @PostMapping(value = "/module")
    public String save(@RequestBody Module module){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }
        try {
           Module extmod=dao.getModuleByName(module.getName());
           if (extmod!=null){
               return "module already exists";
           }
           dao.save(module);
           return "OK";


        }
        catch (Exception e){
            return "something went wrong "+e.getMessage();
        }

    }

    @Transactional
    @DeleteMapping(value = "/module")
    public String delete(@RequestBody Module module){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("delete")){
            return "Access denied ";
        }
        try {
            Module extmod=dao.getReferenceById(module.getId());
            if (extmod!=null){
                return "module not found";
            }
            dao.delete(extmod);
            return "OK";


        }
        catch (Exception e){
            return "something went wrong "+e.getMessage();
        }

    }


    @Transactional
    @PutMapping(value = "/module")
    public String update(@RequestBody Module module){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }
        Module extmodbyId=dao.getReferenceById(module.getId());
        if (extmodbyId==null){
            return "module doesn't exists";
        }

            Module extmod=dao.getModuleByName(module.getName());
            if (extmod!=null && extmod.getId()!= module.getId()){
                return "Entered Module already Exists ";
            }
            try {
            dao.save(module);
            return "OK";


        }
        catch (Exception e){
            return "something went wrong "+e.getMessage();
        }

    }

}
