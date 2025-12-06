package com.capturecrew.dto;

import java.math.BigDecimal;

import org.springframework.beans.BeanUtils;
import org.springframework.web.multipart.MultipartFile;

import com.capturecrew.entity.Service;

import lombok.Data;

@Data
public class AddServiceRequest {

	private int id;

	private String name;

	private String description;

	private String category; // PC Builder or Service

	private Integer subCategoryId; // only for pc builder

	private Integer techExpertId;

	private BigDecimal minPrice;

	private Integer deliveryTime; // in days

	private MultipartFile image1;

	private MultipartFile image2;

	private MultipartFile image3;

	public static Service toServiceEntity(AddServiceRequest request) {
		Service service = new Service();
		BeanUtils.copyProperties(request, service, "subCategoryId", "techExpertId", "image1", "image2", "image3");
		return service;
	}

}
