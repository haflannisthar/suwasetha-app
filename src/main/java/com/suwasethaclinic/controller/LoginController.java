package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class LoginController {


    @Autowired
    private UserDao userDao;

    @GetMapping("/login")
    public ModelAndView loginUI(){
        ModelAndView loginview=new ModelAndView();
        loginview.setViewName("login.html");
        return loginview;
    }
    @GetMapping("/errorpage")
    public ModelAndView errorUI(){
        ModelAndView errorview=new ModelAndView();
        errorview.setViewName("errorpage.html");
        return errorview;
    }
 @GetMapping(value = "/dashboard")
    public ModelAndView dashboardUI(){


        ModelAndView dashboardview=new ModelAndView();
     Authentication auth= SecurityContextHolder.getContext().getAuthentication();

     User loggeduser=userDao.getUserByUsername(auth.getName());


     Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
     Set<String> roles = authorities.stream()
             .map(GrantedAuthority::getAuthority)
             .collect(Collectors.toSet());

     dashboardview.addObject("roles", roles);
     dashboardview.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
     dashboardview.addObject("loggeduserimg",loggeduser.getUser_photo());
        dashboardview.addObject("loggedusername",auth.getName());
        dashboardview.addObject("title","dashboard");
        dashboardview.setViewName("mainwindow.html");
        return dashboardview;
 }




}
