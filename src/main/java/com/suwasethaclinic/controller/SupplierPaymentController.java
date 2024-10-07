package com.suwasethaclinic.controller;

import com.suwasethaclinic.Email.EmailDetails;
import com.suwasethaclinic.Email.EmailService;
import com.suwasethaclinic.dao.*;
import com.suwasethaclinic.entity.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class SupplierPaymentController {

    @Autowired
    private SupplierPaymentDao dao;


    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private GrnDao grnDao;

    @Autowired
    private GrnStatusDao grnStatusDao;

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private EmailService emailService;


    @GetMapping(value = "/supplierpayment/findall")
    public List<SupplierPayment> findAll() {
        return dao.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }


//    supplier payment UI
    @GetMapping(value = "/supplierpayment")
    public ModelAndView supplierPaymentUI() {
        ModelAndView viewUI = new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        User loggeduser=userDao.getUserByUsername(auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewUI.addObject("loggedusername", auth.getName());
        viewUI.addObject("modulename", "Supplier Payment");
        viewUI.addObject("title", "Supplier Payment");

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Payment");
        if (!logUserPriv.get("select")) {
            viewUI.setViewName("errorpage.html");
            return viewUI;
        } else {
            viewUI.setViewName("supplierpayment.html");
            return viewUI;
        }


    }

//    supplier payment save
    @Transactional
    @PostMapping(value = "/supplierpayment")
    public String savePayment(@RequestBody SupplierPayment supplierPayment) {

        //        authentication and authorization need to come
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Payment");
        if (!logUserPriv.get("insert")) {
            return "Access denied ";
        }
        try {
//            get supplier object add paid amount and set it to arrears amount
            Supplier extsupplier = supplierDao.getReferenceById(supplierPayment.getSupplier_id().getId());

            BigDecimal extSupplierGetArrearsAmount=extsupplier.getArrearsamount();
            if (extSupplierGetArrearsAmount!=null ){
                extsupplier.setArrearsamount(extsupplier.getArrearsamount().subtract(supplierPayment.getPaidamount()));

            }
            supplierDao.save(extsupplier);


            supplierPayment.setAddeduser(userDao.getUserByUsername(auth.getName()).getId());
            supplierPayment.setAddeddatetime(LocalDateTime.now());


//            get the next bill no
            Integer nextBillNo = dao.nextBillNo();

            if (nextBillNo == null) {
                nextBillNo = Integer.valueOf(LocalDate.now().getYear() + "000001");

            }
            supplierPayment.setBillno(nextBillNo);


            for (SupplierPaymentHasGrn spg : supplierPayment.getSupplierPaymentHasGrnList()) {
                spg.setSupplierpayment_id(supplierPayment);


            }

            dao.save(supplierPayment);

            for (SupplierPaymentHasGrn spg : supplierPayment.getSupplierPaymentHasGrnList()) {
//                get the ext grn by  SupplierPaymentHasGrn list grn id
                Grn extgrn = grnDao.getReferenceById(spg.getGrn_id().getId());

//                get the paid amount in the ext grn and add the spg paid amount and set that paid amount to ext grn
                BigDecimal paidAmount = extgrn.getPaidamount().add(spg.getPaidamount());

                extgrn.setPaidamount(paidAmount);
//calculate the balance and if the balance is > 0 then set the status to partially completed and if the balance is 0 then set the status to fully completed
                BigDecimal balance = extgrn.getNetamount().subtract(extgrn.getPaidamount());
                BigDecimal baseValue = new BigDecimal("0.00");
                if (balance.compareTo(baseValue) > 0) {
                    extgrn.setGrnstatus_id(grnStatusDao.getReferenceById(2));
                } else if (balance.compareTo(baseValue) == 0) {
                    extgrn.setGrnstatus_id(grnStatusDao.getReferenceById(1));
                }

                grnDao.save(extgrn);
            }

            //send email
            EmailDetails emailDetails=new EmailDetails();


//
            emailDetails.setSendTo(supplierPayment.getSupplier_id().getEmail());
            emailDetails.setSubject("Payment Confirmation From SuwaSetha Clinic Kuruwita");


            String supplierHeader = "<!DOCTYPE html>" +
                    "<html lang='en'>" +
                    "<head>" +
                    "<meta charset='UTF-8'>" +
                    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                    "<style>" +
                    "    body {  margin: 0; padding: 0;  }" +
                    "    .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f3f2f0; }" +
                    "    .text-center { text-align: center; }" +
                    "    .mb-3 { margin-bottom: 1rem; }" +
                    "    .mt-3 { margin-top: 1rem; }" +
                    "    h1, h3,h4 { color: #343a40; }" +
                    "    p { color: #495057 ; margin: 0; padding: 0;}" +
                    "    .import_note { color: #880808;}" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>";

            String messageTitle = "<div class='text-center mb-3'>" +
                    "<h1>Dear " + supplierPayment.getSupplier_id().getName() + ",</h1>" +
                    "<h4>We are pleased to inform you that a payment has been made to your account. Below are the details of the payment: </h4>" +
                    "</div>";

            String messageSupplierBody="<div class='mb-3'><p>Supplier Name : "+supplierPayment.getSupplier_id().getName()+"</p><br/>" +
                    "<p>Bill No : "+supplierPayment.getBillno()+"</p><br/>"+
                    "<p>Payment Method  : "+supplierPayment.getPaymentmethod_id().getName()+"</p><br/>" +
                    "</div>";

            String   supplierPaymentDetails="Paid Amount"+supplierPayment.getPaidamount()+"<br>"+
                    "Balance Amount"+supplierPayment.getBalanceamount();

            String paymentMethod="";

            if (Objects.equals(supplierPayment.getPaymentmethod_id().getName(), "cheque")){
                paymentMethod="Cheque No : "+supplierPayment.getCheckno()+"<br/>"+"Check Date : "+supplierPayment.getCheckdate();
            }

            if (Objects.equals(supplierPayment.getPaymentmethod_id().getName(), "bank deposit")){
                paymentMethod="Account No : "+supplierPayment.getAccountno()+"<br/>"+"Bank Name : "+supplierPayment.getBankname()+
                        "<br/>"+"Deposit Date Time : "+supplierPayment.getDepositdatetime().toString().substring(0,10)+" "+supplierPayment.getDepositdatetime().toString().substring(11,16);
            }

            if (Objects.equals(supplierPayment.getPaymentmethod_id().getName(), "bank transfer")) {
                paymentMethod = "Transfer Id : " + supplierPayment.getTransferid() + "<br/>";

            }


            String messageAccountDetailsBody = "<div class='mb-3' style='color: #495057;'>" +
                    "<p> Payment Details :  " +"</p><br/>" +
                    supplierPaymentDetails +
                    "</div>"+"<div class='mb-3' style='color: #495057;'>" +
                    "<p>" +"</p><br/>" +
                    paymentMethod +
                    "</div>";



            String messageSupplierPaymentEmailFooter ="<div class='text-center mb-3'>" +
                    "<h4 style='color:#343a40'>If you have any questions or require further assistance, please do not hesitate to contact us.<br/>" +
                    "<h4 style='color:#343a40'>Thank you for your cooperation.<br/>" +
                    "</h4>" +
                    "</div>"+
                    "<div class='text-center mt-3'>" +
                    "<h3>Best Regards,<br>SUWASETHA CLINIC</h3>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

// Combine all parts into one email body
            String emailSupplierDetails = supplierHeader + messageTitle + messageSupplierBody+messageAccountDetailsBody+messageSupplierPaymentEmailFooter;



//           email send
            emailDetails.setMsgBody(emailSupplierDetails);
            emailService.sendMail(emailDetails);



            return "OK";
        } catch (Exception e) {
            return "save not successful" + e.getMessage();
        }
    }
}

