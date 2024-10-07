package com.suwasethaclinic.controller;



import com.suwasethaclinic.dao.EmployeeStatusDao;
import com.suwasethaclinic.entity.EmployeeStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class EmployeeStatusController {

  @Autowired
    private EmployeeStatusDao dao;

  @GetMapping(value = "/employeestatus/findall" ,produces = "application/json")
  public List<EmployeeStatus>findall(){
      return dao.findAll();
  }

}
