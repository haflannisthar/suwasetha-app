package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



import java.time.LocalDateTime;
import java.util.Set;

@Entity //applied as an entity class
@Table(name="user") // map to given table
@Data //generate getter setter
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //generate all argument constructor
public class User {


    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name="id" ,unique = true)//for map with column
    private Integer id ;

    @Column(name="username" , unique = true)
    @NotNull
    private String username ;

    @Column(name="password")
    @NotNull
    private String password ;

    @Column(name="email" , unique = true)
    @NotNull
    private String email ;

//    @Column(name="photopath")
//    private String photopath ;

    @Column(name="status")
    @NotNull
    private Boolean status  ;

   @Column(name="addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @Column(name="note")
    private String note ;

    @Column(name="otp")
    private String otp ;


    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")//join column condition
    private Employee employee_id ;

    // user and role has many to any relationship
    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "user_has_role",joinColumns=@JoinColumn(name="user_id") ,
            inverseJoinColumns=@JoinColumn(name="role_id"))
    private Set<Role> roles;

    @Column(name = "user_photo")
    private byte[] user_photo;

    @Column(name = "user_photo_name")
    private String user_photo_name;


    public  User(Integer id, String username){
        this.id=id;
        this.username=username;
    }
}
