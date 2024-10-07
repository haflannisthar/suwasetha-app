package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.DrugStatus;
import com.suwasethaclinic.entity.PurchaseDrugStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseDrugStatusDao extends JpaRepository<PurchaseDrugStatus,Integer> {

}
