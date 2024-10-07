package com.suwasethaclinic.controller;



import com.suwasethaclinic.dao.EmployeeStatusDao;
import com.suwasethaclinic.dao.PurchaseOrderStatusDao;
import com.suwasethaclinic.entity.EmployeeStatus;
import com.suwasethaclinic.entity.PurchaseOrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class PurchaseOrderStatusController {

  @Autowired
    private PurchaseOrderStatusDao dao;

  @GetMapping(value = "/porderstatus/findall" ,produces = "application/json")
  public List<PurchaseOrderStatus>findall(){
      return dao.findAll();
  }

}
