package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.ProductType;
import com.suwasethaclinic.entity.Salesdrug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface SalesDrugDao extends JpaRepository<Salesdrug,Integer> {

//sales drug duplicate check
    @Query("select sd from Salesdrug sd where sd.name=?1")
    Salesdrug getSalesDrugByName(String name);


//get avaliable sales drug record that not in purchasedrug
    @Query("select sd from Salesdrug sd where sd.id not in (select pd.salesdrug_id.id from Purchasedrug pd ) and sd.drugstatus_id.id=2 and sd.subcategory_id.category_id.itemtype_id.id=?1 ")
    List<Salesdrug> getsalesdrugrecordsnotinpurchase(Integer itemtypeid);

    //    check duplicate for item code
    @Query("select  s from Salesdrug s where s.code=?2 and s.brand_id.id=?1")
    Salesdrug getItemCode(Integer brandId,String code);

//    get the item type by drug id
    @Query("select s.subcategory_id.category_id.itemtype_id.id from Salesdrug s where s.id=?1")
    Integer getsalesdrugitemtype(Integer itemid);

//    get the drugs which is either medicine or medical equipment
    @Query("select new Salesdrug(s.id,s.name) from Salesdrug s where s.subcategory_id.id in (select sc.id from SubCategory sc where sc.category_id.id in (select ct.id from Category ct where ct.itemtype_id.id in (select  it.id from ItemType it where it.id!=2)))")
    List<Salesdrug> getSalesDrugListForPrescription();

//    get the product type by drug id
    @Query("select s.producttype_id from Salesdrug s where s.id=?1")
    ProductType getSalesDrugProductType(Integer salesdrugid);

//get the drug list for payment/pharmacy that drug is available in stock and not expired and available qty greater than 0
    @Query("select new Salesdrug(s.id,s.name) from Salesdrug s where s.id in (select pd.salesdrug_id.id from Purchasedrug pd where pd.id in (select b.purchasedrug_id.id from Batch b where b.expirydate>=?1 and b.salesdrugavailableqty>0))")
    List<Salesdrug> getSalesDrugListForPayment(LocalDate currenDatePlusSeven);

//get the sales  drug name by batch no
    @Query("select new Salesdrug(sd.id,sd.name) from Salesdrug sd where sd.id  in (select pd.salesdrug_id.id from Purchasedrug pd where pd.id in (select b.purchasedrug_id.id from Batch b where b.id=?1))")
    Salesdrug getSalesDrugNameByBatchNo(Integer batchId);

//    get the sales drug for roq report
    @Query("select new Salesdrug(sd.id,sd.name) from Salesdrug sd where sd.id  in (select pd.salesdrug_id.id from Purchasedrug pd where pd.id in (select b.purchasedrug_id.id from Batch b ))")
    List<Salesdrug> salesDrugForRoqReport();

    @Query("select s from Salesdrug s where s.id=?1")
    Salesdrug getdrugById(Integer itemid);
//get the drug details for the rop report []
    @Query("select new Salesdrug(sd.id,sd.name) from Salesdrug sd where sd.id  in (select pd.salesdrug_id.id from Purchasedrug pd where pd.id in (select b.purchasedrug_id.id from Batch b where b.id in (select phb.batch_id.id from PaymentHasBatch  phb)))")
    List<Salesdrug> salesDrugForRopReport();
}
