package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Category;
import com.suwasethaclinic.entity.PurchaseDrugProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseDrugProuctTypeDao extends JpaRepository<PurchaseDrugProductType,Integer> {

//    check for duplicate
    @Query("select pt FROM PurchaseDrugProductType pt where pt.name=?1")
    PurchaseDrugProductType getpdproducttypebyname(String name);


}
