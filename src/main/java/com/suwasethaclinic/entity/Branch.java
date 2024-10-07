package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "branch")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "name")
    @NotNull
    private String name ;

    @ManyToOne
    @JoinColumn(name = "bank_id", referencedColumnName = "id")
    private  Bank bank_id;

    @ManyToOne
    @JoinColumn(name = "city_id", referencedColumnName = "id")
    private  City city_id;

}