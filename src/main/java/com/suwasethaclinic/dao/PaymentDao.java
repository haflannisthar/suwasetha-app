package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentDao extends JpaRepository<Payment,Integer> {
//    get the next bill no
    @Query(value = "SELECT concat(year(current_date()),lpad(substring(max(p.billno),5)+1,5,0)) as code FROM suwasetha_clinic.payment as p where year(current_date())=year(p.addeddatetime);",nativeQuery = true)
    String getNextBillNo();

//    get appointment payment details
    @Query("select p from Payment p where p.appointment_id.id is not null order by p.id asc")
    List<Payment> getAppointmentPaymentList();

//    get last added record
    @Query("select p from Payment p where p.appointment_id.id=?1")
    Payment getLastAddedPaymentByAppId(Integer appId);

    @Query("select p from Payment p   where p.appointment_id.id is  null order by p.id desc ")
    List<Payment> getPaymentDataList();

    @Query("select p from Payment p where p.billno=?1")
    Payment getLastAddedPaymentByBillNo(Integer billno);

    @Query("select p from Payment p where p.refno=?1")
    Payment getPaymentByReffNo(String refno);
   @Query("select p from Payment p where p.refno=?1 and p.bankname=?2")
    Payment getPaymentByTransferReffNo(String refno, String bankname);
}
