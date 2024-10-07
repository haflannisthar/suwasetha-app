package com.suwasethaclinic.dao;


import com.suwasethaclinic.entity.Module;
import com.suwasethaclinic.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RoleDao extends JpaRepository<Role,Integer> {

    @Query("select r from Role r where r.name=?1")
    Role getRoleByName(String name);
}
