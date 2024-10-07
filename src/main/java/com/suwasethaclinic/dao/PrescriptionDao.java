package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.Prescription;
import com.suwasethaclinic.entity.PrescriptionHasSalesDrug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PrescriptionDao extends JpaRepository<Prescription,Integer> {


    @Query(value = " SELECT concat('SPR',lpad(substring(max(p.code),4)+1,5,'0')) as code FROM suwasetha_clinic.prescription as p;",nativeQuery = true)
    String getnextcode();

// prescription list by employee id
    @Query("select p from Prescription p where p.appointment_id.employee_id.id=?1 order by p.addeddatetime desc ")
    List<Prescription> getPrecriptionbyDoctorId(Integer doctorid);

//    prescription  list for payment where prescription has drugs to buy from  in house pharmacy  [and p.id not in (select py.prescription_id.id from Payment py)]
//@Query("select new Prescription(p.id,p.code) from Prescription p left join Payment py On p.id=py.prescription_id.id where py.id is null  and p.id in (select phs.prescription_id.id from PrescriptionHasSalesDrug phs where phs.inpharmacyoroutside=true )")
@Query(value = "select  p.* from prescription as p left join payment py on p.id=py.prescription_id where py.prescription_id is null and   p.id in (select ps.prescription_id from prescription_has_salesdrug as ps where ps.inpharmacyoroutside='1')",nativeQuery = true)
    List<Prescription> getPrescriptionForPayment();


//get in house drugList for payment by prescription no
    @Query("select phs from PrescriptionHasSalesDrug phs where phs.prescription_id.code=?1 and phs.inpharmacyoroutside=true ")
    List<PrescriptionHasSalesDrug> getPrescriptionInHouseDrugList(String prescriptionno);

    @Query("select p from Prescription p where  p.code=?1")
    Prescription disableEditBtnAfterThirtyMinsFromAddedTime(String prescriptioncode);
}
