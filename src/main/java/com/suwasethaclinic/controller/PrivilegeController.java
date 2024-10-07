package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.PrivilegeDao;
import com.suwasethaclinic.dao.RoleDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Privilege;
import com.suwasethaclinic.entity.Role;
import com.suwasethaclinic.entity.User;
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
public class PrivilegeController {

   @Autowired
   private PrivilegeDao dao;

   @Autowired
   private UserDao userDao;



    @GetMapping(value = "/privilege/findall" , produces = "application/json")
    public List<Privilege>findAll(){
//authentication and authorization
        return dao.findAll();
    }

    @GetMapping(value = "/privilege")
    public ModelAndView PrivilegeUI(){
        ModelAndView privUI=new ModelAndView();
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        User loggeduser=userDao.getUserByUsername(auth.getName());

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        privUI.addObject("roles", roles);

        privUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        privUI.addObject("loggeduserimg",loggeduser.getUser_photo());
        privUI.addObject("loggedusername",auth.getName());
        privUI.addObject("modulename","Privilege");
        privUI.addObject("title","Privilege");
        HashMap<String,Boolean> logUserPriv=getPrivilegeByUserModule(auth.getName(),"Privilege");
        if (!logUserPriv.get("select")){
            privUI.setViewName("errorpage.html");
            return  privUI;
        }
        else {
            privUI.setViewName("privilege.html");
            return  privUI;
        }

    }


    @PostMapping(value = "/privilege")
    public String savePrivilege(@RequestBody Privilege privilege){
//        authentication and authorization

        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=getPrivilegeByUserModule(auth.getName(),"Privilege");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }

//        duplicate check
        Privilege extPrivilege=dao.getByRoleModule(privilege.getRole_id().getId(),privilege.getModule_id().getId());
        if (extPrivilege !=null){
          return "Privilege already exists";
        }

        try {
             dao.save(privilege);
             return "OK";
        }
        catch ( Exception e){
            return  "Something went wrong "+e.getMessage();
        }
    }


    @DeleteMapping(value = "/privilege")
    public  String deletePrivilege(@RequestBody Privilege privilege){

//        authentication and authorization

        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=getPrivilegeByUserModule(auth.getName(),"Privilege");
        if (!logUserPriv.get("delete")){
            return "Access denied ";
        }

        Privilege extPrivilege=dao.getReferenceById(privilege.getId());
        System.out.println();
        if (extPrivilege ==null){
            return "Privilege does not exists ";
        }
        try {
            extPrivilege.setPrivselect(false);
            extPrivilege.setPrivselect(false);
            extPrivilege.setPrivupdate(false);
            extPrivilege.setPrivdelete(false);
            dao.save(extPrivilege);
            return "OK";
        }
        catch (Exception e){
            return  "something went wrong"+e.getMessage();
        }
    }

    @PutMapping(value = "/privilege")
    public String updatePrivilege(@RequestBody Privilege privilege){
//        authentication and authorization

        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        HashMap<String,Boolean> logUserPriv=getPrivilegeByUserModule(auth.getName(),"Privilege");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }

        Privilege extPrivilege=dao.getReferenceById(privilege.getId());
        if (extPrivilege==null){
            return "Privilege does not exists";
        }
        try {
            dao.save(privilege);
            return "OK";
        }
        catch (Exception e){
            return "something went wrong "+e.getMessage();
        }
    }

    //get mapping to get privilege by logged user module
  @GetMapping(value = "/privilege/byloggedusermodule/{modulename}",produces = "application/json")
  public HashMap<String,Boolean> getPrivilegeByLoggedUserModule(@PathVariable("modulename") String modulename){
      Authentication auth= SecurityContextHolder.getContext().getAuthentication();

      return getPrivilegeByUserModule(auth.getName(),modulename);

  }

    //    function to get  privilege  user module
    public HashMap getPrivilegeByUserModule(String username, String modulename){
        HashMap<String,Boolean> userPrivilege=new HashMap<String,Boolean>();


        if (username.equals("admin")){
            userPrivilege.put("select",true);
            userPrivilege.put("insert",true);
            userPrivilege.put("update",true);
            userPrivilege.put("delete",true);


        }
        else {
            String userPriv = dao.getPrivilegeByUserModule(username,modulename);
//            1,0,0,1
            String [] userPrivList=userPriv.split(",");

            userPrivilege.put("select",userPrivList[0].equals("1"));
            userPrivilege.put("insert",userPrivList[1].equals("1"));
            userPrivilege.put("update",userPrivList[2].equals("1"));
            userPrivilege.put("delete",userPrivList[3].equals("1"));

        }


        return  userPrivilege;
    }
}
