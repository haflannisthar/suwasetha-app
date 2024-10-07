package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface BatchDao extends JpaRepository<Batch,Integer> {


//    get the batch by purchase drug id
    @Query("select b from Batch b where b.purchasedrug_id.id=?1")
    List<Batch> getBatchDetailsByDrugId(Integer drugId);

//    get the batch by given parameters
    @Query("select b from Batch b where b.batchno=?1 and b.purchasedrug_id.id=?2 and b.manufacturedate=?3 and b.expirydate=?4")
    Batch checkbatchdetail(String batchno, Integer id, LocalDate manufacturedate, LocalDate expirydate);

//    get the not expired drug count for prescription UI
    @Query("select sum(b.salesdrugavailableqty) from Batch b where b.expirydate>=?2 and b.purchasedrug_id.id in (select pd.id from Purchasedrug pd where pd.salesdrug_id.id in (select sd.id from Salesdrug sd where sd.id=?1))")
    Integer getAvailableQtyDrugId(Integer salesdrugId, LocalDate currendate);

//    get the available qty and unit price by drug id
//    new Batch(b.id,b.batchno,b.salesdrugavailableqty,b.saleprice)
    @Query("select b from Batch b  where b.purchasedrug_id.id in (select pd.id from Purchasedrug pd where pd.salesdrug_id.id in (select sd.id from Salesdrug sd where sd.id=?1)) and b.salesdrugavailableqty>0 and b.expirydate>=?2 group by b.id order by b.expirydate asc ")
  List<Batch> getAvailableQtyAndUnitPriceByDrugId(Integer salesdrugId,LocalDate currentdate);

//    get the purchase price by batch id and purchase drug id
    @Query("select b.purchaseprice from Batch b where b.id=?2 and b.purchasedrug_id.id=?1")
    BigDecimal getPurchaseDrugUnitPrice(Integer drugid, Integer batchid);
//
    @Query("select b from Batch b where b.purchasedrug_id.salesdrug_id.id=?1 and b.salesdrugavailableqty>=?2 order by b.expirydate asc ")
    List<Batch> getBatchBySalesDrugIdAndQtyCloserToExpiry(Integer drugid, Integer totalqty);

//    get the sales drug available qty by id and sales drug id
    @Query("select b.salesdrugavailableqty from Batch b where b.id=?2 and b.purchasedrug_id.salesdrug_id.id=?1")
    Integer getAvailableDrugQtyByDrugAndBatch(Integer salesdrugId, Integer batchid);

//    get the batch list by sales drug id where available qty >0 and order by expiry date asc
    @Query("select b from Batch  b where b.purchasedrug_id.salesdrug_id.id=?1 and b.salesdrugavailableqty >0 and b.expirydate>=?2  order by b.expirydate asc")
    List<Batch> getBatchListBySalesDrugIdAndQtyCloserToExpiry(Integer drugid,LocalDate currenDate);

//    new Batch(b.id,b.batchno,b.salesdrugavailableqty)
//    @Query("select b from Batch b where b.purchasedrug_id.id in (select p.id from Purchasedrug p where p.salesdrug_id.id in (select s.id from Salesdrug s WHERE s.id=?1))")
//    Batch getBatchBySalesDrugId(Integer id);

//    @Query("select  new Batch(b.id,b.salesdrugavailableqty,b.saleprice) from  Batch b where b.")
//    List<Batch> getSalesDrugAvailableList(LocalDate currenDate);
}
