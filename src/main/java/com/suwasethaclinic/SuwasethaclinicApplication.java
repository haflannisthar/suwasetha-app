package com.suwasethaclinic;

import com.suwasethaclinic.controller.PrivilegeController;
import com.suwasethaclinic.dao.*;
import com.suwasethaclinic.entity.AppointmentScheduling;
import com.suwasethaclinic.entity.Role;
import com.suwasethaclinic.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.event.EventListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@SpringBootApplication
@RestController
public class SuwasethaclinicApplication extends SpringBootServletInitializer {

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private EmployeeDao employeeDao;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private PrivilegeController privilegeController;

	@Autowired
	private AppointmentSchedullingDao appointmentSchedullingDao;

	@Autowired
	private AppointmentStatusDao appointmentStatusDao;

	public static void main(String[] args) {
		SpringApplication.run(SuwasethaclinicApplication.class, args);

		System.out.println("hello world");
	}



@GetMapping(value = "/createadmin")
	public  String GnerateAdmin(){
	User adminUser=new User();
	adminUser.setUsername("admin");
	adminUser.setEmail("admin@gmail.com");
	adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
	adminUser.setStatus(true);
	adminUser.setAddeddatetime(LocalDateTime.now());
	adminUser.setEmployee_id(employeeDao.getReferenceById(1));

	Set<Role> roles=new HashSet<Role>();
	roles.add(roleDao.getReferenceById(4));


	adminUser.setRoles(roles);

	userDao.save(adminUser);

	return "<script>window.location.replace('http://localhost:8080/login');</script>";
}

//delete the yesterdays passed pending appointments
@EventListener(ApplicationReadyEvent.class)
public  void deletePassedAppointment(){
	LocalDate yesterday=LocalDate.now().minusDays(1);
	List<AppointmentScheduling> appointmentSchedulingList=appointmentSchedullingDao.getOldAppointment(yesterday);

	if (!appointmentSchedulingList.isEmpty()){
		for (AppointmentScheduling appointment:appointmentSchedulingList) {
			appointment.setAppstatus_id(appointmentStatusDao.getReferenceById(4));
			appointmentSchedullingDao.save(appointment);
		}
	}
}



    
}
