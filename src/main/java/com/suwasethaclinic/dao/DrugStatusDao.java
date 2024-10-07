package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.DrugStatus;
import com.suwasethaclinic.entity.PatientStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrugStatusDao extends JpaRepository<DrugStatus,Integer> {

}
