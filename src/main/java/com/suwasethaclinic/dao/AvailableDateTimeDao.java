package com.suwasethaclinic.dao;


import com.suwasethaclinic.entity.AvailableDateandTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AvailableDateTimeDao extends JpaRepository<AvailableDateandTime,Integer> {




//    get the patient count
    @Query("select a.noofpatients from AvailableDateandTime a where a.availabledate=?1 and a.doctoravailability_id.employee_id.id=?2 and a.startingtime=?3 and a.endtime=?4")
    int getPatientCount(LocalDate channellingdate,Integer doctorid,LocalTime starttime,LocalTime endtime);

//    get the start time by doctor id and date
    @Query("select a.startingtime from AvailableDateandTime a where a.availabledate=?1 and a.doctoravailability_id.id in (select d.id from DoctorAvailability d where d.employee_id.id=?2)")
    List<LocalTime> getstartandedntimelist(LocalDate date, Integer doctorid);

//    get the end time by given parameters
    @Query("select a.endtime from AvailableDateandTime a where a.availabledate=?1 and a.doctoravailability_id.employee_id.id=?2 and a.startingtime=?3")
    LocalTime getEndTimeForGivenSession(LocalDate date, Integer doctorid, LocalTime starttimeforday);

//    this will return the time if the date is equal to current date ans check for end time is equal to current time
@Query("select distinct a.startingtime  from AvailableDateandTime a where a.availabledate=?1 and a.endtime>=?3 and a.doctoravailability_id.id in (select d.id from DoctorAvailability d where d.employee_id.id=?2) ")
    List<LocalTime> getStartAndEndTimeListForCurrentDate(LocalDate date, Integer doctorid, LocalTime currenttime);

//get the patient count for a day, appointment can be created
    @Query("select a.noofpatients from AvailableDateandTime a where a.availabledate=?1 and a.doctoravailability_id.employee_id.id=?2 and a.startingtime=?3")
    Integer getTotalPatientCountForADay(LocalDate date, Integer doctorid, LocalTime time);

//    get the session that is closer to current time
    @Query("select a.startingtime from AvailableDateandTime a where a.doctoravailability_id.employee_id.id=?1 and a.availabledate=?2 and (a.startingtime<= ?3 and a.endtime>=?4)")
    List<LocalTime> getCurrentsSessionTime(Integer userid, LocalDate currentDate, LocalTime currentTimePlusHour, LocalTime currentTimeMinusHour);


//    get the session end time by date session start time and doctor id
    @Query("select ad.endtime from AvailableDateandTime  ad where ad.availabledate=?1 and ad.startingtime=?3 and ad.doctoravailability_id.employee_id.id=?2")
    LocalTime sessionEndTimeByDateDoctorAndSessionStartTime(LocalDate date, Integer doctorid, LocalTime starttimeforday);

    @Query("select av from AvailableDateandTime  av where av.availabledate=?1 and av.doctoravailability_id.id in (select da.id from DoctorAvailability da where da.employee_id.id=?2 and ?1 between da.startdate and da.enddate) ")
    List<AvailableDateandTime> getAvailableDateAndTimeByDoctorDate(LocalDate date,Integer doctorid);
//    @Query("select a.availabledate from AvailableDateandTime a group by a.availabledate order by a.availabledate desc ")
//    List<LocalDate> getAllAvailableDateList();
}