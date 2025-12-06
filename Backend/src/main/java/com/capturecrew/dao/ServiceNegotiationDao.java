package com.capturecrew.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capturecrew.entity.ServiceNegotiation;

@Repository
public interface ServiceNegotiationDao extends JpaRepository<ServiceNegotiation, Integer> {

}
