package com.suwasethaclinic.dao;


import com.suwasethaclinic.entity.Designation;
import com.suwasethaclinic.entity.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PrivilegeDao extends JpaRepository<Privilege,Integer> {

    //    create query to get privilege bu given roleid, module id
    @Query(value = "select p from Privilege p  where  p.role_id.id=?1 and  p.module_id.id=?2")
    Privilege getByRoleModule(Integer roleid, Integer moduleid);

    //    query to get privilege by given username and module name
    @Query(value ="SELECT bit_or(p.privselect) as privselect , bit_or(p.privinsert) as privinsert , bit_or(p.privupdate) as privupdate , bit_or(p.privdelete) as privdelete FROM suwasetha_clinic.privilege as p where p.role_id in (select uhr.role_id from suwasetha_clinic.user_has_role as uhr where uhr.user_id in (select u.id from suwasetha_clinic.user as u where u.username=?1 )) and p.module_id in (select m.id from suwasetha_clinic.module as m where m.name=?2) ;" ,nativeQuery = true)
    public  String getPrivilegeByUserModule(String username, String modulename);


    @Query(value = "select p from Privilege p where p.role_id=?1")
    List<Privilege> findPrivilegeByrole(Integer role_id);
}
