package com.capturecrew.dto;

import java.util.ArrayList;
import java.util.List;

import com.capturecrew.entity.Service;

import lombok.Data;

@Data
public class ServiceResponse extends CommonApiResponse {
	
	private List<Service> services = new ArrayList<>();

}
