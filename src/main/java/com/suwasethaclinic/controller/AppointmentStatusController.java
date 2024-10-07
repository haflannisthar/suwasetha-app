package com.suwasethaclinic.controller;



import com.suwasethaclinic.dao.AppointmentStatusDao;
import com.suwasethaclinic.entity.AppointmentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class AppointmentStatusController {

  @Autowired
    private AppointmentStatusDao dao;

  @GetMapping(value = "/appstatus/findall" ,produces = "application/json")
  public List<AppointmentStatus>findall(){

    return dao.findAll();
  }

}
