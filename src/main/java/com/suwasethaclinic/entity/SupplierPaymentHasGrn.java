package com.suwasethaclinic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "supplierpayment_has_grn")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPaymentHasGrn {

//    primary key column
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

//other columns
    @Column(name = "availablebalance")
    @NotNull
    private BigDecimal availablebalance;

    @Column(name = "paidamount")
    @NotNull
    private BigDecimal paidamount;


//foreign key column
    @ManyToOne
    @JoinColumn(name = "supplierpayment_id", referencedColumnName = "id")//join column condition
    @JsonIgnore
    private SupplierPayment supplierpayment_id;

    //foreign key column
    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")//join column condition
   private Grn grn_id;




}
