package com.suwasethaclinic.service;

import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.Role;
import com.suwasethaclinic.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User extUser=userDao.getUserByUsername(username);

        Set<GrantedAuthority> userRoles=new HashSet<GrantedAuthority>();
        for (Role role:extUser.getRoles()){
            userRoles.add(new SimpleGrantedAuthority(role.getName()));
        }
        ArrayList<GrantedAuthority>grantedAuthorities=new ArrayList<GrantedAuthority>(userRoles);
        System.out.println("roles are "+grantedAuthorities);


        UserDetails userDetails=new org.springframework.security.core.userdetails.User(extUser.getUsername(),
                extUser.getPassword() ,extUser.getStatus(), true,true,true,
                grantedAuthorities);
           return userDetails;
    }
}
