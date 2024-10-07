package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "prescription")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "code")
    @NotNull
    private String code ;

    @Column(name = "age")
    @NotNull
    private String age ;

    @Column(name = "docnote")
    private String docnote ;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime ;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime ;


    @ManyToOne
    @JoinColumn(name = "appointment_id", referencedColumnName  = "id")
    private AppointmentScheduling appointment_id ;

    @OneToMany(mappedBy = "prescription_id" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<PrescriptionHasSalesDrug> prescriptionHasSalesDrugList;


    public Prescription(Integer id,String code){
        this.id=id;
        this.code=code;
    }


}