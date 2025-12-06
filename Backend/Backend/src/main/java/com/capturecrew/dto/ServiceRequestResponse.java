package com.capturecrew.dto;

import java.util.ArrayList;
import java.util.List;

import com.capturecrew.entity.ServiceRequest;

import lombok.Data;

@Data
public class ServiceRequestResponse extends CommonApiResponse {
	
	private List<ServiceRequest> serviceRequests = new ArrayList<>();

}
