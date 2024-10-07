package com.suwasethaclinic.Dashboard;


import com.suwasethaclinic.dao.DoctorAvailabilityDao;
import com.suwasethaclinic.entity.DoctorAvailability;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class DashboardDoctorAvailabilityForToday {

   @Autowired
   private DashboardDao dao;


    //get doctor available date time for today/currentday
    @GetMapping(value = "/doctoravailability/todayavailabledoctorlist" ,produces = "application/json")
    public List<DoctorAvailabilityToday> getdoctoravailablilyfortoday(){

        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime=LocalTime.now();

        String[][] doctoravailabilityfortoday=dao.getdoctoravailabilityfortoday(currentDate,currentTime);

        List<DoctorAvailabilityToday> doctorAvailabilityTodayList=new ArrayList<>();

        for (String[] doctorAvailabilityItem:doctoravailabilityfortoday ){
              DoctorAvailabilityToday doctorAvailabilityToday=new DoctorAvailabilityToday();

            doctorAvailabilityToday.setName(doctorAvailabilityItem[3]);
            doctorAvailabilityToday.setDate(doctorAvailabilityItem[0]);
            doctorAvailabilityToday.setStarttime(doctorAvailabilityItem[1]);
            doctorAvailabilityToday.setEndtime(doctorAvailabilityItem[2]);

            doctorAvailabilityTodayList.add(doctorAvailabilityToday);
        }

        return doctorAvailabilityTodayList;
    }
}
