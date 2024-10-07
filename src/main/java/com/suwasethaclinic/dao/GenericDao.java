package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.Generic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GenericDao extends JpaRepository<Generic,Integer> {


    @Query("select g from Generic  g where g.name=?1")
    Generic getgenericbyname(String name);
}
