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
import java.util.Set;

@Entity
@Table(name = "grn")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "grnno" , unique = true)
    @NotNull
   private String grnno;

    @Column(name = "receiveddate")
    @NotNull
   private LocalDate receiveddate ;


    @Column(name = "supplierbillno")
    @NotNull
   private String supplierbillno;


    @Column(name = "totalamount")
    @NotNull
  private BigDecimal totalamount;

    @Column(name = "discountrate")
   private BigDecimal discountrate;


    @Column(name = "netamount")
    @NotNull
    private BigDecimal  netamount;

    @Column(name = "note")
    private  String note ;


    @Column(name = "addeddatetime")
    @NotNull
   private LocalDateTime addeddatetime ;


    @Column(name = "updatedatetime")
    private LocalDateTime  updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime   deletedatetime ;

    @Column(name = "addeduser")
    @NotNull
    private  Integer addeduser;


    @Column(name = "updateuser")
    private  Integer  updateuser;


    @Column(name = "deleteuser")
    private  Integer deleteuser ;


    @Column(name = "paidamount")
   private BigDecimal paidamount ;

    @ManyToOne
    @JoinColumn(name = "grnstatus_id" ,referencedColumnName = "id")
   private GrnStatus grnstatus_id;

   @ManyToOne
   @JoinColumn(name = "purchaseorder_id" ,referencedColumnName = "id")
  private  PurchaseOrder purchaseorder_id ;

    @OneToMany(mappedBy = "grn_id" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<GrnHasBatch> grnHasBatchList;


    public  Grn(Integer id ,BigDecimal netamount,BigDecimal paidamount){
        this.id=id;
        this.netamount=netamount;
        this.paidamount=paidamount;
    }
}