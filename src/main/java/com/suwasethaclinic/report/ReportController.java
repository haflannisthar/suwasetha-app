package com.suwasethaclinic.report;

import com.suwasethaclinic.entity.AppointmentScheduling;
import com.suwasethaclinic.entity.Employee;
import com.suwasethaclinic.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
public class ReportController {

    @Autowired
    private ReportDao reportDao;

//  [/wokingemployeelsit]
    @GetMapping(value = "/wokingemployeelist",produces = "application/json")
    public List<Employee> getWorkingEmployeeList(){
        return reportDao.getWorkingEmployeeList();
    }

    //  [/employeelistdata?status=1&designation=1]
    @GetMapping(value = "/employeelistdata",params = {"status","designation"},produces = "application/json")
    public List<Employee> getEmployeeListByDesAndStatus(@RequestParam("status") int status,@RequestParam("designation") int designation){
        return reportDao.getEmployeeListByDesignationAndEmployeeStatus(status,designation);
    }

    @GetMapping(value = "/appointmentlistdata",produces = "application/json")
    public List<AppointmentScheduling> getAllAppointmentData(){

        return reportDao.getAllAppointmentData();
    }

//    get appointment count , date grouped  by channelling date
    @GetMapping(value = "/appointmentlistdateandecount",produces = "application/json")
    public List<Object[]> getAllAppointmentDateAndCount(){

        LocalDate currentDate=LocalDate.now();
        LocalDate oneWeekBeforeCurrentDate=LocalDate.now().minusWeeks(1);
        System.out.println(oneWeekBeforeCurrentDate);

        List<Object[]>  dateAndCount= reportDao.getAllAppointmentDateAndCount(currentDate,oneWeekBeforeCurrentDate);

        return dateAndCount;
    }

//    get the appointment count , doctor name grouped by doctor name
    @GetMapping(value = "/appointmentcountbydoctor",produces = "application/json")
    public List<Object[]> getAppointmentByDoctors(){

        List<Object[]>  appointmentByDoctors= reportDao.getAppointmentByDoctors();

        return appointmentByDoctors;
    }

    @GetMapping(value = "/appointmentcountbydate",params = {"date"},produces = "application/json")
    public List<Object[]> getAppointmentCountByDate(@RequestParam("date") LocalDate date){


//        System.out.println(reportDao.getAppointmentCountByDate(localDate));
        List<Object[]>  appointmentCountByDatet= reportDao.getAppointmentCountByDate(date);

        return appointmentCountByDatet;
    }



    //  [/appointmentfilteredlist?doctor=1&date=1&status=1]
    @GetMapping(value = "/appointmentfilteredlist",params = {"doctor","date"},produces = "application/json")
    public List<AppointmentScheduling> getAppointmentListByDoctorDateStatus(@RequestParam("doctor") int doctor, @RequestParam("date") LocalDate date){
        return reportDao.getAppointmentListByDoctorDateStatus(doctor,date);
    }



//    get purchase order item and qty on specified time period
    @GetMapping(value = "/porderdrugcountbydate",params ={"startdate","enddate"},produces = "application/json")
    public List<POrderCountReport> getPOrderCountByDate(@RequestParam("startdate") LocalDate startdate ,@RequestParam("enddate") LocalDate enddate){

        String[][]  POrderDrugList=reportDao.getPOrderCountByDate(startdate,enddate);

        List<POrderCountReport> pOrderCountReportList=new ArrayList<>();
        for (String[] listItem:POrderDrugList) {
            POrderCountReport pOrderCountReport=new POrderCountReport();
            pOrderCountReport.setItemName(listItem[0]);
            pOrderCountReport.setItemCount(listItem[1]);

            pOrderCountReportList.add(pOrderCountReport);
        }
           return pOrderCountReportList;
    }


//    sales by date  [/salesbydate?startdate=2024-07-01&endate=2027-07-20&option=daily]
@GetMapping(value = "/salesbydate",params ={"startdate","enddate","option"},produces = "application/json")
public List<SalesReport> getSalesBySpecifiedDateRange(@RequestParam("startdate") LocalDate startdate ,@RequestParam("enddate") LocalDate enddate,@RequestParam("option") String option){

//        if the option is daily then get the daily income sum
        if (Objects.equals(option, "daily")){
            String[][] dailySales= reportDao.getSalesByDaily(startdate,enddate,option);

            List<SalesReport> salesReportList=new ArrayList<>();
            for (String[] listItem:dailySales){
                SalesReport salesReport=new SalesReport();
                salesReport.setTotalsale(listItem[0]);
                salesReport.setDate(listItem[1]);

                salesReportList.add(salesReport);
            }
            return  salesReportList;

        }
        else if (Objects.equals(option, "weekly")) {
//            //        if the option is weekly then get the weekly income sum
            String[][] weeklySales= reportDao.getSalesByWeekly(startdate,enddate,option);

            List<SalesReport> salesReportList=new ArrayList<>();
            for (String[] listItem:weeklySales){
                SalesReport salesReport=new SalesReport();
                salesReport.setTotalsale(listItem[0]);
                salesReport.setDate(listItem[1]);

                salesReportList.add(salesReport);
            }
            return  salesReportList;
        } else if (Objects.equals(option, "monthly")) {
            //        if the option is monthly then get the monthly income sum

            String[][] salesByMonthly= reportDao.getSalesByMonthly(startdate,enddate,option);

            List<SalesReport> salesReportList=new ArrayList<>();
            for (String[] listItem:salesByMonthly){
                SalesReport salesReport=new SalesReport();
                salesReport.setTotalsale(listItem[0]);
                salesReport.setDate(listItem[1]);

                salesReportList.add(salesReport);
            }
            return  salesReportList;

        }else {
//                  if the option is yearly then get the yearly income sum
            String[][] salesByYearly= reportDao.getSalesByYearly(startdate,enddate,option);

            List<SalesReport> salesReportList=new ArrayList<>();
            for (String[] listItem:salesByYearly){
                SalesReport salesReport=new SalesReport();
                salesReport.setTotalsale(listItem[0]);
                salesReport.setDate(listItem[1]);

                salesReportList.add(salesReport);
            }
            return  salesReportList;
        }


}

    //    get  drug name ,available qty , rop
    @GetMapping(value = "/getdruginventory",produces = "application/json")
    public List<DrugsInventoryReport> getInventoryReport(){

        String[][]  drugsInventoryList=reportDao.getInventoryReport();

        List<DrugsInventoryReport> drugsInventoryReportList=new ArrayList<>();
        for (String[] listItem:drugsInventoryList) {
            DrugsInventoryReport DrugsInventoryReport=new DrugsInventoryReport();
            DrugsInventoryReport.setAvailableQty(listItem[0]);
            DrugsInventoryReport.setItemname(listItem[1]);
            DrugsInventoryReport.setRop(listItem[2]);


            drugsInventoryReportList.add(DrugsInventoryReport);
        }
        return drugsInventoryReportList;
    }

    //    get  drug name ,available qty , rop which are in low stock
    @GetMapping(value = "/getlowdruginventory",produces = "application/json")
    public List<DrugsInventoryReport> getLowDrugInventoryReport(){

        String[][]  drugsInventoryList=reportDao.getLowDrugInventoryReport();

        List<DrugsInventoryReport> drugsInventoryReportList=new ArrayList<>();
        for (String[] listItem:drugsInventoryList) {
            DrugsInventoryReport DrugsInventoryReport=new DrugsInventoryReport();
            DrugsInventoryReport.setAvailableQty(listItem[0]);
            DrugsInventoryReport.setItemname(listItem[1]);
            DrugsInventoryReport.setRop(listItem[2]);


            drugsInventoryReportList.add(DrugsInventoryReport);
        }
        return drugsInventoryReportList;
    }



//    get the expiring drug details which are expiring one month from current date

    @GetMapping(value = "/expiringdrugs",produces = "application/json")
    public ArrayList<ExpiringDrugDetails> getExpiringDrugDetails(){

        LocalDate currentDate=LocalDate.now();
        LocalDate oneMonthAhead=LocalDate.now().plusMonths(1);
        System.out.println(oneMonthAhead);

        String[][] expiringDrugList=reportDao.getExpiringDrugDetails(currentDate,oneMonthAhead);

        ArrayList<ExpiringDrugDetails> expiringDrugDetailsArrayList=new ArrayList<>();
         for (String[] item:expiringDrugList){
             ExpiringDrugDetails expiringDrugDetails=new ExpiringDrugDetails();
             expiringDrugDetails.setName(item[0]);
             expiringDrugDetails.setBatchno(item[1]);
             expiringDrugDetails.setExpirydate(item[2]);
             expiringDrugDetails.setAvailableqty(item[3]);

             expiringDrugDetailsArrayList.add(expiringDrugDetails);
         }

         return expiringDrugDetailsArrayList;
    }



    @GetMapping(value = "/lastdoctoravailabilitydate",params = {"doctor"},produces = "application/json")
    public LocalDate getLastDoctorAvailabilityDate(@RequestParam("doctor") int doctor){
        return reportDao.getLastDoctorAvailabilityDate(doctor);
    }

//    get the ordered quantity by drug id , start date and end date
    @GetMapping(value = "/getroqbymonth",params = {"drugid","startdate","enddate"},produces = "application/json")
    public List<RoqReport> getRoqDrugByMonth(@RequestParam("drugid") int drugid, @RequestParam("startdate") LocalDate startdate,@RequestParam("enddate") LocalDate enddate){
        String[][]  roqDrugByMonthList=reportDao.getRoqDrugByMonth(drugid,startdate,enddate);


        ArrayList<RoqReport> roqReportArrayList=new ArrayList<>();

        for(String[] roqMonthListItem:roqDrugByMonthList){
            RoqReport roqReport=new RoqReport();
            roqReport.setMonth(roqMonthListItem[1]);
            roqReport.setItemCount(roqMonthListItem[0]);

            roqReportArrayList.add(roqReport);
        }

         return roqReportArrayList;
    }

    //    get the sales quantity by drug id , start date and end date
    @GetMapping(value = "/getropbymonth",params = {"drugid","startdate","enddate"},produces = "application/json")
    public List<RoqReport> getRopDrugByMonth(@RequestParam("drugid") int drugid, @RequestParam("startdate") LocalDate startdate,@RequestParam("enddate") LocalDate enddate){
        String[][]  ropDrugByMonthList=reportDao.getRopDrugByMonth(drugid,startdate,enddate);


        ArrayList<RoqReport> ropReportArrayList=new ArrayList<>();

        for(String[] ropMonthListItem:ropDrugByMonthList){
            RoqReport ropReport=new RoqReport();
            ropReport.setMonth(ropMonthListItem[1]);
            ropReport.setItemCount(ropMonthListItem[0]);

            ropReportArrayList.add(ropReport);
        }

        return ropReportArrayList;
    }

//    get supplier details by drug name
    @GetMapping(value = "/getreportsupplierdetails",params = {"drugname"},produces = "application/json")
    public List<SupplierDetails> getSupplierDetailsByDrugNameReport(@RequestParam("drugname") String drugname){
        String[][]  supplierDetailsByDrugName=reportDao.getSupplierDetailsByDrugNameReport(drugname);


        ArrayList<SupplierDetails> supplierDetailsArrayList=new ArrayList<>();

        for(String[] supplierDetailItem:supplierDetailsByDrugName){
            SupplierDetails supplierDetails=new SupplierDetails();
            supplierDetails.setRegno(supplierDetailItem[0]);
            supplierDetails.setName(supplierDetailItem[1]);
            supplierDetails.setContactno(supplierDetailItem[2]);
            supplierDetails.setEmail(supplierDetailItem[3]);
            supplierDetails.setConversionfactor(supplierDetailItem[4]);
            supplierDetails.setArrearsamount(supplierDetailItem[5]);
            supplierDetails.setSupplierstatus(supplierDetailItem[6]);

            supplierDetailsArrayList.add(supplierDetails);
        }

        return supplierDetailsArrayList;
    }


}
