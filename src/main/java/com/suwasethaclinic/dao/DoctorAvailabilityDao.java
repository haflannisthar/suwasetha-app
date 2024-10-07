package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.AvailableDateandTime;
import com.suwasethaclinic.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface DoctorAvailabilityDao extends JpaRepository<DoctorAvailability,Integer> {

//    @Query(value ="SELECT * from doctoravailability as d where d.employee_id= and (('2024-06-20' between d.startdate and d.enddate))",nativeQuery = true)
    @Query("select da from DoctorAvailability da where da.employee_id.id=?1 and (?2 between da.startdate and da.enddate)")
    DoctorAvailability getdoctoravailability(Integer emp_id, LocalDate startdate);

    @Query("select da.enddate from DoctorAvailability da where da.employee_id.id=?1 order by da.addeddatetime desc limit 1")
    LocalDate getlastrecordenddate(Integer doctorid);

    //get the available dates that is between cuurent date and one week from current date and if there are multiple record then select the date with the earliest starting date
    //only the earliest start time for each date is considered
//    and a.startingtime = (select min(b.startingtime) from AvailableDateandTime b where b.availabledate = a.availabledate and b.doctoravailability_id.employee_id.id = ?1)
    @Query("select a from AvailableDateandTime a where (a.availabledate between ?2 and ?3) and a.doctoravailability_id.employee_id.id = ?1 ")
    List<AvailableDateandTime> getdoctoravailablerecord(Integer doctorid, LocalDate currentdate, LocalDate oneweek);




}
