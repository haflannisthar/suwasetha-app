package com.suwasethaclinic.controller;

import com.suwasethaclinic.dao.BatchDao;
import com.suwasethaclinic.dao.UserDao;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class BatchController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private BatchDao dao;




    @GetMapping(value = "/batch/findall" , produces = "application/json")
    public List<Batch>findAll(){

        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

//    @GetMapping(value = "/batch/getsalesdrugavailablelist" , produces = "application/json")
//    public List<Batch>getSalesDrugAvailableList(){
//
//        LocalDate currenDate=LocalDate.now().plusDays(7);
//
//        return dao.getSalesDrugAvailableList(currenDate);
//    }


//    /get batch no by drugid
    @GetMapping(value = "/batch/getbatchnobydrugid/{drugId}" , produces = "application/json")
    public List<Batch> getBatchBydrugId(@PathVariable("drugId") Integer drugId){
       return  dao.getBatchDetailsByDrugId(drugId);
    }


    //    /get the available drug qty by drug id and drug must not expired
    @GetMapping(value = "/batch/getavailabledrugqty/{salesdrugId}" , produces = "application/json")
    public Integer getAvailableDrugQty(@PathVariable("salesdrugId") Integer salesdrugId){

        LocalDate currenDate=LocalDate.now().plusDays(7);
        System.out.println(currenDate);

        Integer availableQtyDrugId=dao.getAvailableQtyDrugId(salesdrugId,currenDate);
        System.out.println(availableQtyDrugId);

        if (availableQtyDrugId==null){
            return 0;
        }

        return availableQtyDrugId;

    }

    //    /get the available drug qty and unit price by drug id
    @GetMapping(value = "/batch/getavailabledrugqtyandunitprice/{salesdrugId}" , produces = "application/json")
    public List<Batch> getAvailableDrugQtyAndUnitPrice(@PathVariable("salesdrugId") Integer salesdrugId){

        LocalDate currenDate=LocalDate.now().plusDays(15);

         return  dao.getAvailableQtyAndUnitPriceByDrugId(salesdrugId,currenDate);


    }



    //    /get the available drug qty  by drug id and batch
    @GetMapping(value = "/batch/getavailableqty/{salesdrugId}/{batchid}" , produces = "application/json")
    public Integer getAvailableDrugQtyByDrugAndBatch(@PathVariable("salesdrugId") Integer salesdrugId,@PathVariable("batchid") Integer batchid){


        return  dao.getAvailableDrugQtyByDrugAndBatch(salesdrugId,batchid);


    }






    //get batch purchase price by drug name and batch
@GetMapping(value = "/batch/getdrugunitprice/{drugid}/{batchid}" , produces = "application/json")
public BigDecimal getPurchaseDrugUnitPrice(@PathVariable("drugid") Integer drugid, @PathVariable("batchid") Integer batchid){

    return dao.getPurchaseDrugUnitPrice(drugid,batchid);
}

    //get batch no by sales drug id which is closer to expiry date
    @GetMapping(value = "/batch/getbatchbysalesdrugid/{drugid}/{totalqty}" , produces = "application/json")
    public Batch getBatchBySalesDrugId(@PathVariable("drugid") Integer drugid, @PathVariable("totalqty") Integer totalqty){

        List<Batch> Batches=dao.getBatchBySalesDrugIdAndQtyCloserToExpiry(drugid,totalqty);

        for (Batch batch:Batches) {
            if (batch.getSalesdrugavailableqty()>=totalqty){
                return batch;
            }
        }

        return null;
    }

//    ----------------------------------------------------------------------------------------------------------------------------
    //get batch list  by sales drug id which is closer to expiry date
    @GetMapping(value = "/batch/getbatclisthbysalesdrugid/{drugid}" , produces = "application/json")
    public List<Batch> getBatchListBySalesDrugId(@PathVariable("drugid") Integer drugid){

        LocalDate currenDate=LocalDate.now().plusDays(15);


        return  dao.getBatchListBySalesDrugIdAndQtyCloserToExpiry(drugid,currenDate);



    }

//-----------------------------------------------------------------------------------------------------------------------------------------

    @GetMapping(value = "/batch")
    public ModelAndView batchui(){
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
        viewUI.addObject("modulename","Batch");
        viewUI.addObject("title","Batch");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Batch");
        if (!logUserPriv.get("select")){
            viewUI.setViewName("errorpage.html");
            return  viewUI;
        }
        else {
            viewUI.setViewName("batch.html");
            return  viewUI;
        }


    }

    @Transactional
    @PostMapping(value = "/batch")
    public String saveBatch(@RequestBody Batch batch){

        //        authentication and authorization need to come
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Batch");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }

        //            batch no unique
         // check batch by batch no , expiriy date , man date and item id
        Batch batchDuplicate=dao.checkbatchdetail(batch.getBatchno(),batch.getPurchasedrug_id().getId(),batch.getManufacturedate(),batch.getExpirydate());

        if (batchDuplicate!=null ){
            return "batch already exists ";
        }

        try {
            batch.setAddeduser(userDao.getUserByUsername(auth.getName()).getId());
            batch.setAddeddatetime(LocalDateTime.now());

              dao.save(batch);

              return "OK";
        }
        catch (Exception e){
            return "save not successful"+e.getMessage();
        }
    }

    @Transactional
    @PutMapping(value = "/batch")
    public String updateBatch(@RequestBody Batch batch){
        //        authentication and authorization
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        //get the privilege for given module
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Batch");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }

        Batch extBatch=dao.getReferenceById(batch.getId());

        if (extBatch==null){
            return "Batch doesn't exists";
        }
        //            batch no unique
        // check batch by batch no , expiriy date , man date and item id
        Batch batchDuplicate=dao.checkbatchdetail(batch.getBatchno(),batch.getPurchasedrug_id().getId(),batch.getManufacturedate(),batch.getExpirydate());

        if (batchDuplicate!=null && batchDuplicate.getId()!= batch.getId() ){
            return "batch already exists ";
        }

       try {


           batch.setUpdatedatetime(LocalDateTime.now());
           batch.setUpdateuser(userDao.getUserByUsername(auth.getName()).getId());

           dao.save(batch);
          return "OK";
        }
         catch (Exception e){
        return "update not successful"+e.getMessage();
          }

    }
}
