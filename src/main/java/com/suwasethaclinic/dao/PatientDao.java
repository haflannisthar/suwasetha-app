package com.suwasethaclinic.dao;


import com.suwasethaclinic.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface PatientDao extends JpaRepository<Patient,Integer> {



   //get the next patient reg no
    @Query(value = "select concat('PR', lpad(substring(max(regno), 3) + 1, 6, '0')) as regno from suwasetha_clinic.patient as p;" ,nativeQuery = true)
    String getNextPatNumber();

   //    select the patient id, title, firstname and title
    @Query("select new Patient (P.id,P.title,P.firstname,P.lastname) from Patient P ")
    List<Patient> activePlist();

    //    select the patient id, title, firstname and title
    @Query("select new Patient (P.id,P.contactno) from Patient P ")
    List<Patient> activePlistContactNo();

   //get patient date of birth
    @Query("select p.dateofbirth from Patient p where p.id in (select a.patient_id.id from AppointmentScheduling a where a.id=?1)")
    LocalDate getPatientDob(Integer appid);

//    get the patient list by contact number
    @Query("select new Patient (P.id,P.title,P.firstname,P.lastname) from Patient P where P.contactno=?1")
    List<Patient> activePlistByContactNumber(String contactno);
}
