package com.capturecrew.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.capturecrew.dao.CategoryDao;
import com.capturecrew.dao.ServiceDao;
import com.capturecrew.dto.CategoryResponseDto;
import com.capturecrew.dto.CommonApiResponse;
import com.capturecrew.entity.Category;
import com.capturecrew.entity.Service;
import com.capturecrew.exception.CategorySaveFailedException;
import com.capturecrew.utility.Constants.ActiveStatus;

import jakarta.transaction.Transactional;

@Component

public class CategoryService {

	private final Logger LOG = LoggerFactory.getLogger(CategoryService.class);

	@Autowired
	private CategoryDao categoryDao;

	@Autowired
	private ServiceDao serviceDao;

	public ResponseEntity<CommonApiResponse> addCategory(Category category) {

		LOG.info("Request received for add category");

		CommonApiResponse response = new CommonApiResponse();

		if (category == null) {
			response.setResponseMessage("Inputs are empty");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		category.setStatus(ActiveStatus.ACTIVE.value());

		Category savedCategory = this.categoryDao.save(category);

		if (savedCategory == null) {
			throw new CategorySaveFailedException("Failed to add category");
		}

		response.setResponseMessage("Category Added Successful");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	public ResponseEntity<CommonApiResponse> updateCategory(Category category) {

	    LOG.info("Request received for updating category");
  
	    CommonApiResponse response = new CommonApiResponse();

	    try {
	        if (category == null) {
	            LOG.error("Category object is null");
	            response.setResponseMessage("Missing input");
	            response.setSuccess(false);
	            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	        }

	        if (category.getId() <= 0) {
	            LOG.error("Invalid category ID: {}", category.getId());
	            response.setResponseMessage("Missing or invalid category ID");
	            response.setSuccess(false);
	            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	        }

	        category.setStatus(ActiveStatus.ACTIVE.value());
	        Category savedCategory = this.categoryDao.save(category);

	        if (savedCategory == null) {
	            LOG.error("Failed to save category: {}", category);
	            throw new CategorySaveFailedException("Failed to update category");
	        }

	        response.setResponseMessage("Category updated successfully");
	        response.setSuccess(true);
	        LOG.info("Category updated successfully: {}", savedCategory);

	        return new ResponseEntity<>(response, HttpStatus.OK);

	    } catch (CategorySaveFailedException e) {
	        LOG.error("Category save failed: {}", e.getMessage());
	        response.setResponseMessage("Failed to update category");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    } catch (Exception e) {
	        LOG.error("Unexpected error occurred: {}", e.getMessage());
	        response.setResponseMessage("An unexpected error occurred");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}


	public ResponseEntity<CategoryResponseDto> fetchAllCategory() {

		LOG.info("Request received for fetching all categories");

		CategoryResponseDto response = new CategoryResponseDto();

		List<Category> categories = new ArrayList<>();

		categories = this.categoryDao.findByStatusIn(Arrays.asList(ActiveStatus.ACTIVE.value()));

		if (CollectionUtils.isEmpty(categories)) {
			response.setResponseMessage("No Categories found");
			response.setSuccess(false);

			return new ResponseEntity<CategoryResponseDto>(response, HttpStatus.OK);
		}

		response.setCategories(categories);
		response.setResponseMessage("Category fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<CategoryResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> deleteCategory(int categoryId) {

		LOG.info("Request received for deleting category");

		CommonApiResponse response = new CommonApiResponse();

		if (categoryId == 0) {
			response.setResponseMessage("missing category Id");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Category category = this.categoryDao.findById(categoryId).get();

		if (category == null) {
			response.setResponseMessage("Category not found");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		List<Service> services = this.serviceDao.findBySubCategoryAndStatus(category, ActiveStatus.ACTIVE.value());

		category.setStatus(ActiveStatus.DEACTIVATED.value());
		Category updatedCategory = this.categoryDao.save(category);

		if (updatedCategory == null) {
			throw new CategorySaveFailedException("Failed to delete the Category");
		}

		if (!CollectionUtils.isEmpty(services)) {

			for (Service service : services) {
				service.setStatus(ActiveStatus.DEACTIVATED.value());
			}

			List<Service> updatedService = this.serviceDao.saveAll(services);

			if (CollectionUtils.isEmpty(updatedService)) {
				throw new CategorySaveFailedException("Failed to delete the Category");
			}

		}

		response.setResponseMessage("Category & all its Services Deleted Successful");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

}
