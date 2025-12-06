package com.capturecrew;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.capturecrew.dao.UserDao;
import com.capturecrew.entity.User;
import com.capturecrew.utility.Constants.ActiveStatus;
import com.capturecrew.utility.Constants.UserRole;

@SpringBootApplication
public class PcBuilderBackendApplication implements CommandLineRunner {

	private final Logger LOG = LoggerFactory.getLogger(PcBuilderBackendApplication.class);

	@Autowired
	private UserDao userDao;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(PcBuilderBackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		User admin = this.userDao.findByEmailIdAndRoleAndStatus("admin@pcbuilder.com", UserRole.ROLE_ADMIN.value(),
				ActiveStatus.ACTIVE.value());

		if (admin == null) {

			LOG.info("Admin not found in system, so adding default admin");

			User user = new User();
			user.setEmailId("admin@capturecrew.com");
			user.setPassword(passwordEncoder.encode("123456"));
			user.setRole(UserRole.ROLE_ADMIN.value());
			user.setStatus(ActiveStatus.ACTIVE.value());

			this.userDao.save(user);

		}

	}

}
