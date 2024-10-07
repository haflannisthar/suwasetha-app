package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Designation;
import com.suwasethaclinic.entity.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeStatusDao extends JpaRepository<EmployeeStatus,Integer> {
}
