package com.suwasethaclinic.dao;


import com.suwasethaclinic.entity.AppointmentStatus;
import com.suwasethaclinic.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentStatusDao extends JpaRepository<AppointmentStatus,Integer> {

}