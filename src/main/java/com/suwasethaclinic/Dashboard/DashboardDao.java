package com.suwasethaclinic.Dashboard;

import com.suwasethaclinic.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface DashboardDao extends JpaRepository<DoctorAvailability,Integer> {

    @Query(value = "SELECT adt.availabledate, adt.startingtime, adt.endtime,e.callingname \n" +
            "FROM suwasetha_clinic.availabledateandtime as adt, doctoravailability as da, employee as e \n" +
            "WHERE e.id = da.employee_id \n" +
            "AND da.id = adt.doctoravailability_id \n" +
            "AND adt.availabledate = current_date() \n" +
            "AND adt.endtime >= current_time();",nativeQuery = true)
   String[][] getdoctoravailabilityfortoday(LocalDate currentDate, LocalTime currentTime);

}
