package com.suwasethaclinic.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "paymentmethod")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethod {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "id", unique = true)
   private Integer id;


   @Column(name = "name")
   @NotNull
   private String name;
}
