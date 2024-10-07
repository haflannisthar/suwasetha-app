package com.suwasethaclinic.dao;


import com.suwasethaclinic.entity.Module;
import com.suwasethaclinic.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ModuleDao extends JpaRepository<Module,Integer> {


    @Query("SELECT m FROM Module m where m.id not in (select  p.module_id.id from Privilege p where p.role_id.id=?1)")
    public List<Module> getModuleByRole(Integer roleid);


    @Query(value = "select m from Module m where m.name=?1")
    Module getModuleByName(String name);


}
