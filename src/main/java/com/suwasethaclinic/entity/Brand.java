package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "brand")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "name")
    @NotNull
    private String name ;

//    many to many relationship between brand and category
    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "brand_has_category",joinColumns=@JoinColumn(name="brand_id") ,
            inverseJoinColumns=@JoinColumn(name="category_id"))
    private Set<Category> categories;

}