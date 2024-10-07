package com.suwasethaclinic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "payment_has_batch")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentHasBatch {

//    primary key column
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

//other columns
    @Column(name = "unitprice")
    @NotNull
    private BigDecimal unitprice;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

    @Column(name = "lineprice")
    @NotNull
    private BigDecimal lineprice;



    //foreign key column
    @ManyToOne
    @JoinColumn(name = "payment_id", referencedColumnName = "id")//join column condition
    @JsonIgnore
    private Payment payment_id;

    //foreign key column
    @ManyToOne
    @JoinColumn(name = "batch_id", referencedColumnName = "id")//join column condition
   private Batch batch_id;




}
