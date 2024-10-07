package com.suwasethaclinic.controller;

import com.suwasethaclinic.Email.EmailDetails;
import com.suwasethaclinic.Email.EmailService;
import com.suwasethaclinic.dao.PurchaseOrderDao;
import com.suwasethaclinic.dao.PurchaseOrderStatusDao;
import com.suwasethaclinic.dao.SupplierDao;
import com.suwasethaclinic.dao.UserDao;
import com.suwasethaclinic.entity.PurchaseOrder;
import com.suwasethaclinic.entity.PurchaseOrderHasPurchaseDrug;
import com.suwasethaclinic.entity.Supplier;
import com.suwasethaclinic.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SupplierDao supplierDao;

//    purchase order find all method
    @GetMapping(value = "/purchaseorder/findall" , produces = "application/json")
    public List<PurchaseOrder> getPurchaseOrderDetails(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

//get purchase order number to grn form
    @GetMapping(value = "/purchaseorder/pOderNumber" , produces = "application/json")
    public List<PurchaseOrder> getPurchaseOrderNumber(){

        return dao.getPurchaseOrderNoDetails();
    }

//    calculate the hours diff
    @GetMapping(value = "/purchaseorder/disablebtn/{orderno}" , produces = "application/json")
    public Boolean getPurchaseOrderStaus(@PathVariable("orderno") String orderno){

        LocalDateTime currentDateTime=LocalDateTime.now();

        PurchaseOrder  pendingPurchaseOrder=dao.getPurchaseOrderStatus(orderno);

        LocalDate datePOrder=pendingPurchaseOrder.getAddeddatetime().toLocalDate();
        LocalDate dateCurrent=currentDateTime.toLocalDate();


        if (dateCurrent.equals(datePOrder)){
            Duration diffBetween=Duration.between(pendingPurchaseOrder.getAddeddatetime(), currentDateTime);

            long hourDiff= diffBetween.toHours();
            System.out.println(hourDiff);
            return hourDiff < 3;
        }
           return false;
    }





    //get orders for dashboard
    @GetMapping(value = "/purchaseorder/getpendingorders" , produces = "application/json")
    public List<PurchaseOrder> getPendingOrders(){

        LocalDate currentDate=LocalDate.now();
//        get pending orders
        return dao.getPendingOrders(currentDate);
    }

//    get purchase order item details to show on grn
    @GetMapping(value = "/purchasorder/getporderitemdetails/{porderid}" ,produces = "application/json")
    public List<PurchaseOrder> getPOrderItemDetails(@PathVariable("porderid") Integer porderid){
        return dao.getPorderItems(porderid);
    }

    //    get purchase order item details by supplierid
    @GetMapping(value = "/purchasorder/getporderitemdetailsbysupplier/{supplierid}" ,produces = "application/json")
    public List<PurchaseOrder> getPOrderItemDetailsBySuppilerId(@PathVariable("supplierid") Integer supplierid){


            return dao.getPOrderItemDetailsBySuppilerId(supplierid);

    }




    @GetMapping(value = "/purchaseorder")
    public ModelAndView purchaseOrderUI(){
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
        viewUI.addObject("modulename","PurchaseOrder");
        viewUI.addObject("title","PurchaseOrder");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Purchase Order");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("purchaseorder.html");
            return  viewUI;
        }


    }

    @Transactional
    @PostMapping(value = "/purchaseorder")
    public String saveOrder(@RequestBody PurchaseOrder purchaseOrder){

        //        authentication and authorization need to come
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Purchase Order");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }
        try {
            purchaseOrder.setAddeduser(userDao.getUserByUsername(auth.getName()).getId());
            purchaseOrder.setAddeddatetime(LocalDateTime.now());

//            set next code
            String nextcode=dao.getNextPOrderCode();

            if (nextcode==null){
                nextcode= LocalDate.now().getYear()+"000001";
            }
            purchaseOrder.setCode(nextcode);

            for (PurchaseOrderHasPurchaseDrug pohi :purchaseOrder.getPurchaseOrderHasPurchaseDrugList()){
                pohi.setPurchaseorder_id(purchaseOrder);
            }



            //           send email
            EmailDetails emailDetails=new EmailDetails();

            Supplier extSupplier=supplierDao.getReferenceById(purchaseOrder.getSupplier_id().getId());

            emailDetails.setSendTo(extSupplier.getEmail());
            emailDetails.setSubject("New Purchase Order From SuwaSetha Clinic Kuruwita");


            String purchaseOrderHeader = "<!DOCTYPE html>" +
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
                    "    p { color: #495057; margin: 0 0 1rem; }" +
                    "    .import_note { color: #880808;}" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>";

            String messageTitle = "<div class='text-center mb-3'>" +
                    "<h1>Dear " + purchaseOrder.getSupplier_id().getName() + ",</h1>" +
                    "<h4>We are pleased to inform you of a new purchase order.Below are the details of the purchase order : </h4>" +
                    "</div>";


            String messagePurchaseOrderBody = "<div class='mb-3'>" +
                    "<p> Purchase Order Code :  " + purchaseOrder.getCode() + "</p>" +
                    "<p>Required Date : " + purchaseOrder.getRequireddate() + "</p>" +
                    "<p>Note : " + purchaseOrder.getNote() + "</p>" +
                    "</div><div class='text-center mb-3'><h4>Order Items</h4></div><div><ul>";

            String orderItemList="";
            for (PurchaseOrderHasPurchaseDrug pohi :purchaseOrder.getPurchaseOrderHasPurchaseDrugList()){
                orderItemList=orderItemList + "<li><p>"+pohi.getPurchasedrug_id().getName()+" : "+pohi.getQuantity()+"</p></li>";
            }


            String messagePurchaseOrderFooter ="</ul></div><div class='text-center mb-3'>" +
                    "<h4 style='color:#343a40'>If you have any questions or require further assistance regarding this order, please do not hesitate to contact us.<br/>" +
                    "</h4>" +
                    "</div>"+
                    "<div class='text-center mt-3'>" +
                    "<h3>Best Regards,<br>SUWASETHA CLINIC</h3>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

// Combine all parts into one email body
            String emailPurchaseOrderDetails = purchaseOrderHeader + messageTitle + messagePurchaseOrderBody+orderItemList+ messagePurchaseOrderFooter;



//           email send
            emailDetails.setMsgBody(emailPurchaseOrderDetails);
            emailService.sendMail(emailDetails);

            dao.save(purchaseOrder);
              return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }
    }

    @Transactional
    @DeleteMapping(value = "/purchaseorder")
    public String deletePOrder(@RequestBody PurchaseOrder purchaseOrder){
        //        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        System.out.println("000");
        //get the privilege for given module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Purchase Order");
        if (!logUserPriv.get("delete")){
            return "Access denied ";
        }
        try {
            PurchaseOrder extPorder=dao.getReferenceById(purchaseOrder.getId());
            if (extPorder==null){
                return "Purchase Order Not Found";
            }
            extPorder.setDeletedatetime(LocalDateTime.now());

            extPorder.setDeleteuser(userDao.getUserByUsername(auth.getName()).getId());

            extPorder.setPorderstatus_id(purchaseOrderStatusDao.getReferenceById(4));

                    dao.save(extPorder);


            //           send email
            EmailDetails emailDetails=new EmailDetails();

            Supplier extSupplier=supplierDao.getReferenceById(purchaseOrder.getSupplier_id().getId());

            emailDetails.setSendTo(extSupplier.getEmail());
            emailDetails.setSubject("Regarding Purchase Order Cancellation ["+purchaseOrder.getCode()+"] from Suwasetha Clinic Kuruwita");


            String purchaseOrderHeader = "<!DOCTYPE html>" +
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
                    "    p { color: #495057; margin: 0 0 1rem; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>";

            String messageTitle = "<div class='text-center mb-3'>" +
                    "<h1>Dear " + purchaseOrder.getSupplier_id().getName() + ",</h1>" +
                    "<h4>We are sorry to inform you that the purchase order has been cancelled.<br/></h4>" +
                    "</div>";

            String pOrderDate= String.valueOf(purchaseOrder.getAddeddatetime());

            String messagePurchaseOrderBody = "<div class='mb-3'>" +
                    "<p> Purchase Order Code :  " + purchaseOrder.getCode() + "</p>" +
                    "<p>Order Date : " + pOrderDate.substring(0,10) + "</p>" +
                    "<p>Note : " + purchaseOrder.getNote() + "</p>" +
                    "</div>";

            String messagePurchaseOrderFooter ="<div class='text-center mb-3'>" +
                    "<h4 style='color:#343a40'>We apologize for any inconvenience caused, please do not hesitate to contact us.<br/>" +
                    "</h4>" +
                    "</div>"+
                    "<div class='text-center mt-3'>" +
                    "<h3>Best Regards,<br>SUWASETHA CLINIC</h3>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

// Combine all parts into one email body
            String emailPurchaseOrderDetails = purchaseOrderHeader + messageTitle + messagePurchaseOrderBody+ messagePurchaseOrderFooter;



//           email send
            emailDetails.setMsgBody(emailPurchaseOrderDetails);
            emailService.sendMail(emailDetails);



                    return "OK";

        }
        catch (Exception e){
            return "Delete not successful"+e.getMessage();
        }
    }


    @Transactional
    @PutMapping(value = "/purchaseorder")
    public String updateOrder(@RequestBody PurchaseOrder purchaseOrder){
        //        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        //get the privilege for given module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Purchase Order");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }

        PurchaseOrder extPorder=dao.getReferenceById(purchaseOrder.getId());

        if (extPorder==null){
            return "Purchase Order doesn't exists";
        }
        LocalDateTime currentDateTime=LocalDateTime.now();

        LocalDate datePOrder=extPorder.getAddeddatetime().toLocalDate();
        LocalDate dateCurrent=currentDateTime.toLocalDate();


        if (dateCurrent.equals(datePOrder)){
            Duration diffBetween=Duration.between(extPorder.getAddeddatetime(), currentDateTime);

            long hourDiff= diffBetween.toHours();
            System.out.println(hourDiff);
            return "Update Not Successful.Allowed Update Time Has Passed";
        }

        try {
           for (PurchaseOrderHasPurchaseDrug pohi :purchaseOrder.getPurchaseOrderHasPurchaseDrugList()){
               pohi.setPurchaseorder_id(purchaseOrder);
           }

           purchaseOrder.setUpdatedatetime(LocalDateTime.now());
           purchaseOrder.setUpdateuser(userDao.getUserByUsername(auth.getName()).getId());

//           if the purchase order is requested then send mail

           if (purchaseOrder.getPorderstatus_id().getId()==1){


               //           send email
               EmailDetails emailDetails=new EmailDetails();

               Supplier extSupplier=supplierDao.getReferenceById(purchaseOrder.getSupplier_id().getId());

               emailDetails.setSendTo(extSupplier.getEmail());
               emailDetails.setSubject("Update Regarding Purchase Order From SuwaSetha Clinic Kuruwita");


               String purchaseOrderHeader = "<!DOCTYPE html>" +
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
                       "    p { color: #495057; margin: 0 0 1rem; }" +
                       "    .import_note { color: #880808;}" +
                       "</style>" +
                       "</head>" +
                       "<body>" +
                       "<div class='container'>";

               String messageTitle = "<div class='text-center mb-3'>" +
                       "<h1>Dear " + purchaseOrder.getSupplier_id().getName() + ",</h1>" +
                       "<h4>We are writing  to inform you of an update to the purchase order.<br/>Below are the details of the Updated purchase order : </h4>" +
                       "</div>";


               String messagePurchaseOrderBody = "<div class='mb-3'>" +
                       "<p> Purchase Order Code :  " + purchaseOrder.getCode() + "</p>" +
                       "<p>Required Date : " + purchaseOrder.getRequireddate() + "</p>" +
                       "<p>Note : " + purchaseOrder.getNote() + "</p>" +
                       "</div><div class='text-center mb-3'><h4>Updated Order Items</h4></div><div><ul>";

               String orderItemList="";
               for (PurchaseOrderHasPurchaseDrug pohi :purchaseOrder.getPurchaseOrderHasPurchaseDrugList()){
                   orderItemList=orderItemList + "<li><p>"+pohi.getPurchasedrug_id().getName()+" : "+pohi.getQuantity()+"</p></li>";
               }


               String messagePurchaseOrderFooter ="</ul></div><div class='text-center mb-3'>" +
                       "<h4 style='color:#343a40'>If you have any questions or require further assistance regarding this update, please do not hesitate to contact us.<br/>" +
                       "</h4>" +
                       "</div>"+
                       "<div class='text-center mt-3'>" +
                       "<h3>Best Regards,<br>SUWASETHA CLINIC</h3>" +
                       "</div>" +
                       "</div>" +
                       "</body>" +
                       "</html>";

// Combine all parts into one email body
               String emailPurchaseOrderDetails = purchaseOrderHeader + messageTitle + messagePurchaseOrderBody+orderItemList+ messagePurchaseOrderFooter;



//           email send
               emailDetails.setMsgBody(emailPurchaseOrderDetails);
               emailService.sendMail(emailDetails);
           }






           dao.save(purchaseOrder);
          return "OK";
        }
         catch (Exception e){
        return "update not successful"+e.getMessage();
          }

    }
}
