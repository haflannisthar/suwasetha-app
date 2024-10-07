package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "batch")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "batchno",unique = true)
    @NotNull
    private String batchno;

    @Column(name = "manufacturedate")
    @NotNull
    private LocalDate manufacturedate ;

    @Column(name = "expirydate")
    @NotNull
    private LocalDate expirydate ;

    @Column(name = "purchasedrugtotalqty")
    @NotNull
    private Integer purchasedrugtotalqty;

    @Column(name = "purchasedrugavailableqty")
    @NotNull
    private Integer purchasedrugavailableqty;

    @Column(name = "salesdrugavailableqty")
    @NotNull
    private Integer salesdrugavailableqty;

    @Column(name = "saleprice")
    @NotNull
    private  BigDecimal saleprice;

    @Column(name = "purchaseprice")
    @NotNull
    private  BigDecimal purchaseprice;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime ;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "addeduser")
    @NotNull
    private  Integer addeduser;

    @Column(name = "updateuser")
    private  Integer updateuser;

    @Column(name = "deleteuser")
    private  Integer deleteuser;

    @ManyToOne
    @JoinColumn(name = "purchasedrug_id", referencedColumnName = "id")//join column condition
    private Purchasedrug purchasedrug_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")//join column condition
   private Supplier supplier_id;

   public Batch(Integer id,String batchno,Integer salesdrugavailableqty,BigDecimal saleprice){
       this.id=id;
       this.batchno=batchno;
       this.salesdrugavailableqty=salesdrugavailableqty;
       this.saleprice=saleprice;
    }


public Batch(Integer id,String batchno,Integer salesdrugavailableqty){
    this.id=id;
    this.batchno=batchno;
    this.salesdrugavailableqty=salesdrugavailableqty;
}


}
