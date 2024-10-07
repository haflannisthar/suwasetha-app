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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class SalesDrugController {

    @Autowired
    private SalesDrugDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private DrugStatusDao drugStatusDao;

    @Autowired
    private PurchaseDrugDao purchaseDrugDao;

    @Autowired
    private PurchaseDrugStatusDao purchaseDrugStatusDao;


    @GetMapping(value = "/salesdrug/list" , produces = "application/json")
    public List<Salesdrug>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }


//    get the sales drug list for prescription which is not grocery item
    @GetMapping(value = "/salesdrug/getsdlistforprescription" , produces = "application/json")
    public List<Salesdrug>getSalesDrugForPrescription(){

        return dao.getSalesDrugListForPrescription();
    }

    //    get the sales drug list for pharmacy/payment which is not expired and available qty greater than 0
    @GetMapping(value = "/salesdrug/getsalesdrugavailablelist" , produces = "application/json")
    public List<Salesdrug>getSalesDrugForPayment(){

        LocalDate currenDatePlusSeven= LocalDate.now().plusDays(15);
        return dao.getSalesDrugListForPayment(currenDatePlusSeven);
    }



    //    get the sales drug product type
    @GetMapping(value = "/salesdrug/getproducttype/{salesdrugid}" , produces = "application/json")
    public ProductType getSalesDrugProductType(@PathVariable("salesdrugid") Integer salesdrugid){

        return dao.getSalesDrugProductType(salesdrugid);
    }


    //    get the sales drug name by batch no
    @GetMapping(value = "/salesdrug/getdrugnamebybatchno/{batchId}" , produces = "application/json")
    public Salesdrug getSalesDrugNameByBatchNo(@PathVariable("batchId") Integer batchId){
//        System.out.println(dao.getSalesDrugNameByBatchNo(batchId));
        return dao.getSalesDrugNameByBatchNo(batchId);
    }



    //    sales drug without purchase drug record
@GetMapping(value = "/salesdrugwithoutpurchaserecord/listbyitemtype/{itemtypeid}" , produces = "application/json")
public List<Salesdrug>getsalesdrugrecords(@PathVariable("itemtypeid") Integer itemtypeid){

        return dao.getsalesdrugrecordsnotinpurchase(itemtypeid);
}

//get sales item item type

    @GetMapping(value = "/salesdrug/getitemtype/{itemid}" , produces = "application/json")
    public Integer getsalesdrugitemtype(@PathVariable("itemid") Integer itemid){

        return dao.getsalesdrugitemtype(itemid);
    }



//    get sales drug for roq report
@GetMapping(value = "/salesdrug/getdruglistforroq" , produces = "application/json")
public List<Salesdrug>salesDrugForRoqReport(){
    return dao.salesDrugForRoqReport();
}

    //    get sales drug for rop report
    @GetMapping(value = "/salesdrug/getdruglistforrop" , produces = "application/json")
    public List<Salesdrug>salesDrugForRopReport(){
        return dao.salesDrugForRopReport();
    }


//get sales drug by sales drug id
@GetMapping(value = "/salesdrug/getdrugbyid/{itemid}" , produces = "application/json")
public Salesdrug getSalesDrugBySalesDrugId(@PathVariable("itemid") Integer itemid){

    return dao.getdrugById(itemid);
}




    @Transactional
    @GetMapping(value = "/salesdrug")
    public ModelAndView salesUI(){

        ModelAndView viewUI=new ModelAndView();

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
        viewUI.addObject("modulename","Sales Item");
        viewUI.addObject("title","Sales Item");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        if (!logUserPriv.get("select")){

            viewUI.setViewName("errorpage.html");
            return viewUI;
        }
        else {
            viewUI.setViewName("salesdrug.html");
            return viewUI;

        }

    }


    @Transactional
   @PostMapping(value = "/salesdrug")
    public String saveDrug(@RequestBody Salesdrug salesdrug){
        //        authentication and authorization need to come
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }

        Salesdrug salesDrugByName=dao.getSalesDrugByName(salesdrug.getName());
       if (salesDrugByName!=null){
           return "Drug already exists";
       }

       Salesdrug extItemCode=dao.getItemCode(salesdrug.getBrand_id().getId(),salesdrug.getCode());
        if (extItemCode!=null){
            return "Item code entered  already exists";
        }

       try {
           salesdrug.setAddeddatetime(LocalDateTime.now());



           User loggeduser=userDao.getUserByUsername(auth.getName());
           salesdrug.setUser_id(loggeduser);
           dao.save(salesdrug);

           return "OK";
       }
       catch (Exception e){
           return "Save not successful"+e.getMessage();
       }

}


    @Transactional
    @PutMapping(value = "/salesdrug")
    public String updatedrug(@RequestBody Salesdrug salesdrug){

        //        authentication and authorization need to come
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }

        Salesdrug extSaleDrug=dao.getReferenceById(salesdrug.getId());
        if (extSaleDrug==null){
            return "drug doesn't exists";
        }


        Salesdrug extItemCode=dao.getItemCode(salesdrug.getBrand_id().getId(),salesdrug.getCode());
        if (extItemCode!=null && extItemCode.getId()!=salesdrug.getId()){
            return "Item code entered  already exists";
        }

        Salesdrug extDrugName=dao.getSalesDrugByName(salesdrug.getName());
        if (extDrugName!=null && extDrugName.getId()!=salesdrug.getId() ){
            return "Entered drugname already exists";
        }

        try {

            List<Purchasedrug> pd=purchaseDrugDao.findAll();

            for (Purchasedrug pob: pd){
                if (Objects.equals(pob.getSalesdrug_id().getId(), extSaleDrug.getId())){
                    if (salesdrug.getDrugstatus_id().getId() == 3){

                        pob.setPurchasedrugstatus_id(purchaseDrugStatusDao.getReferenceById(3));

                    } else if (salesdrug.getDrugstatus_id().getId() == 2) {
                        pob.setPurchasedrugstatus_id(purchaseDrugStatusDao.getReferenceById(2));

                    }else if (salesdrug.getDrugstatus_id().getId() == 1) {
                        pob.setPurchasedrugstatus_id(purchaseDrugStatusDao.getReferenceById(1));

                    }

                    purchaseDrugDao.save(pob);
                }
            }





            salesdrug.setLastmodifydatetime(LocalDateTime.now());

            dao.save(salesdrug);
            return "OK";

        }
        catch (Exception e){
            return "Update not successful" +e.getMessage();
        }
}


@Transactional
    @DeleteMapping(value = "/salesdrug")
    public  String deletedrug(@RequestBody Salesdrug salesdrug){

    //        authentication and authorization need to come
    Authentication auth= SecurityContextHolder.getContext().getAuthentication();
    HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
    if (!logUserPriv.get("delete")){
        return "Access denied ";
    }

    Salesdrug extdrugname=dao.getReferenceById(salesdrug.getId());
    if (extdrugname==null){
        return "drug not found";
    }
    try {
        extdrugname.setDeletedatetime(LocalDateTime.now());
        extdrugname.setDrugstatus_id(drugStatusDao.getReferenceById(3));


        List<Purchasedrug> pd=purchaseDrugDao.findAll();

        for (Purchasedrug pob: pd){
            if (pob.getSalesdrug_id().getId()==extdrugname.getId()){
               pob.setPurchasedrugstatus_id(purchaseDrugStatusDao.getReferenceById(3));
               purchaseDrugDao.save(pob);
            }
        }

        dao.save(extdrugname);


        return "OK";
    }
    catch (Exception e){
        return "delete not successful"+ e.getMessage();
    }


}

}
