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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class SupplierController {

    @Autowired
    private SupplierDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;
    @Autowired
    private SupplierStatusDao supplierStatusDao;


    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    @Autowired
    private EmailService emailService;


    @GetMapping(value = "/supplier/list" , produces = "application/json")
    public List<Supplier>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

//supplier list who is active
    @GetMapping(value = "/supplier/findall" , produces = "application/json")
    public List<Supplier>activeSupplierList(){
        return dao.getSupplierList();
    }


//    get supplier list who is in purchase order
    @GetMapping(value = "/supplier/porderedsupplierlist" , produces = "application/json")
    public List<Supplier>getItemOrderedSupplierList(){
        return dao.getItemOrderedSupplierList();
    }

    //    get supplier list who is in  grn
    @GetMapping(value = "/supplier/grnsupplierlist" , produces = "application/json")
    public List<Supplier>grnSupplierList(){
        return dao.getGrnSupplierList();
    }

////    get supplier bank details using supplier id
    @GetMapping(value = "/supplier/getbankdetails/{supplierid}" , produces = "application/json")
    public Supplier getSupplierBankDetails(@PathVariable("supplierid") Integer supplierid){

        return dao.getSupplierBankDetails(supplierid);


    }




    ////ui setting
    @Transactional
    @GetMapping(value = "/supplier" )
    public ModelAndView supplerui(){
        ModelAndView viewUI=new ModelAndView();
//        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUI.addObject("roles", roles);

        User loggeduser=userDao.getUserByUsername(auth.getName());
        viewUI.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUI.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewUI.addObject("loggedusername",auth.getName());
        viewUI.addObject("modulename","Supplier");
        viewUI.addObject("title","Supplier");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Supplier");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
           return  viewUI;
        }
        else {
            viewUI.setViewName("supplier.html");
            return  viewUI;
        }



    }
//
//////    save new supplier into database
   @Transactional
    @PostMapping(value = "/supplier")
    public  String saveSupplier(@RequestBody Supplier supplier){
//            get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Supplier");

       System.out.println(supplier.getName());

        if (!logUserPriv.get("insert")){
            return "access denied";
        }
//        check for supplier name duplicate
    Supplier duplicateSupplierName=dao.checkName(supplier.getName());
        if (duplicateSupplierName!=null){
            return "Entered Supplier Name already exists";
        }


//        check for duplicate brn
    Supplier duplicateBrn=dao.checkbrn(supplier.getBrn());
        if (duplicateBrn!=null){
            return "Entered BRN already exists";
        }

    //        check for duplicate Contact no
    Supplier duplicateContactNo=dao.checkContactNo(supplier.getContactno());
    if (duplicateContactNo!=null){
        return "Entered Contact Number already exists";
    }
    //        check for duplicate email
    Supplier duplicateEmail=dao.checkEmail(supplier.getEmail());
    if (duplicateEmail!=null){
        return "Entered E-mail already exists";
    }
    //        check for duplicate Contact person Number
    Supplier duplicateContactPersonNumber=dao.checkCPNumber(supplier.getContactpersonnumber());
    if (duplicateContactPersonNumber!=null){
        return "Entered Contact Person Number already exists";
    }
//check for account number duplicate if it is not null
       if (supplier.getAccountnumber()!=null ){
           Supplier extAccountNumber=dao.checkAccnumber(supplier.getAccountnumber());
           if (extAccountNumber!=null){
               return "Entered Account Number already exists";
           }
       }

    try {
         String nextSupplierNo=dao.getNextSupplierNumber();
         if (nextSupplierNo.equals("") || nextSupplierNo.equals(null)){
             supplier.setRegno("Sid00001");
         }
         else {
             supplier.setRegno(nextSupplierNo);
         }
         if (supplier.getArrearsamount()==null){
             supplier.setArrearsamount(BigDecimal.ZERO);
         }

         for (SupplierHasPurchasedrug shp:supplier.getPurchasedrugs()){
             shp.setSupplier_id(supplier);
         }
         supplier.setAddeddatetime(LocalDateTime.now());
         User loggeduser=userDao.getUserByUsername(auth.getName());
         supplier.setUser_id(loggeduser);
        dao.save(supplier);
        return "OK";

//        //send email
//        EmailDetails emailDetails=new EmailDetails();
//
//
//        emailDetails.setSendTo(supplier.getEmail());
//        emailDetails.setSubject("Supplier Registration Confirmation From SuwaSetha Clinic Kuruwita");
//
//
//        String supplierHeader = "<!DOCTYPE html>" +
//                "<html lang='en'>" +
//                "<head>" +
//                "<meta charset='UTF-8'>" +
//                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
//                "<style>" +
//                "    body {  margin: 0; padding: 0;  }" +
//                "    .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f3f2f0; }" +
//                "    .text-center { text-align: center; }" +
//                "    .mb-3 { margin-bottom: 1rem; }" +
//                "    .mt-3 { margin-top: 1rem; }" +
//                "    h1, h3,h4 { color: #343a40; }" +
//                "    p { color: #495057 ; margin: 0; padding: 0;}" +
//                "    .import_note { color: #880808;}" +
//                "</style>" +
//                "</head>" +
//                "<body>" +
//                "<div class='container'>";
//
//        String messageTitle = "<div class='text-center mb-3'>" +
//                "<h1>Dear " + supplier.getName() + ",</h1>" +
//                "<h4>We are pleased to inform the registration you as a supplier.\n Below are the details : </h4>" +
//                "</div>";
//
//        String supplierBankDetails="";
//
//        if (!Objects.equals(supplier.getAccountnumber(), "")){
//            supplierBankDetails=supplierBankDetails+"Account No : "+supplier.getAccountnumber()+"<br>";
//        }
//        if (!Objects.equals(supplier.getBankholdersname(), "")){
//            supplierBankDetails=supplierBankDetails+"Account Holder Name  : "+supplier.getBankholdersname()+"<br>";
//        }
//
//
//
//        String messageSupplierBody="<div class='mb-3'><p>Name : "+supplier.getName()+"</p><br/>" +
//                "<p>Reg No : "+supplier.getRegno()+"</p><br/>"+
//                "<p>Brn  : "+supplier.getBrn()+"</p><br/>"+
//                "<p>Address : "+supplier.getAddress()+"</p><br/>"+
//                "<p>Mobile Number : "+supplier.getContactno()+"</p><br/></div>";
//
//
//        String messageAccountDetailsBody = "<div class='mb-3' style='color: #495057;'>" +
//                "<p> Account Details :  " +"</p><br/>" +
//                supplierBankDetails +
//                "</div><div class=' mb-3'><h4>Items</h4></div><div><ul>";
//
//        String ItemList="";
//        for (Purchasedrug shd :supplier.getPurchasedrugs()){
//            ItemList=ItemList + "<li><p>"+shd.getName()+"</p></li>";
//        }
//
//
//        String messageSupplierFooter ="</ul></div><div class='text-center mb-3'>" +
//                "<h4 style='color:#343a40'>If you have any questions or require further assistance, please do not hesitate to contact us.<br/>" +
//                "<h4 style='color:#343a40'>Thank you for joining us. We are excited to work with you!<br/>" +
//                "</h4>" +
//                "</div>"+
//                "<div class='text-center mt-3'>" +
//                "<h3>Best Regards,<br>SUWASETHA CLINIC</h3>" +
//                "</div>" +
//                "</div>" +
//                "</body>" +
//                "</html>";
//
//// Combine all parts into one email body
//        String emailSupplierDetails = supplierHeader + messageTitle + messageSupplierBody+messageAccountDetailsBody+ ItemList+messageSupplierFooter;
//
//
//
////           email send
//        emailDetails.setMsgBody(emailSupplierDetails);
//        emailService.sendMail(emailDetails);
//



    }
    catch (Exception e){
        return "save not successful"+e.getMessage();
    }


}


//delete supplier record
    @Transactional
    @DeleteMapping(value = "/supplier")
    public String deleteSupplier(@RequestBody Supplier supplier){
    //        authentication and authorization
    Authentication auth= SecurityContextHolder.getContext().getAuthentication();

//get the privilege for given module
    HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Supplier");
    if (!logUserPriv.get("delete")){
        return "Access denied ";
    }

    try {
//            checkthe patient in db by id
        Supplier extSupplier=dao.getReferenceById(supplier.getId());
        if (extSupplier==null){
            return "Supplier not found";
        }
        supplier.setDeletedatetime(LocalDateTime.now());
        supplier.setSupplierstatus_id(supplierStatusDao.getReferenceById(3));

        dao.save(supplier);

        //get the pending orders for that supplier and if the supplier status is in delete then change the orders deleted
        List<PurchaseOrder> extPorderList=purchaseOrderDao.getPendingPorderListBySupplier(supplier.getId());
        for (PurchaseOrder po:extPorderList) {
            po.setPorderstatus_id(purchaseOrderStatusDao.getReferenceById(4));
            purchaseOrderDao.save(po);
        }

        return "OK";
    }
    catch (Exception e){
        return "something went wrong"+e.getMessage();
    }
}

//
//////update supplier record
    @Transactional
    @PutMapping (value = "/supplier")
    public String updateSupplier(@RequestBody Supplier supplier){
        //        get authentication object and check for authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
//        get the user privilege for sales-drug module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Supplier");

        if (!logUserPriv.get("update")){
            return "access denied";
        }
//check brand available on database by id
        Supplier extSupplier=dao.getReferenceById(supplier.getId());
        if (extSupplier==null){
            return "Supplier doesn't exists";
        }
//        check brand name available on database by name
        Supplier extSupplierByName=dao.checkName(supplier.getName());
        if (extSupplierByName!=null && extSupplierByName.getId()!= supplier.getId()){
            return "Entered Supplier Name already exists";
        }
//        ext supplier by Brn
        Supplier extSupplierByBrn=dao.checkbrn(supplier.getBrn());
        if (extSupplierByBrn!=null && extSupplierByBrn.getId()!= supplier.getId()){
            return "Entered BRN already exists";
        }
//        ext supplier by Email
        Supplier extSupplierByEmail=dao.checkEmail(supplier.getEmail());
        if (extSupplierByEmail!=null && extSupplierByEmail.getId()!= supplier.getId()){
            return "Entered Email already exists";
        }
//        ext supplier by contact no
        Supplier extSupplierContactNo=dao.checkContactNo(supplier.getContactno());
        if (extSupplierContactNo!=null  && extSupplierContactNo.getId()!= supplier.getId()){
            return "Entered Contact Number already exists";
        }
//        ext supplier by contact number
        Supplier extSupplierContactPersonNumber=dao.checkCPNumber(supplier.getContactpersonnumber());
        if (extSupplierContactPersonNumber!=null && extSupplierContactPersonNumber.getId()!= supplier.getId()){
            return "Entered Contact Person Number already exists";
        }
        if (supplier.getAccountnumber()!=null ){
//            ext supplier by Account Number
            Supplier extAccntNumber=dao.checkAccnumber(supplier.getAccountnumber());
            if (extAccntNumber!=null   && extAccntNumber.getId()!= supplier.getId()){
                return "Entered Account Number already exists";
            }
        }
        try {
//get the pending orders for that supplier and if the supplier status is in delete then change the orders deleted
            if (supplier.getSupplierstatus_id().getId()==3){
                List<PurchaseOrder> extPorderList=purchaseOrderDao.getPendingPorderListBySupplier(supplier.getId());
                for (PurchaseOrder po:extPorderList) {
                    po.setPorderstatus_id(purchaseOrderStatusDao.getReferenceById(4));
                    purchaseOrderDao.save(po);
                }
            }

            supplier.setUpdatedatetime(LocalDateTime.now());
            dao.save(supplier);






            return "OK";
        }
        catch (Exception e){
            return "update not successful"+e.getMessage();
        }


    }


}
