package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BrandDao;
import com.suwasethaclinic.dao.ItemTypeDao;
import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.ItemType;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

@RestController
public class ItemTypeController {

    @Autowired
    private ItemTypeDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/itemtype/list" , produces = "application/json")
    public List<ItemType>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

}
