package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Designation;
import com.suwasethaclinic.entity.PatientStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PatientStatusDao extends JpaRepository<PatientStatus,Integer> {

}
