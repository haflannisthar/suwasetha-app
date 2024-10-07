package com.suwasethaclinic.dao;



import com.suwasethaclinic.entity.Role;
import com.suwasethaclinic.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserDao extends JpaRepository<User,Integer> {



//    query to get user by given employee id
@Query(value ="select u from User  u where  u.employee_id.id=?1")
   public User getUserByEmployeeId(Integer id);

//get user by email
@Query(value = "select  u from  User u where  u.email=?1")
  public   User getUserByEmail(String email);


//query to get user by username
    @Query(value = "select u from User u where u.username=?1")
   public User getUserByUsername(String username);


//    @Query(value = "select u from User u where u.username=?1")
//    User getuserdetails(String name);

    @Query(value = "select new User (u.id,u.username) from User u where u.id=?1")
    User getuserbyid(Integer userid);

    @Query("select u.roles from User u where u.employee_id.id=?1")
    List<Role> getRoleNameById(Integer doctorid);

    @Query("select u from User u where u.username=?1 and u.email=?2")
    User getUserByUserNameEmail(String username, String email);
}
