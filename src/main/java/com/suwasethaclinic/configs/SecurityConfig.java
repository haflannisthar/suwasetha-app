package com.suwasethaclinic.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.HeaderWriterLogoutHandler;
import org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class  SecurityConfig{

    private BCryptPasswordEncoder bCryptPasswordEncoder;



    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
        .authorizeHttpRequests(auth->{
          auth.requestMatchers("/login").permitAll()
                  .requestMatchers("/profile/sendotp").permitAll()
                  .requestMatchers("/profile/checkotp").permitAll()
                  .requestMatchers("/profile/verifyuser/").permitAll()
                  .requestMatchers("/profile/changenewpassword").permitAll()
                  .requestMatchers("/errorpage").permitAll()
                  .requestMatchers("/grn").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/batch").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/profile").authenticated()
                  .requestMatchers("/dashboard").authenticated()
                  .requestMatchers("/createadmin").permitAll()
                  .requestMatchers("/employee").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/employee/getavailabledoctorlist").hasAnyAuthority("Admin","Manager","Medical Receptionist")
                  .requestMatchers("/purchaseproducttype").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/purchaseorder").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/module/**").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/user").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/designation/**").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/privilege").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/patient").hasAnyAuthority("Admin","Manager","Medical Receptionist")
                  .requestMatchers("/appointment").hasAnyAuthority("Admin","Manager","Medical Receptionist")
                  .requestMatchers("/appointmentpayment").hasAnyAuthority("Admin","Manager","Medical Receptionist")
                  .requestMatchers("/prescriptionpayment").hasAnyAuthority("Admin","Manager","Pharmacist","Cashier")
                  .requestMatchers("/doctoravailability").hasAnyAuthority("Admin","Manager","Medical Receptionist")
                  .requestMatchers("/salesdrug").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/supplier").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/purchasedrug").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/category").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/subcategory").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/brand").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/report").hasAnyAuthority("Admin","Manager")
                  .requestMatchers("/prescription").hasAnyAuthority("Admin","Manager","Doctor")
                  .requestMatchers("/resources/**").permitAll()


                  .anyRequest().authenticated();
        })
          .formLogin(login->{
                  login.loginPage("/login")
                          .defaultSuccessUrl("/dashboard" , true)
                          .failureUrl("/login?error=usernamepassworderror")
                          .usernameParameter("username")
                          .passwordParameter("password");
          })
            .logout(logout->{
                    logout
                            .addLogoutHandler(new HeaderWriterLogoutHandler(new ClearSiteDataHeaderWriter(ClearSiteDataHeaderWriter.Directive.COOKIES)))
//                            .logoutUrl("/logout")
                            .logoutSuccessUrl("/login")
                            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"));




            })
                .sessionManagement(session->{
                    session
                            .invalidSessionUrl("/login")
                            .sessionFixation()
                            .changeSessionId()
                            .maximumSessions(6)
                            .expiredUrl("/logout")
                            .maxSessionsPreventsLogin(true);
                })
                .exceptionHandling(exception->{
                    exception
                            .accessDeniedPage("/errorpage");

                })
                .csrf(csrf->{
                    csrf.disable();
                });
        return httpSecurity.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        bCryptPasswordEncoder=new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }

}