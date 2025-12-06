package com.capturecrew.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capturecrew.entity.Category;
import com.capturecrew.entity.Service;
import com.capturecrew.entity.User;

@Repository
public interface ServiceDao extends JpaRepository<Service, Integer> {

	List<Service> findBySubCategoryAndStatus(Category category, String status);

	List<Service> findByStatus(String status);

	List<Service> findByTechExpert(User techExpert);

	List<Service> findByCategoryAndStatus(String category, String status);

}
