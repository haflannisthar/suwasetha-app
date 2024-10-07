package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.EmployeeStatus;
import com.suwasethaclinic.entity.GrnStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrnStatusDao extends JpaRepository<GrnStatus,Integer> {
}
