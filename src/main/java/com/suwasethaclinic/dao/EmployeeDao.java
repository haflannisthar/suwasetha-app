package com.suwasethaclinic.dao;


import com.suwasethaclinic.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface EmployeeDao extends JpaRepository<Employee,Integer> {

    //get users whos employee status is working
    @Query(value = "SELECT e from  Employee e where e.employeestatus_id.id=1")
    public List<Employee> workingEployees();

//get last employee number
    @Query(value = "SELECT concat('SSE',lpad(substring(max(e.empnumber),4)+1,5,'0')) as empno FROM suwasetha_clinic.employee as e;", nativeQuery = true)
    public String getNextEmpno();

//check for employee nic duplicate
    @Query(value = "select e from Employee e where e.nic=?1")
    public Employee getEmployeeByNic(String nic);

//check for email duplicate
    @Query(value = "select e from Employee e where e.email=?1")
    public Employee getEmployeeByEmail(String email);
    //check for mobile duplicate
    @Query(value = "select e from Employee e where e.mobile=?1")
    public Employee getEmployeeByMobile(String mobile);

//    get the employee list without user account
    @Query(value = "SELECT * FROM suwasetha_clinic.employee  WHERE id NOT IN (SELECT u.employee_id FROM suwasetha_clinic.user u) and employeestatus_id='1'", nativeQuery = true)
   public List<Employee> getEmployeeWithoutUserAccount();

//    get the doctor list
    @Query(value = "select new Employee(e.id,e.fullname,e.callingname) FROM Employee e where e.designation_id.id=1 and e.employeestatus_id.id=1")
    List<Employee> getDoctorList();

//    get doctor available list
    @Query(value = "select new Employee(e.id,e.fullname,e.callingname) FROM Employee e where e.designation_id.id=1 and e.employeestatus_id.id=1 and e.id in (select da.employee_id.id from DoctorAvailability da where ?1 between da.startdate and da.enddate)")
    List<Employee> doctorAvailableList(LocalDate currentDate);

//get the doctor channelling fee
    @Query("select e.channellingcharge from Employee e where e.id=?1")
    BigDecimal getDoctorChannellingFee(Integer doctorid);
}