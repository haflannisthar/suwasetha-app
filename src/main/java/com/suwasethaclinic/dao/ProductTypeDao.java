package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductTypeDao extends JpaRepository<ProductType,Integer> {

    @Query("select pr from ProductType pr where pr.name=?1")
    ProductType getproducttypebyname(String name);
}
