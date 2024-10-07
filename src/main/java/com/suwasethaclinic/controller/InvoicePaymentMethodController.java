package com.suwasethaclinic.controller;


import com.suwasethaclinic.dao.InvoicePaymentMethodDao;
import com.suwasethaclinic.dao.PaymentMethodDao;
import com.suwasethaclinic.entity.InvoicePaymentMethod;
import com.suwasethaclinic.entity.PaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class InvoicePaymentMethodController {

    @Autowired
    private InvoicePaymentMethodDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/invoicepaymentmethod/list" , produces = "application/json")
    public List<InvoicePaymentMethod>findAll(){

        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }




}
