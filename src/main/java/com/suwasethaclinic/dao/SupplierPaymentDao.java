package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.SupplierPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment,Integer> {


//    next bill no
    @Query(value = "SELECT concat(year(current_date()),lpad(substring(max(sp.billno),5)+1,6,0)) as billno FROM suwasetha_clinic.supplierpayment as sp where year(current_date())=year(sp.addeddatetime);" , nativeQuery = true)
    Integer nextBillNo();
}
