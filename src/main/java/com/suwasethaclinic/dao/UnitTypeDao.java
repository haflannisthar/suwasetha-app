package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.UnitType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnitTypeDao extends JpaRepository<UnitType,Integer> {

}
