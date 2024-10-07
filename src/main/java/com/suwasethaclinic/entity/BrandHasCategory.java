package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "brand_has_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandHasCategory {
    @Id
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName  = "id")
    private Category category_id ;

    @Id
    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName  = "id")
    private Brand brand_id ;


}