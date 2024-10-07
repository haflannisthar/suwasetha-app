package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.BrandDao;
import com.suwasethaclinic.dao.PaymentMethodDao;
import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.PaymentMethod;
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
public class PaymentMethodController {

    @Autowired
    private PaymentMethodDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/paymentmethod/list" , produces = "application/json")
    public List<PaymentMethod>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }




}
