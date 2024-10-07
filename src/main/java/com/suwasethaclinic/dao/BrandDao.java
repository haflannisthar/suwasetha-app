package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.Generic;
import com.suwasethaclinic.entity.PatientStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BrandDao extends JpaRepository<Brand,Integer> {




    @Query("select b from Brand  b where  b.name=?1")
    Brand getbrandbyname(String name);


    @Query("select b from Brand  b where b.id in (select bhc.brand_id.id from BrandHasCategory bhc where bhc.category_id.id=?1)")
    List<Brand> brandlist(Integer categoryid);
}
