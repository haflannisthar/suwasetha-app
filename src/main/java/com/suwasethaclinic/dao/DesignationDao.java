package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DesignationDao extends JpaRepository<Designation,Integer> {
@Query(value = "select d from Designation d where d.name=?1")
  public   Designation getDesignationByName(String name);
}
