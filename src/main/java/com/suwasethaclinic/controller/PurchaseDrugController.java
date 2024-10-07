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

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class PurchaseDrugController {

    @Autowired
    private PurchaseDrugDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PurchaseDrugStatusDao drugStatusDao;

    @Autowired
    private SalesDrugDao salesDrugDao;

    @Autowired
    private DrugStatusDao SdrugStatusDao;

//    @Autowired
//    private



    @GetMapping(value = "/purchasedrug/list" , produces = "application/json")
    public List<Purchasedrug>findAll(){
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }


//    get drugs for supplier form
    @GetMapping(value = "/purchasedrug/availablelist" , produces = "application/json")
    public List<Purchasedrug>getavailableedrugsforsupplier(){

        return dao.getavailableedrugsforsupplier();

    }
    //    get drugs for supplier form that is not in supplier has purchase drug
    @GetMapping(value = "/purchasedrug/listwithoutsupplier/{supplierId}" , produces = "application/json")
    public List<Purchasedrug>getavailableedrugsnotinsupplierhaspurchase(@PathVariable("supplierId") Integer supplierId){

        return dao.getavailableedrugsnotinsupplierhaspurchase(supplierId);
    }

//        get drugs purchase order from filtered by supplier id
    @GetMapping(value = "/purchasedrug/filtereddruglist/{supplierId}" , produces = "application/json")
    public List<Purchasedrug>getpurchasedrugsbysupplierid(@PathVariable("supplierId") Integer supplierId){

        return dao.getpurchasedrugbysupplierid(supplierId);
    }

    //        get p drug detail by supplier
    @GetMapping(value = "/purchasedrug/getdrugnamesforbatch/{supplierid}" , produces = "application/json")
    public List<Purchasedrug>getpurchasedrugsbysupplierno(@PathVariable("supplierid") Integer supplierid){

        return dao.getpurchasedrugsbysupplierno(supplierid);
    }
    //        get p drug detail by porder no
    @GetMapping(value = "/purchasedrug/getitemlistbyorderid/{porderid}" , produces = "application/json")
    public List<Purchasedrug>getpurchasedrugsbyporderId(@PathVariable("porderid") Integer porderid){

        return dao.getpurchasedrugsbyporder(porderid);
    }

    //get purchase item conversion factor
    @GetMapping(value = "/purchasedrug/getconversionfactorbydrugid/{itemid}" , produces = "application/json")
    public Integer getPurchaseDrugConversionFactor(@PathVariable("itemid") Integer itemid){

        if (dao.getPurchaseDrugConversionFactor(itemid)!=null){
            return dao.getPurchaseDrugConversionFactor(itemid);

        }
//
           return 0;
    }

    ////    get drug detail  using supplier id
    @GetMapping(value = "/purchasedrug/getavailableqty/{drugid}/{supplierid}" , produces = "application/json")
    public Integer getDrugDetailBySupplierAndId(@PathVariable("drugid") Integer drugid,@PathVariable("supplierid") Integer supplierid){

        return dao.getDrugDetailBySupplierAndId(drugid,supplierid);


    }


    @Transactional
    @GetMapping(value = "/purchasedrug")
    public ModelAndView purchaseUI(){

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
        viewUI.addObject("modulename","Purchase-Item");
        viewUI.addObject("title","Purchase-Item");

        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Purchase-Drug");
        if (!logUserPriv.get("select")){

            viewUI.setViewName("errorpage.html");
            return viewUI;
        }
        else {
            viewUI.setViewName("purchasedrug.html");
            return viewUI;

        }

    }


    @Transactional
   @PostMapping(value = "/purchasedrug")
    public String savedrug(@RequestBody Purchasedrug purchasedrug){
        //        authentication and authorization need to come
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Purchase-Drug");
        if (!logUserPriv.get("insert")){
            return "Access denied ";
        }

        Purchasedrug extname=dao.getPurchaseDrugByName(purchasedrug.getName());
       if (extname!=null){
           return "Drug already exists";
       }
       try {
           purchasedrug.setAddeddatetime(LocalDateTime.now());
           String getnextcode=dao.getNextDrugCode();
           System.out.println(getnextcode);
           if (getnextcode=="" || getnextcode.equals(null)) {
               purchasedrug.setCode("SPI00001");
           } else {
               purchasedrug.setCode(getnextcode);
           }
           User loggeduser=userDao.getUserByUsername(auth.getName());
           purchasedrug.setUser_id(loggeduser);
           dao.save(purchasedrug);
           return "OK";
       }
       catch (Exception e){
           return "Save not successful"+e.getMessage();
       }

}


//purchase drug update
    @Transactional
    @PutMapping(value = "/purchasedrug")
    public String updatedrug(@RequestBody Purchasedrug purchasedrug){

        //        authentication and authorization need to come
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Purchase-Drug");
        if (!logUserPriv.get("update")){
            return "Access denied ";
        }

        Purchasedrug extdrug=dao.getReferenceById(purchasedrug.getId());
        if (extdrug==null){
            return "purchase drug doesn't exist";
        }

        Purchasedrug extdrugname=dao.getPurchaseDrugByName(purchasedrug.getName());
        if (extdrugname!=null && extdrugname.getId()!=purchasedrug.getId() ){
            return "Entered purchase drug already exists";
        }

        try {

            Salesdrug extSalesDrug=salesDrugDao.getReferenceById(purchasedrug.getSalesdrug_id().getId());

            if (purchasedrug.getPurchasedrugstatus_id().getId()==2){
                extSalesDrug.setDrugstatus_id(SdrugStatusDao.getReferenceById(2));
            } else if (purchasedrug.getPurchasedrugstatus_id().getId()==3) {
                extSalesDrug.setDrugstatus_id(SdrugStatusDao.getReferenceById(3));

            }else if (purchasedrug.getPurchasedrugstatus_id().getId()==1) {
                extSalesDrug.setDrugstatus_id(SdrugStatusDao.getReferenceById(1));

            }

            salesDrugDao.save(extSalesDrug);


            purchasedrug.setLastmodifydatetime(LocalDateTime.now());
            dao.save(purchasedrug);
            return "OK";

        }
        catch (Exception e){
            return "Update not successful" +e.getMessage();
        }
}

//

//    delete drug record
    @Transactional
    @DeleteMapping(value = "/purchasedrug")
    public  String deletedrug(@RequestBody Purchasedrug purchasedrug){

    //        authentication and authorization need to come
    Authentication auth= SecurityContextHolder.getContext().getAuthentication();
    HashMap<String,Boolean> logUserPriv=privilegeController.getPrivilegeByUserModule(auth.getName(),"Sales-Drug");
    if (!logUserPriv.get("delete")){
        return "Access denied ";
    }

    Purchasedrug extdrugname=dao.getReferenceById(purchasedrug.getId());
    if (extdrugname==null){
        return "drug not found";
    }
    try {
        extdrugname.setDeletedatetime(LocalDateTime.now());
//        set the drug status to deleted
        extdrugname.setPurchasedrugstatus_id(drugStatusDao.getReferenceById(3));

        List<Salesdrug> salesdruglist=salesDrugDao.findAll();

        for (Salesdrug sd:salesdruglist){
            if (sd.getId()==extdrugname.getSalesdrug_id().getId()){
                sd.setDrugstatus_id(SdrugStatusDao.getReferenceById(3));
                salesDrugDao.save(sd);
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
