package com.suwasethaclinic.report;

import com.suwasethaclinic.entity.AppointmentScheduling;
import com.suwasethaclinic.entity.Employee;
import com.suwasethaclinic.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReportDao extends JpaRepository<Employee,Integer> {

//    get the employee list who are active
    @Query("select e from Employee e where e.employeestatus_id.id=1")
    List<Employee> getWorkingEmployeeList();

//    get employee by status and designation
    @Query("select e from Employee e where e.employeestatus_id.id=?1 and e.designation_id.id=?2")
    List<Employee>getEmployeeListByDesignationAndEmployeeStatus(int statusid,int desid);

//    get all appointment list
@Query("select a from AppointmentScheduling a order by a.addeddatetime desc ")
    List<AppointmentScheduling> getAllAppointmentData();

//get all appointment by doctor and channelling date and status
    @Query("select a from AppointmentScheduling a where a.employee_id.id=?1 and a.channellingdate=?2")
    List<AppointmentScheduling> getAppointmentListByDoctorDateStatus(int doctor, LocalDate date);

//    channelling date and appointment count that is between a date range
    @Query("select a.channellingdate,count(a) from AppointmentScheduling a where a.channellingdate between ?2 and ?1 group by a.channellingdate ")
    List<Object[]> getAllAppointmentDateAndCount(LocalDate currentDate,LocalDate oneWeekBeforeCurrentDate);

//    appointment count and doctor name by date
    @Query("select a.employee_id.fullname,count(a) from AppointmentScheduling a where a.channellingdate=?1 group by a.employee_id.fullname")
    List<Object[]> getAppointmentCountByDate(LocalDate localDate);

//    doctor calling name and count grouped by doctor name
    @Query("select a.employee_id.callingname,count(a) from AppointmentScheduling a group by a.employee_id.callingname")
    List<Object[]> getAppointmentByDoctors();

//    get the purchase drug name, purchase order has purchase drug total qty that is between start and end date
    @Query(value = "SELECT pd.name , sum(php.quantity) FROM suwasetha_clinic.purchaseorder as po,purchaseorder_has_purchasedrug as php,purchasedrug as pd where po.id=php.purchaseorder_id \n" +
            "and php.purchasedrug_id=pd.id and po.addeddatetime between ?1 and ?2 group by pd.id",nativeQuery = true)
    String[][] getPOrderCountByDate(LocalDate startdate,LocalDate enddate);

//    get the total income amount by date wise
    @Query(value = "SELECT sum(p.totalamount),date(p.addeddatetime) FROM suwasetha_clinic.payment as p where p.addeddatetime between ?1 and ?2 group by date(p.addeddatetime);",nativeQuery = true)
    String[][] getSalesByDaily(LocalDate startdate,LocalDate enddate,String option);

//get the total income by week wise
    @Query(value = "SELECT sum(p.totalamount), yearweek(p.addeddatetime) FROM suwasetha_clinic.payment as p where p.addeddatetime between ?1 and ?2 group by yearweek(p.addeddatetime);",nativeQuery = true)
    String[][] getSalesByWeekly(LocalDate startdate,LocalDate enddate,String option);
//get the total income by month wise
    @Query(value = "SELECT sum(p.totalamount), monthname(p.addeddatetime) FROM suwasetha_clinic.payment as p where p.addeddatetime between ?1 and ?2 group by monthname(p.addeddatetime);",nativeQuery = true)
    String[][] getSalesByMonthly(LocalDate startdate,LocalDate enddate,String option);
//get the total income by year wise
    @Query(value = "SELECT sum(p.totalamount), year(p.addeddatetime) FROM suwasetha_clinic.payment as p where p.addeddatetime between ?1 and ?2 group by year(p.addeddatetime);",nativeQuery = true)
    String[][] getSalesByYearly(LocalDate startdate,LocalDate enddate,String option);

//    get the drug name available qty rop
    @Query(value = "SELECT sum(b.salesdrugavailableqty),sd.name,sd.rop FROM suwasetha_clinic.batch as b,purchasedrug as pd,salesdrug as sd where \n" +
            "b.purchasedrug_id=pd.id and pd.salesdrug_id=sd.id group by sd.name;",nativeQuery = true)
    String[][] getInventoryReport();

//get the drugs that are low on stock
    @Query(value = "SELECT sum(b.salesdrugavailableqty) as totalqty,sd.name,sd.rop FROM suwasetha_clinic.batch as b,purchasedrug as pd,salesdrug as sd where \n" +
            "b.purchasedrug_id=pd.id and pd.salesdrug_id=sd.id   group by sd.name having totalqty<rop;",nativeQuery = true)
    String[][] getLowDrugInventoryReport();


//get expiring drug list
    @Query(value = "SELECT sd.name , bt.batchno ,bt.expirydate ,bt.salesdrugavailableqty FROM suwasetha_clinic.salesdrug as sd , purchasedrug as pd ,batch as bt where bt.purchasedrug_id=pd.id and pd.salesdrug_id=sd.id and bt.expirydate between ?1 and ?2 group by sd.name , bt.expirydate, bt.batchno having bt.salesdrugavailableqty >0;",nativeQuery = true)
    String[][] getExpiringDrugDetails(LocalDate currentDate,LocalDate oneMonthAhead);

    @Query(value = "SELECT da.enddate FROM suwasetha_clinic.doctoravailability as da where da.employee_id=?1 order by da.enddate desc limit 1",nativeQuery = true)
    LocalDate getLastDoctorAvailabilityDate(int doctor);

//    get the drug ordered quantity and month name ordered by month
    @Query(value = "SELECT sum(phd.quantity),monthname(po.addeddatetime) FROM suwasetha_clinic.purchaseorder as po,purchaseorder_has_purchasedrug phd,purchasedrug as pd,salesdrug as sd\n" +
            "where sd.id=pd.salesdrug_id and pd.id=phd.purchasedrug_id and phd.purchaseorder_id=po.id \n" +
            "and sd.id=?1 and po.addeddatetime between ?2 and ?3 group by monthname(po.addeddatetime);",nativeQuery = true)
    String[][] getRoqDrugByMonth(int drugid, LocalDate startdate, LocalDate enddate);

//    get the total qty and month group by month added date time
    @Query(value = "SELECT sum(phb.quantity),monthname(py.addeddatetime) FROM suwasetha_clinic.batch as b,payment as py,payment_has_batch as phb,purchasedrug as pd,salesdrug as sd\n" +
            "where py.id=phb.payment_id and phb.batch_id=b.id and b.purchasedrug_id=pd.id and pd.salesdrug_id=sd.id\n" +
            "and sd.id=?1 and py.addeddatetime between ?2 and ?3 group by monthname(py.addeddatetime);",nativeQuery = true)
    String[][] getRopDrugByMonth(int drugid, LocalDate startdate, LocalDate enddate);

//    get supplier details by drug name
    @Query(value = "SELECT sup.regno,sup.name,sup.contactno,sup.email,pd.conversionfactor,sup.arrearsamount,ss.name\n" +
            " FROM suwasetha_clinic.supplier as sup,purchasedrug as pd,salesdrug as sd,supplier_has_purchasedrug as shp,supplierstatus as ss\n" +
            " where sd.id=pd.salesdrug_id and pd.id=shp.purchasedrug_id and shp.supplier_id=sup.id and sup.supplierstatus_id=ss.id\n" +
            " and sd.name=?1 ;",nativeQuery = true)
    String[][] getSupplierDetailsByDrugNameReport(String drugname);
}
