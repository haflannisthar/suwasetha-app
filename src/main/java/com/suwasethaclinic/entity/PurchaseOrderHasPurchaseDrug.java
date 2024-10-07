package com.suwasethaclinic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchaseorder_has_purchasedrug")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderHasPurchaseDrug {

//    primary key column
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

//other columns
    @Column(name = "unitprice")
    @NotNull
    private BigDecimal unitprice;

    @Column(name = "lineprice")
    @NotNull
    private BigDecimal lineprice;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

//foreign key column
    @ManyToOne
    @JoinColumn(name = "purchaseorder_id", referencedColumnName = "id")//join column condition
    @JsonIgnore
    private PurchaseOrder purchaseorder_id;

    //foreign key column
    @ManyToOne
    @JoinColumn(name = "purchasedrug_id", referencedColumnName = "id")//join column condition
   private Purchasedrug purchasedrug_id;


    public PurchaseOrderHasPurchaseDrug(int id , BigDecimal unitprice,Integer quantity){
        this.id=id;
        this.unitprice=unitprice;
        this.quantity=quantity;
    }


}
