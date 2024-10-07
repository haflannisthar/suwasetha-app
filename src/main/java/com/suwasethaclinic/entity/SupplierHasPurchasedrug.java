package com.suwasethaclinic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier_has_purchasedrug")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierHasPurchasedrug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")//join column condition
    @JsonIgnore
    private Supplier supplier_id ;

    //foreign key column
    @ManyToOne
    @JoinColumn(name = "purchasedrug_id", referencedColumnName = "id")//join column condition
    private Purchasedrug purchasedrug_id ;

    @Column(name = "qty")
    private  Integer qty;


}