package com.suwasethaclinic.controller;

import com.suwasethaclinic.dao.*;
import com.suwasethaclinic.entity.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class PaymentController {


    @Autowired
    private UserDao userDao;


    @Autowired
    private PrivilegeController privilegeController;


    @Autowired
    private PaymentDao dao;


    @Autowired
    private BatchDao batchDao;

    @Autowired
    private ItemTypeDao itemTypeDao;

    @Autowired
    private SalesDrugDao salesDrugDao;

    @Autowired
    private PurchaseDrugDao purchaseDrugDao;

    @Autowired
    private PrescriptionDao prescriptionDao;

    @Autowired
    private AppointmentStatusDao appointmentStatusDao;

    @Autowired
    private AppointmentSchedullingDao appointmentSchedullingDao;

    @GetMapping(value = "/appointmentpayment/findall", produces = "application/json")
    public List<Payment> getAppointmentPaymentList() {
        return dao.getAppointmentPaymentList();
    }

    @GetMapping(value = "/prescriptionpayment/findall", produces = "application/json")
    public List<Payment> getPaymentDataList() {
        return dao.getPaymentDataList();
    }


    //    get last added record by appointment id
    @GetMapping(value = "/appointmentpayment/getlastaddedrecordbyappno/{appId}", produces = "application/json")
    public Payment getLastAddedPayment(@PathVariable("appId") Integer appId) {
        return dao.getLastAddedPaymentByAppId(appId);
    }

    //    get last added record by bill no
    @GetMapping(value = "/prescriptionpayment/getpaymentbybillno/{billno}", produces = "application/json")
    public Payment getLastAddedPrescriptionPayment(@PathVariable("billno") Integer billno) {
        return dao.getLastAddedPaymentByBillNo(billno);
    }

    //ui setting --> appointment payment
    @Transactional
    @GetMapping(value = "/appointmentpayment")
    public ModelAndView AppointmentPaymentUI() {
        ModelAndView viewUI = new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        User loggeduser = userDao.getUserByUsername(auth.getName());

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        viewUI.addObject("loggedusername", auth.getName());
        viewUI.addObject("rolename", loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename", "Appointment Payment");
        viewUI.addObject("loggeduserimg", loggeduser.getUser_photo());

        viewUI.addObject("title", "Appointment Payment");

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(auth.getName(), "Appointment Payment");
        if (!logUserPriv.get("select")) {
            viewUI.setViewName("errorpage.html");
            return viewUI;
        } else {
            viewUI.setViewName("appointmentpayment.html");
            return viewUI;
        }


    }


    //ui setting --> appointment payment
    @Transactional
    @GetMapping(value = "/prescriptionpayment")
    public ModelAndView PrescriptionPaymentUI() {
        ModelAndView viewUI = new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        User loggeduser = userDao.getUserByUsername(auth.getName());

        viewUI.addObject("loggedusername", auth.getName());
        viewUI.addObject("rolename", loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("modulename", "Prescription Payment");
        viewUI.addObject("loggeduserimg", loggeduser.getUser_photo());

        viewUI.addObject("title", "Prescription Payment");

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(auth.getName(), "Prescription Payment");
        System.out.println(auth.getName()+logUserPriv);
        if (!logUserPriv.get("select")) {
            viewUI.setViewName("errorpage.html");
            return viewUI;
        } else {
            viewUI.setViewName("prescriptionpayment.html");
            return viewUI;
        }


    }

    @Transactional
    @PostMapping(value = "/appointmentpayment")
    public String saveAppointmentPayment(@RequestBody Payment payment) {

        //        authentication and authorization need to come
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(auth.getName(), "Appointment Payment");
        if (!logUserPriv.get("insert")) {
            return "Access denied ";
        }

        if(Objects.equals(payment.getInpaymentmethod_id().getName(), "card") && payment.getRefno()!=null){
            Payment extPayment=dao.getPaymentByReffNo(payment.getRefno());

            if (extPayment!=null){
                return "Duplicate payment Ref No";
            }
        }
                if(Objects.equals(payment.getInpaymentmethod_id().getName(), "transfer") && payment.getRefno()!=null){
            Payment extTransferPayment=dao.getPaymentByTransferReffNo(payment.getRefno(),payment.getBankname());

            if (extTransferPayment!=null){
                return "Duplicate Transfer Ref No";
            }
        }


        try {

            // get next payment bill no and set to payment
            String nextBillNo = dao.getNextBillNo();

            if (nextBillNo == null) {
                nextBillNo = LocalDate.now().getYear() + "00001";
            }
            payment.setBillno(nextBillNo);


            payment.setAddeduser(userDao.getUserByUsername(auth.getName()).getId());
            payment.setAddeddatetime(LocalDateTime.now());

//        for (PaymentHasBatch phb:payment.getPaymentHasBatchList()){
//            phb.setPayment_id(payment);
//        }

            dao.save(payment);
            return "OK";
        } catch (Exception e) {
            return "save not successful" + e.getMessage();
        }
    }


    @Transactional
    @PostMapping(value = "/prescriptionpayment")
    public String savePrescriptionPayment(@RequestBody Payment payment) {

        //        authentication and authorization need to come
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(auth.getName(), "Prescription Payment");
        if (!logUserPriv.get("insert")) {

            return "Access denied ";
        }

        if(Objects.equals(payment.getInpaymentmethod_id().getName(), "card") && payment.getRefno()!=null){
            Payment extPayment=dao.getPaymentByReffNo(payment.getRefno());

            if (extPayment!=null){
                return "Duplicate payment Ref No";
            }
        }

        if(Objects.equals(payment.getInpaymentmethod_id().getName(), "transfer") && payment.getRefno()!=null){
            Payment extTransferPayment=dao.getPaymentByTransferReffNo(payment.getRefno(),payment.getBankname());

            if (extTransferPayment!=null){
                return "Duplicate Transfer Ref No";
            }
        }

        try {

//            check prescription available in database if prescription is not null
            if (payment.getPrescription_id() != null) {
                Prescription extPrescription = prescriptionDao.getReferenceById(payment.getPrescription_id().getId());

                if (extPrescription == null) {

                    return "Prescription doesn't exist";
                }
                AppointmentScheduling extAppointment = appointmentSchedullingDao.getReferenceById(extPrescription.getAppointment_id().getId());
                extAppointment.setAppstatus_id(appointmentStatusDao.getReferenceById(3));

                appointmentSchedullingDao.save(extAppointment);

            }

            // get next payment bill no and set to payment
            String nextBillNo = dao.getNextBillNo();

            if (nextBillNo == null) {
                nextBillNo = LocalDate.now().getYear() + "00001";
            }
            payment.setBillno(nextBillNo);


            payment.setAddeduser(userDao.getUserByUsername(auth.getName()).getId());
            payment.setAddeddatetime(LocalDateTime.now());


//            check for available qty and entered qty in PaymentHasBatch list
            for (PaymentHasBatch phb : payment.getPaymentHasBatchList()) {
                Batch batch=batchDao.getReferenceById(phb.getBatch_id().getId());

                if (batch.getSalesdrugavailableqty()<phb.getQuantity()){
                    return "Entered Quantity is greater than Available Quantity";
                }

            }

            for (PaymentHasBatch phb : payment.getPaymentHasBatchList()) {
                phb.setPayment_id(payment);

//            get the batch record
                Batch extBatch = batchDao.getReferenceById(phb.getBatch_id().getId());


//            get item type of the drug
                ItemType extItemType = itemTypeDao.getReferenceById(extBatch.getPurchasedrug_id().getSalesdrug_id().getSubcategory_id().getCategory_id().getItemtype_id().getId());

//            get the sales drug
                Salesdrug extSalesDrug = salesDrugDao.getReferenceById(extBatch.getPurchasedrug_id().getSalesdrug_id().getId());
//         check that the drug is medicine and product type is capsule or tablet
                if (Objects.equals(extItemType.getName(), "Medicine") && (Objects.equals(extSalesDrug.getProducttype_id().getName(), "Tablet") || Objects.equals(extSalesDrug.getProducttype_id().getName(), "Capsules"))) {
//              get the conversion factor
                    Integer conversionFactor = purchaseDrugDao.getPurchaseDrugConversionFactor(extBatch.getPurchasedrug_id().getId());

//              get the purchase drug available qty from batch
                    Integer purchaseDrugAvailableQty = extBatch.getPurchasedrugavailableqty();

//              current sales drug available qty from batch
                    Integer currentSalesDrugAvailableQty = extBatch.getSalesdrugavailableqty();

//                   calculate the new sale drug available by   subtracting the current sales drug available qty by payment has batch  quantity
                    Integer newSaleDrugAvailableQty = currentSalesDrugAvailableQty - phb.getQuantity();

//            set the new sales drug available qty to batch
                    extBatch.setSalesdrugavailableqty(newSaleDrugAvailableQty);

//              if the sales drug become zero then purchase drug also become zero
                    if (newSaleDrugAvailableQty == 0) {
                        purchaseDrugAvailableQty = 0;
                        extBatch.setPurchasedrugavailableqty(purchaseDrugAvailableQty);
                    } else {
                        //                check that when a sale happen sales drug available qty passes a conversion factor multiplication
                        if (newSaleDrugAvailableQty / conversionFactor < currentSalesDrugAvailableQty / conversionFactor) {


                            purchaseDrugAvailableQty -= 1;
                            extBatch.setPurchasedrugavailableqty(purchaseDrugAvailableQty);
                        }
                    }
                } else {
//              for non medicine / medicine that is not capsule or tablet
//              get the purchase drug total qty and subtract the qty and set the purchase drug avail qty
                    Integer purchaseDrugAvailableQty = extBatch.getPurchasedrugavailableqty();
                    purchaseDrugAvailableQty = purchaseDrugAvailableQty - phb.getQuantity();

                    extBatch.setSalesdrugavailableqty(extBatch.getSalesdrugavailableqty()-phb.getQuantity());

                    extBatch.setPurchasedrugavailableqty(purchaseDrugAvailableQty);
                }


//            save batch
                batchDao.save(extBatch);
            }

            dao.save(payment);


            return nextBillNo;
        } catch (Exception e) {
            return "save not successful" + e.getMessage();
        }
    }

}
