package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.DrugStatus;
import com.suwasethaclinic.entity.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierStatusDao extends JpaRepository<SupplierStatus,Integer> {

}
