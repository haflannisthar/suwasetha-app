package com.suwasethaclinic.controller;

import com.suwasethaclinic.dao.PurchaseOrderHasPurchaseDrugDao;
import com.suwasethaclinic.entity.PurchaseOrderHasPurchaseDrug;
import com.suwasethaclinic.entity.Purchasedrug;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PurchaseOrderHasPurchaseDrugController {

    @Autowired
    private PurchaseOrderHasPurchaseDrugDao purchaseOrderHasPurchaseDrugDao;


    //        get p drug detail by porder no
    @GetMapping(value = "/purchasorderhasdrug/getorderedqty/{drugid}" , produces = "application/json")
    public List<PurchaseOrderHasPurchaseDrug> getpurchasedrugtybydrugid(@PathVariable("drugid") Integer drugid){

        return purchaseOrderHasPurchaseDrugDao.getpurchasedrugQtybyid(drugid);
    }


//    get the ordered drug qty by drug id and order id
    @GetMapping(value = "/php/getdrugqty/{drugid}/{poderid}" , produces = "application/json")
    public Integer getOrderedDrugQty(@PathVariable("drugid") Integer drugid,@PathVariable("poderid") Integer poderid){

        return purchaseOrderHasPurchaseDrugDao.getOrderedDrugQty(drugid,poderid);
    }


}
