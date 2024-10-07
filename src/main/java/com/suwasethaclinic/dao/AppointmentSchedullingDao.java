package com.suwasethaclinic.dao;


import com.suwasethaclinic.entity.AppointmentScheduling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentSchedullingDao extends JpaRepository<AppointmentScheduling,Integer> {

//    get the appointment count  by doctor and date and between start and end time and pending appointment count
    @Query("select count(s) from AppointmentScheduling s where s.channellingdate=?1 and s.appstatus_id.id=1 and s.employee_id.id=?2 and s.endtime between ?3 and ?4")
    Integer getEndTimeByDoctorAndDate(LocalDate date, Integer doctorid, LocalTime starttimeforday , LocalTime endtimeforday);

//    get the count for a day by given date , doctor id , and betweeen start and end time
    @Query("select count(a) from AppointmentScheduling a where a.channellingdate=?1 and a.employee_id.id=?2 and a.starttime between ?3 and ?4")
    int getcount(LocalDate channellingdate,Integer doctorid,LocalTime starttime,LocalTime endtime);

//    next appointment no
    @Query(value = "SELECT concat(year(current_date()),lpad(substring(max(a.appno),5)+1,6,0)) as code FROM suwasetha_clinic.appointment as a where year(current_date())=year(a.addeddatetime);",nativeQuery = true)
    String getNextAppNo();

//    get the appointment in the current doctor session that are not in prescription
    @Query("select a from AppointmentScheduling a where a.appstatus_id.id=1 and a.employee_id.id=?1 and a.channellingdate=?2 and a.sessionstarttime=?3 and a.id not in (select p.appointment_id.id from Prescription p)")
    List<AppointmentScheduling> getAppointmentForPrescription(Integer userid, LocalDate currentDate, LocalTime sessionTime);




    //    get the first records start time by given parameters
    @Query("select a.starttime from AppointmentScheduling a where a.employee_id.id=?1 and a.channellingdate=?2 order by a.channellingdate ASC limit 1")
    LocalTime getStartTimeToGetLastRecord(Integer employeeId, LocalDate channellingdate);


    //get the last channelling no for a given session
    @Query("select a.channaliingno from AppointmentScheduling a where a.channellingdate=?1 and a.employee_id.id=?2 and a.starttime between ?3 and ?4 ORDER BY a.id desc limit 1 ")
    Integer getLastChannellingNo(LocalDate channellingdate, Integer id, LocalTime getstarttime, LocalTime endtimeforday);

//    get the appointment count for given day given doctor id and session start time
    @Query("select count(a) from AppointmentScheduling a where a.sessionstarttime=?3 and a.employee_id.id=?2 and a.channellingdate=?1")
    Integer getPatientCount(LocalDate date, Integer doctorid, LocalTime time);

//    all appointment for the current day
    @Query("select a from AppointmentScheduling a where a.channellingdate=?1 and a.appstatus_id.id=1")
    List<AppointmentScheduling> findAll(LocalDate currentDate);

//    all the appointment for current day by user id
    @Query("select a from AppointmentScheduling a where a.employee_id.id=?1 and a.channellingdate=?2 and a.appstatus_id.id=1")
    List<AppointmentScheduling> getAppointmentListForCurrentDay(Integer userid, LocalDate currentDate);

//    get the appointment list by app status is pending to payment   and a.id not in (select p.appointment_id.id from Payment p)
//    @Query("select new  AppointmentScheduling(a.id,a.appno,a.channelingcharge )from AppointmentScheduling a where a.appstatus_id.id=1 and a.channellingdate>=?1 ")
//    @Query(value = "SELECT ap.* FROM suwasetha_clinic.appointment as ap left join payment py on ap.id=py.appointment_id where py.appointment_id is null and ap.channellingdate>=?1\n" +
//            "and ap.appstatus_id='1';",nativeQuery = true)

    @Query("select a from AppointmentScheduling a where a.appstatus_id.id=1 and a.id not in(select p.appointment_id.id from Payment p where p.appointment_id is not null)")
    List<AppointmentScheduling> getPendingAppointmentList();

//    when delete a patient change the status  of all pending appointment to the deleted status for that patient
   @Query("select a from AppointmentScheduling a where a.patient_id.id=?1 and a.appstatus_id.id=1")
    List<AppointmentScheduling> getPendingAppointmentByPatientId(Integer id);

    //        get the last added record end time  by doctor and date and between start and end time
    @Query(value = "SELECT ap.endtime FROM suwasetha_clinic.appointment as ap where ap.employee_id=?2 and ap.sessionstarttime=?3 and ap.channellingdate=?1 order by ap.endtime desc limit 1;",nativeQuery = true)
    LocalTime getLastAddedRecordEndTime(LocalDate date, Integer doctorid, LocalTime starttimeforday);

//    get the last added pending status record end time  by doctor and date and between start and end time
    @Query(value = "SELECT ap.endtime FROM suwasetha_clinic.appointment as ap where ap.employee_id=?2 and ap.sessionstarttime=?3  and ap.channellingdate=?1 and ap.appstatus_id='1'  order by ap.endtime desc limit 1;",nativeQuery = true)
    LocalTime getLastAddedRecordEndTimeActive(LocalDate date, Integer doctorid, LocalTime starttimeforday);

    //    check whether there is an appointment created for that doctor , channelling date, start time and end time
    @Query("SELECT ap from AppointmentScheduling ap where ap.employee_id.id=?1 and ap.channellingdate=?2 and ap.starttime=?3 and ap.endtime=?4 and ap.appstatus_id.id!=4")
    AppointmentScheduling checkAppByStartAndEndTime(Integer id, LocalDate channellingdate, LocalTime starttime, LocalTime endtime);

//    get the appointment list after deleted appointment record
  @Query("select ap from AppointmentScheduling ap where ap.channellingdate=?1 and ap.sessionstarttime=?2 and ap.starttime>?3 and ap.employee_id.id=?4 and ap.appstatus_id.id=1")
    List<AppointmentScheduling> getAppointmentListAfterDeletedAppointment(LocalDate sessionDate, LocalTime sessionStartTime, LocalTime starttime, Integer id);

//  get yesterday appointment
  @Query("select a from AppointmentScheduling a where a.channellingdate=?1 and a.appstatus_id.id=1")
    List<AppointmentScheduling> getOldAppointment(LocalDate yesterday);

//  get the appointment count for a day
    @Query("select  count(a) from AppointmentScheduling a where a.employee_id.id=?1 and a.channellingdate=?2 and a.sessionstarttime=?3")
    Integer getAppointmentTimeByDoctorName(Integer doctorid, LocalDate date, LocalTime starttimeforday);

//    get the ongoing appointment list for prescription payment
    @Query("select new AppointmentScheduling(a.id,a.appno) from AppointmentScheduling a where a.appstatus_id.id=2")
    List<AppointmentScheduling> getOngoingAppointmentListDetails();

//    get the appointment added time to set min transfer date time value
    @Query("select a.addeddatetime from AppointmentScheduling a where a.id=?1")
    LocalDateTime getAppointmentAddedDateTime(Integer appointmentid);

//get the appointment time by appointment id
    @Query("select new AppointmentScheduling (a.id,a.channellingdate,a.endtime) from AppointmentScheduling a where a.id=?1")
    AppointmentScheduling getAppointmentTime(Integer appointmentid);

    @Query("select count(a)  from AppointmentScheduling a where a.employee_id.id=?1 and a.channellingdate=?2 and a.sessionstarttime=?3")
    Integer getTotalCreatedAppointmentCount(Integer doctorid, LocalDate date, LocalTime starttime);
}