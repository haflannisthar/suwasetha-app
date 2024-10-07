package com.suwasethaclinic.report;

import com.suwasethaclinic.controller.PrivilegeController;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collection;
import java.util.HashMap;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class ReportUIController {


    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Transactional
    @GetMapping(value = "/reportworkingemployee" )
    public ModelAndView employeeUI(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        User loggeduser=userDao.getUserByUsername(auth.getName());


        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename","Reports");
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());

        viewUI.addObject("title","Employee Reports");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("reportemployee.html");
            return  viewUI;
        }



    }

    @Transactional
    @GetMapping(value = "/reportappointment" )
    public ModelAndView appointmentUI(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        User loggeduser=userDao.getUserByUsername(auth.getName());


        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename","Reports");
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());

        viewUI.addObject("title","Appointment Reports");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("reportappointment.html");
            return  viewUI;
        }



    }


    @Transactional
    @GetMapping(value = "/reportporder" )
    public ModelAndView pOrderReportUI(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        User loggeduser=userDao.getUserByUsername(auth.getName());


        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename","Reports");
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());

        viewUI.addObject("title","Purchase Order Reports");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Purchase Order");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("reportporder.html");
            return  viewUI;
        }



    }


    @Transactional
    @GetMapping(value = "/reportsale" )
    public ModelAndView saleReportUI(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        User loggeduser=userDao.getUserByUsername(auth.getName());


        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename","Reports");
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());

        viewUI.addObject("title","Income Reports");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("reportsale.html");
            return  viewUI;
        }



    }

//    inventory report UI
    @Transactional
    @GetMapping(value = "/reportinventory" )
    public ModelAndView inventoryReportUI(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        User loggeduser=userDao.getUserByUsername(auth.getName());


        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename","Reports");
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());

        viewUI.addObject("title","Inventory Reports");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("reportinventory.html");
            return  viewUI;
        }



    }

//    reportinventory
@Transactional
@GetMapping(value = "/report" )
public ModelAndView ReportUI(){
    ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
    Authentication auth= SecurityContextHolder.getContext().getAuthentication();


    User loggeduser=userDao.getUserByUsername(auth.getName());



    Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
    Set<String> roles = authorities.stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toSet());

    viewUI.addObject("roles", roles);

    viewUI.addObject("loggedusername",auth.getName());
    viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
    viewUI.addObject("modulename","Reports");
    viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());

    viewUI.addObject("title","Reports");

    HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
    if (!logUserPriv.get("select")){
        viewUI.setViewName("errorpage.html");
        return  viewUI;
    }
    else {
        viewUI.setViewName("report.html");
        return  viewUI;
    }



}


    //    inventory report UI
    @Transactional
    @GetMapping(value = "/reportroproq" )
    public ModelAndView ropRoqReportUI(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();


        User loggeduser=userDao.getUserByUsername(auth.getName());


        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename","Reports");
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());

        viewUI.addObject("title","Rop/Roq Reports");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("reportroproq.html");
            return  viewUI;
        }



    }

}
