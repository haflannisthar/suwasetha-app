package com.suwasethaclinic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "prescription_has_salesdrug")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionHasSalesDrug {

//    primary key column
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

//other columns
    @Column(name = "totalqty")
    @NotNull
    private Integer totalqty;

    @Column(name = "breakfastqty")
    private Integer breakfastqty;

    @Column(name = "lunchqty")
    private Integer lunchqty;

    @Column(name = "dinnerqty")
    private Integer dinnerqty;

    @Column(name = "eatbeforeorafter")
    private String eatbeforeorafter;

    @Column(name = "noofdays")
    @NotNull
    private Integer noofdays;

    @Column(name = "inpharmacyoroutside")
    @NotNull
    private Boolean inpharmacyoroutside;

    //foreign key column
    @ManyToOne
    @JoinColumn(name = "prescription_id", referencedColumnName = "id")//join column condition
    @JsonIgnore
    private Prescription prescription_id;

    //foreign key column
    @ManyToOne
    @JoinColumn(name = "salesdrug_id", referencedColumnName = "id")//join column condition
   private Salesdrug salesdrug_id;




}
