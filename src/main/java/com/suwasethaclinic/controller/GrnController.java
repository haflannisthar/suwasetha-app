package com.suwasethaclinic.controller;


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
public class GrnController {

    @Autowired
    private GrnDao dao;

    @Autowired
    private  PrivilegeController privilegeController;

    @Autowired
    private BatchDao batchDao;

    @Autowired
    private  PurchaseDrugDao purchaseDrugDao;

    @Autowired
    private SalesDrugDao salesDrugDao;

    @Autowired
    private DrugStatusDao drugStatusDao;

    @Autowired
    private PurchaseDrugStatusDao purchaseDrugStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private GrnStatusDao grnStatusdao;

    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;



    @GetMapping(value = "/grn/findall" , produces = "application/json")
    public List<Grn> findAll(){

        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

//   received grn list for supplier payment
    @GetMapping(value = "/grn/receivedlist" , produces = "application/json")
    public List<Grn> receivedGrnList(){

        return dao.receivedGrnList();
    }


//   get  grn list by supplier id to fill in supplier payment form
    @GetMapping(value = "/grn/getgrnbysupplierid/{supplierid}",produces = "application/json" )
    public List<Grn> getGrnListBySupplierId(@PathVariable("supplierid") Integer supplierid){
          return  dao.getGrnListBySupplierId(supplierid);
    }

    //   get  grn list by grn id to fill in supplier payment form
    @GetMapping(value = "/grn/getgrnbygrnno/{grnid}",produces = "application/json" )
    public BigDecimal getGrnListByGrnId(@PathVariable("grnid") Integer grnid){

        return  dao.getGrnListByGrnId(grnid);

    }

    //   get  net amount by supplier id to fill in supplier payment form
    @GetMapping(value = "/grn/getnetamountbysupplierid/{supplierid}",produces = "application/json" )
    public BigDecimal getGrnNetAmountBySupplierId(@PathVariable("supplierid") Integer supplierid){
        return  dao.getGrnNetAmountBySupplierId(supplierid);
    }


    @GetMapping(value = "/grn")
    public ModelAndView GrnUI(){
        ModelAndView viewUi=new ModelAndView();
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        User loggeduser=userDao.getUserByUsername(auth.getName());

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        Set<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        viewUi.addObject("roles", roles);

        viewUi.addObject("rolename",loggeduser.getRoles().iterator().next().getName());
        viewUi.addObject("loggeduserimg",loggeduser.getUser_photo());
        viewUi.addObject("loggedusername",auth.getName());
        viewUi.addObject("modulename","Grn");
        viewUi.addObject("title","Grn");


        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Grn");
        if (!logUserPriv.get("select")){
            viewUi.setViewName("errorpage.html");
            return viewUi;
        }
        else {
            viewUi.setViewName("grn.html");
            return viewUi;
        }

    }
//
    @Transactional
    @PostMapping(value = "/grn")
    public  String grnSave(@RequestBody Grn grn){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Grn");
        if (!logUserPriv.get("insert")){
            return "access denied";
        }
        try {
            grn.setAddeddatetime(LocalDateTime.now());
            grn.setAddeduser(userDao.getUserByUsername(auth.getName()).getId());

            String nextGrnNo=dao.getnextgrnno();
            if (nextGrnNo == null || nextGrnNo.isEmpty()) {
                grn.setGrnno("GRN0001"); // Set a default starting value
            } else {
                grn.setGrnno(nextGrnNo); // Use the retrieved next grnno
            }

//            check the supplier bill no is duplicate for the supplier
            Grn extGrn=dao.getSbillNo(grn.getSupplierbillno(),grn.getPurchaseorder_id().getSupplier_id().getId());

            if (extGrn!=null){
                return "Entered Bill No Already Available for Supplier : "+grn.getPurchaseorder_id().getSupplier_id().getName();
            }


//set grn paid amount to zero
           grn.setPaidamount(BigDecimal.ZERO);

//            get supplier and arrears amount then add the net amount and then set it to the arrears amount
            Supplier extsupplier=supplierDao.getReferenceById(grn.getPurchaseorder_id().getSupplier_id().getId());
           BigDecimal arrSamount= extsupplier.getArrearsamount();
               arrSamount=arrSamount.add(grn.getNetamount());
             extsupplier.setArrearsamount(arrSamount);
             supplierDao.save(extsupplier);


            for (GrnHasBatch ghb : grn.getGrnHasBatchList()){
                ghb.setGrn_id(grn);
               //get the batch from grn has batch
                Batch extbatch=batchDao.getReferenceById(ghb.getBatch_id().getId());

                //get the  drug from ext batch
                Purchasedrug extpdrug=purchaseDrugDao.getReferenceById(extbatch.getPurchasedrug_id().getId());
                 if(Objects.equals(extpdrug.getSalesdrug_id().getSubcategory_id().getCategory_id().getItemtype_id().getName(), "Medicine")
                 && (Objects.equals(extpdrug.getSalesdrug_id().getProducttype_id().getName(),"Tablet")||Objects.equals(extpdrug.getSalesdrug_id().getProducttype_id().getName(),"Capsules") )
                 ){


                     // get total qty from grn has batch object
                     Integer ghbTotalQty= ghb.getQty();
                    //get existing purchase drug total qty and add into new qty and assign it to batch
                     Integer extPurchaseDrugQty=extbatch.getPurchasedrugtotalqty();
                     Integer totalPurchaseDrugQty=extPurchaseDrugQty+ghbTotalQty;
                     extbatch.setPurchasedrugtotalqty(totalPurchaseDrugQty);

                     //get salesdrug total qty from batch and calculate total qty and add it to existing batch sales qty and assign it to batch sales drug qty
                     //get conversion factor of the drug
                     Integer drugConversionFactor=extpdrug.getConversionfactor();
                     Integer extSalesDrugQty=extbatch.getSalesdrugavailableqty();
                     Integer salesDrugTotalQty=(drugConversionFactor * ghbTotalQty);
                     Integer totalSalesDrugQty=extSalesDrugQty+salesDrugTotalQty;
                     extbatch.setSalesdrugavailableqty(totalSalesDrugQty);

                     //purchase drug available qty set
                     Integer extPurchaseDrugAvailableQty=extbatch.getPurchasedrugavailableqty();
                     Integer newPurchaseDrugQty=ghb.getQty();
                     Integer totalPurchaseDrugAvailQty=extPurchaseDrugAvailableQty+newPurchaseDrugQty;
                     extbatch.setPurchasedrugavailableqty(totalPurchaseDrugAvailQty);

                 }
                 else {
//                     this is for non medicine like wools biscuits etc. and medicine that are not capsule or tablet


                     // get total qty from grn has batch object
                     Integer ghbTotalQty= ghb.getQty();
                     //get existing purchase drug total qty and add into new qty and assign it to batch
                     Integer extPurchaseDrugQty=extbatch.getPurchasedrugtotalqty();
                     Integer totalPurchaseDrugQty=extPurchaseDrugQty+ghbTotalQty;
                     extbatch.setPurchasedrugtotalqty(totalPurchaseDrugQty);

                     //get salesdrug total qty from batch and calculate total qty and add it to existing batch sales qty and assign it to batch sales drug qty

                     Integer extSalesDrugQty=extbatch.getSalesdrugavailableqty();
                     Integer totalSalesDrugQty=extSalesDrugQty+ghbTotalQty;
                     extbatch.setSalesdrugavailableqty(totalSalesDrugQty);

                     //purchase drug available qty set
                     Integer extPurchaseDrugAvailableQty=extbatch.getPurchasedrugavailableqty();
                     Integer newPurchaseDrugQty=ghb.getQty();
                     Integer totalPurchaseDrugAvailqty=extPurchaseDrugAvailableQty+newPurchaseDrugQty;
                     extbatch.setPurchasedrugavailableqty(totalPurchaseDrugAvailqty);


                 }
                batchDao.save(extbatch);

            }

//            change the status of sales drug and purchase drug to available
            for (GrnHasBatch ghb : grn.getGrnHasBatchList()){
                Purchasedrug extPDrug=purchaseDrugDao.getReferenceById(ghb.getBatch_id().getPurchasedrug_id().getId());
                if (extPDrug.getPurchasedrugstatus_id().getId()==2){
                    extPDrug.setPurchasedrugstatus_id(purchaseDrugStatusDao.getReferenceById(1));

                }
                purchaseDrugDao.save(extPDrug);

                Salesdrug extSalesDrug=salesDrugDao.getReferenceById(ghb.getBatch_id().getPurchasedrug_id().getSalesdrug_id().getId());
                if (extSalesDrug.getDrugstatus_id().getId()==2){
                    extSalesDrug.setDrugstatus_id(drugStatusDao.getReferenceById(1));

                }
                  salesDrugDao.save(extSalesDrug);
            }



//            change the purchase order status to received
            PurchaseOrder extPorder=purchaseOrderDao.getporderbyid(grn.getPurchaseorder_id().getId());


            if (extPorder!=null){
                extPorder.setPorderstatus_id(purchaseOrderStatusDao.getReferenceById(2));
                for (PurchaseOrderHasPurchaseDrug pohi :extPorder.getPurchaseOrderHasPurchaseDrugList()){
                    pohi.setPurchaseorder_id(extPorder);
                }
               purchaseOrderDao.save(extPorder);
            }

              dao.save(grn);
            return "OK";
        }
        catch (Exception e){
            return "something went wrong" +e.getMessage();
        }

    }


//    grn update mapping
    @Transactional
    @PutMapping(value = "/grn")
    public String grnUpdate(@RequestBody Grn grn){
        //        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

//get the privilege for given module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Grn");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }
//        check grn available on database by id
        Grn extgrn=dao.getReferenceById(grn.getId());
        if (extgrn==null){
            return "grn not found";

        }
        //            check the supplier billno is duplicate for the supplier

        Grn extgrnbybillno=dao.getSbillNo(grn.getSupplierbillno(),grn.getPurchaseorder_id().getSupplier_id().getId());

        if (extgrnbybillno!=null && extgrnbybillno.getId() !=grn.getId()){
            return "Entered  Bill No Already Available for Supplier : "+grn.getPurchaseorder_id().getSupplier_id().getName();
        }


        try {

            //            get supplier and arrears amount
            Supplier extsupplier=supplierDao.getReferenceById(grn.getPurchaseorder_id().getSupplier_id().getId());
            BigDecimal arrSamount= extsupplier.getArrearsamount();


             if (grn.getPaidamount().compareTo(extgrn.getPaidamount())!=0){
                 //            check whether the new updating grn paid amount is greater than existing grn
                 if (grn.getPaidamount().compareTo(extgrn.getPaidamount())>0){
//                if so subtract existing grn paid amount from updating object and then add it to arrears amount
                     arrSamount=arrSamount.add(grn.getPaidamount().subtract(extgrn.getPaidamount()));
                     extsupplier.setArrearsamount(arrSamount);
                 }
                 else{
                     //if ext grn greater than updating grn then subtract updating grn paid amount from ext grn object and then add it to arrears amount
                     arrSamount=arrSamount.add(extgrn.getPaidamount().subtract(grn.getPaidamount()));
                     extsupplier.setArrearsamount(arrSamount);
                 }
            }



           grn.setUpdatedatetime(LocalDateTime.now());
           grn.setUpdateuser(userDao.getUserByUsername(auth.getName()).getId());


             for (GrnHasBatch ghb : grn.getGrnHasBatchList()){
                ghb.setGrn_id(grn);
            }

           dao.save(grn);
           return "OK";

        }
        catch (Exception e){
            return "something went wrong "+e.getMessage();
        }
    }
//

}
