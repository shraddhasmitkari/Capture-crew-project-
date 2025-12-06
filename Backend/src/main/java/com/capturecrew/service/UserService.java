package com.capturecrew.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.capturecrew.dao.AddressDao;
import com.capturecrew.dao.PgTransactionDao;
import com.capturecrew.dao.ServiceDao;
import com.capturecrew.dao.UserDao;
import com.capturecrew.dto.CommonApiResponse;
import com.capturecrew.dto.RegisterUserRequestDto;
import com.capturecrew.dto.UserDto;
import com.capturecrew.dto.UserLoginRequest;
import com.capturecrew.dto.UserLoginResponse;
import com.capturecrew.dto.UserResponseDto;
import com.capturecrew.dto.UserStatusUpdateRequestDto;
import com.capturecrew.dto.UserWalletUpdateResponse;
import com.capturecrew.entity.Address;
import com.capturecrew.entity.PgTransaction;
import com.capturecrew.entity.Service;
import com.capturecrew.entity.User;
import com.capturecrew.exception.UserSaveFailedException;
import com.capturecrew.pg.Notes;
import com.capturecrew.pg.Prefill;
import com.capturecrew.pg.RazorPayPaymentRequest;
import com.capturecrew.pg.RazorPayPaymentResponse;
import com.capturecrew.pg.Theme;
import com.capturecrew.utility.JwtUtils;
import com.capturecrew.utility.Constants.ActiveStatus;
import com.capturecrew.utility.Constants.PaymentGatewayTxnStatus;
import com.capturecrew.utility.Constants.PaymentGatewayTxnType;
import com.capturecrew.utility.Constants.UserRole;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import jakarta.transaction.Transactional;

@Component

public class UserService {

	private final Logger LOG = LoggerFactory.getLogger(UserService.class);

	@Autowired
	private UserDao userDao;

	@Autowired
	private AddressDao addressDao;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private ServiceDao serviceDao;

	@Autowired
	private PgTransactionDao pgTransactionDao;

	@Autowired
	private ObjectMapper objectMapper;
	
	@Value("${com.pcbuilder.paymentGateway.razorpay.key}")
	private String razorPayKey;

	@Value("${com.pcbuilder.paymentGateway.razorpay.secret}")
	private String razorPaySecret;

	public ResponseEntity<CommonApiResponse> registerAdmin(RegisterUserRequestDto registerRequest) {

		LOG.info("Request received for Register Admin");

		CommonApiResponse response = new CommonApiResponse();

		if (registerRequest == null) {
			response.setResponseMessage("Fields are empty");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (registerRequest.getEmailId() == null || registerRequest.getPassword() == null) {
			response.setResponseMessage("Missing inputs");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User existingUser = this.userDao.findByEmailIdAndStatus(registerRequest.getEmailId(),
				ActiveStatus.ACTIVE.value());

		if (existingUser != null) {
			response.setResponseMessage("User already register with this Email");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User user = RegisterUserRequestDto.toUserEntity(registerRequest);

		user.setRole(UserRole.ROLE_ADMIN.value());
		user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
		user.setStatus(ActiveStatus.ACTIVE.value());

		existingUser = this.userDao.save(user);

		if (existingUser == null) {
			response.setResponseMessage("Sorry! Failed to register admin");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Admin registered Successfully");
		response.setSuccess(true);

		LOG.info("Response Sent!!!");

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> registerUser(RegisterUserRequestDto request) {

		LOG.info("Received request for register user");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("Fields are empty");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User existingUser = this.userDao.findByEmailIdAndStatus(request.getEmailId(), ActiveStatus.ACTIVE.value());

		if (existingUser != null) {
			response.setResponseMessage("User with this Email Id already resgistered");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getRole() == null) {
			response.setResponseMessage("Role is missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User user = RegisterUserRequestDto.toUserEntity(request);

		String encodedPassword = passwordEncoder.encode(user.getPassword());

		user.setStatus(ActiveStatus.ACTIVE.value());
		user.setPassword(encodedPassword);
		user.setWalletAmount(BigDecimal.ZERO);

		Address address = new Address();
		address.setCity(request.getCity());
		address.setPincode(request.getPincode());
		address.setStreet(request.getStreet());

		Address savedAddress = this.addressDao.save(address);

		if (savedAddress == null) {
			throw new UserSaveFailedException("Could not register user.");
		}

		user.setAddress(savedAddress);
		existingUser = this.userDao.save(user);

		if (existingUser == null) {
			throw new UserSaveFailedException("Could not register user.");
		}

		response.setResponseMessage("User registered Successfully");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserLoginResponse> login(UserLoginRequest loginRequest) {

		LOG.info("Received request for User Login");

		UserLoginResponse response = new UserLoginResponse();

		if (loginRequest == null) {
			response.setResponseMessage("Fields are empty");
			response.setSuccess(false);

			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String jwtToken = null;
		User user = null;

		List<GrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority(loginRequest.getRole()));

		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmailId(),
					loginRequest.getPassword(), authorities));
		} catch (Exception ex) {
			response.setResponseMessage("Invalid email or password.");
			response.setSuccess(false);
			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.BAD_REQUEST);
		}

		jwtToken = jwtUtils.generateToken(loginRequest.getEmailId());

		user = this.userDao.findByEmailIdAndRoleAndStatus(loginRequest.getEmailId(), loginRequest.getRole(),
				ActiveStatus.ACTIVE.value());

		UserDto userDto = UserDto.toUserDtoEntity(user);

		// user is authenticated
		if (jwtToken != null) {
			response.setUser(userDto);
			response.setResponseMessage("Successfully logged in");
			response.setSuccess(true);
			response.setJwtToken(jwtToken);
			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.OK);
		}

		else {
			response.setResponseMessage("Failed to login");
			response.setSuccess(false);
			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.BAD_REQUEST);
		}

	}

	public ResponseEntity<UserResponseDto> getUsersByRole(String role) {

		UserResponseDto response = new UserResponseDto();

		if (role == null) {
			response.setResponseMessage("Role is missing");
			response.setSuccess(false);
			return new ResponseEntity<UserResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<User> users = new ArrayList<>();

		users = this.userDao.findByRoleAndStatus(role, ActiveStatus.ACTIVE.value());

		if (users.isEmpty()) {
			response.setResponseMessage("No Users Found");
			response.setSuccess(false);
		}

		List<UserDto> userDtos = new ArrayList<>();

		for (User user : users) {

			UserDto dto = UserDto.toUserDtoEntity(user);
			userDtos.add(dto);

		}

		response.setUsers(userDtos);
		response.setResponseMessage("User Fetched Successfully");
		response.setSuccess(true);

		return new ResponseEntity<UserResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateUserStatus(UserStatusUpdateRequestDto request) {

		LOG.info("Received request for updating the user status");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("Data is missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUserId() == 0) {
			response.setResponseMessage("User ID is missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User user = null;
		user = this.userDao.findById(request.getUserId()).get();

		user.setStatus(request.getStatus());

		User updatedUser = this.userDao.save(user);

		if (updatedUser == null) {
			throw new UserSaveFailedException("Failed to update the User status");
		}

		response.setResponseMessage("User status" + request.getStatus() + "successfully");
		response.setSuccess(true);
		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	public ResponseEntity<UserResponseDto> getUserById(int userId) {

		UserResponseDto response = new UserResponseDto();

		if (userId == 0) {
			response.setResponseMessage("Invalid Input");
			response.setSuccess(false);
			return new ResponseEntity<UserResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<User> users = new ArrayList<>();

		User user = this.userDao.findById(userId).get();
		users.add(user);

		if (users.isEmpty()) {
			response.setResponseMessage("No Users Found");
			response.setSuccess(false);
			return new ResponseEntity<UserResponseDto>(response, HttpStatus.OK);
		}

		List<UserDto> userDtos = new ArrayList<>();

		for (User u : users) {

			UserDto dto = UserDto.toUserDtoEntity(u);

			userDtos.add(dto);

		}

		response.setUsers(userDtos);
		response.setResponseMessage("User Fetched Successfully");
		response.setSuccess(true);

		return new ResponseEntity<UserResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> deleteTechExpert(Integer techExpertId) {

		CommonApiResponse response = new CommonApiResponse();

		if (techExpertId == 0) {
			response.setResponseMessage("Invalid ID");
			response.setSuccess(false);
			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User techExpert = this.userDao.findById(techExpertId).get();

		if (techExpert == null) {
			response.setResponseMessage("Tech Expert not found");
			response.setSuccess(false);
			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
		}

		List<Service> services = serviceDao.findByTechExpert(techExpert);

		techExpert.setStatus(ActiveStatus.DEACTIVATED.value());
		this.userDao.save(techExpert);

		for (Service service : services) {
			service.setStatus(ActiveStatus.DEACTIVATED.value());
		}

		this.serviceDao.saveAll(services);

		response.setResponseMessage("Tech Expert and it's all Services got deleted successfully");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserWalletUpdateResponse> createRazorPayOrder(User request) throws RazorpayException {

		UserWalletUpdateResponse response = new UserWalletUpdateResponse();

		if (request == null) {
			response.setResponseMessage("Invalid Input");
			response.setSuccess(false);
			return new ResponseEntity<UserWalletUpdateResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getId() == 0 || request.getWalletAmount() == null
				|| request.getWalletAmount().compareTo(BigDecimal.ZERO) <= 0) {
			response.setResponseMessage("No Users Found");
			response.setSuccess(false);
			return new ResponseEntity<UserWalletUpdateResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User customer = this.userDao.findById(request.getId()).get();

		if (customer == null || !customer.getRole().equals(UserRole.ROLE_CUSTOMER.value())) {
			response.setResponseMessage("Not a customer");
			response.setSuccess(false);
			return new ResponseEntity<UserWalletUpdateResponse>(response, HttpStatus.BAD_REQUEST);
		}

		BigDecimal existingWalletAmount = customer.getWalletAmount();

		// write payment gateway code here

		// key : rzp_test_9C5DF9gbJINYTA
		// secret: WYqJeY6CJD1iw7cDZFv1eWl0

		String receiptId = generateUniqueRefId();

		RazorpayClient razorpay = new RazorpayClient(razorPayKey, razorPaySecret);

		JSONObject orderRequest = new JSONObject();
		orderRequest.put("amount", convertRupeesToPaisa(request.getWalletAmount()));
		orderRequest.put("currency", "INR");
		orderRequest.put("receipt", receiptId);
		JSONObject notes = new JSONObject();
		notes.put("note", "Credit in Wallet - PC Builder & Service Mng");
		orderRequest.put("notes", notes);

		Order order = razorpay.orders.create(orderRequest);

		if (order == null) {
			LOG.error("Null Response from RazorPay for creation of order");
			response.setResponseMessage("Failed to update the Wallet");
			response.setSuccess(false);
			return new ResponseEntity<UserWalletUpdateResponse>(response, HttpStatus.BAD_REQUEST);
		}

		LOG.info(order.toString()); // printing the response which we got from RazorPay

		String orderId = order.get("id");

		PgTransaction createOrder = new PgTransaction();
		createOrder.setAmount(request.getWalletAmount());
		createOrder.setReceiptId(receiptId);
		createOrder.setRequestTime(receiptId);
		createOrder.setType(PaymentGatewayTxnType.CREATE_ORDER.value());
		createOrder.setUser(customer);
		createOrder.setOrderId(orderId); // fetching order id which is created at Razor Pay which we got in response

		if (order.get("status").equals("created")) {
			createOrder.setStatus(PaymentGatewayTxnStatus.SUCCESS.value());
		} else {
			createOrder.setStatus(PaymentGatewayTxnStatus.FAILED.value());
		}

		PgTransaction saveCreateOrderTxn = this.pgTransactionDao.save(createOrder);

		if (saveCreateOrderTxn == null) {
			LOG.error("Failed to save Payment Gateway CReate Order entry in DB");
		}

		PgTransaction payment = new PgTransaction();
		payment.setAmount(request.getWalletAmount());
		payment.setReceiptId(receiptId);
		payment.setRequestTime(receiptId);
		payment.setType(PaymentGatewayTxnType.PAYMENT.value());
		payment.setUser(customer);
		payment.setOrderId(orderId); // fetching order id which is created at Razor Pay which we got in response
		payment.setStatus(PaymentGatewayTxnStatus.FAILED.value());
		// from callback api we will actual response from RazorPay, initially keeping it
		// FAILED, once get success response from PG,
		// we will update it

		PgTransaction savePaymentTxn = this.pgTransactionDao.save(payment);

		if (savePaymentTxn == null) {
			LOG.error("Failed to save Payment Gateway Payment entry in DB");
		}

		// Creating RazorPayPaymentRequest to send to Frontend

		RazorPayPaymentRequest razorPayPaymentRequest = new RazorPayPaymentRequest();
		razorPayPaymentRequest.setAmount(convertRupeesToPaisa(request.getWalletAmount()));
		// razorPayPaymentRequest.setCallbackUrl("http://localhost:8080/pg/razorPay/callBack/response");
		razorPayPaymentRequest.setCurrency("INR");
		razorPayPaymentRequest.setDescription("Credit in Wallet - PC Builder & Service Mng");
		razorPayPaymentRequest.setImage(
				"https://t3.ftcdn.net/jpg/02/15/24/52/360_F_215245277_iTsZyIhwpZQJeXBG17ndDzOeJ38JTeq2.jpg");
		razorPayPaymentRequest.setKey(razorPayKey);
		razorPayPaymentRequest.setName("PC Builder & Service");

		Notes note = new Notes();
		note.setAddress("Pune");

		razorPayPaymentRequest.setNotes(note);
		razorPayPaymentRequest.setOrderId(orderId);

		Prefill prefill = new Prefill();
		prefill.setContact(customer.getPhoneNo());
		prefill.setEmail(customer.getEmailId());
		prefill.setName(customer.getFirstName() + " " + customer.getLastName());

		razorPayPaymentRequest.setPrefill(prefill);

		Theme theme = new Theme();
		theme.setColor("#4da528");

		razorPayPaymentRequest.setTheme(theme);

		try {
			String jsonRequest = objectMapper.writeValueAsString(razorPayPaymentRequest);
			System.out.println("*****************");
			System.out.println(jsonRequest);
			System.out.println("*****************");
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		response.setRazorPayRequest(razorPayPaymentRequest);
		response.setResponseMessage("Payment Order Created Successful!");
		response.setSuccess(true);

		return new ResponseEntity<UserWalletUpdateResponse>(response, HttpStatus.OK);
	}

	private int convertRupeesToPaisa(BigDecimal rupees) {
		// Multiply the rupees by 100 to get the equivalent in paisa
		BigDecimal paisa = rupees.multiply(new BigDecimal(100));
		return paisa.intValue();
	}

	// for razor pay receipt id
	private String generateUniqueRefId() {
		// Get current timestamp in milliseconds
		long currentTimeMillis = System.currentTimeMillis();

		// Generate a 6-digit UUID (random number)
		String randomDigits = UUID.randomUUID().toString().substring(0, 6);

		// Concatenate timestamp and random digits
		String uniqueRefId = currentTimeMillis + "-" + randomDigits;

		return uniqueRefId;
	}

	public ResponseEntity<CommonApiResponse> handleRazorPayPaymentResponse(RazorPayPaymentResponse razorPayResponse) {

		LOG.info("Razor pay response which came from frontend");

		CommonApiResponse response = new CommonApiResponse();

		if (razorPayResponse == null || razorPayResponse.getRazorpayOrderId() == null) {
			response.setResponseMessage("Invalid Input response");
			response.setSuccess(false);
			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		PgTransaction paymentTransaction = this.pgTransactionDao
				.findByTypeAndOrderId(PaymentGatewayTxnType.PAYMENT.value(), razorPayResponse.getRazorpayOrderId());

		User customer = paymentTransaction.getUser();
		BigDecimal existingBalance = customer.getWalletAmount();

		BigDecimal walletBalanceToAdd = paymentTransaction.getAmount();

		String razorPayRawResponse = "";
		try {
			razorPayRawResponse = objectMapper.writeValueAsString(razorPayResponse);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		paymentTransaction.setRawResponse(razorPayRawResponse);

		if (razorPayResponse.getError() == null) {
			paymentTransaction.setStatus(PaymentGatewayTxnStatus.SUCCESS.value());

			customer.setWalletAmount(existingBalance.add(walletBalanceToAdd));

			User updatedCustomer = this.userDao.save(customer);

			if (updatedCustomer == null) {
				LOG.error("Failed to update the wallet for order id: " + razorPayResponse.getRazorpayOrderId());
			} else {
				LOG.info("Wallet Updated Successfully");
			}

		} else {
			paymentTransaction.setStatus(PaymentGatewayTxnStatus.FAILED.value());
		}

		PgTransaction updatedTransaction = this.pgTransactionDao.save(paymentTransaction);

		if (updatedTransaction.getStatus().equals(PaymentGatewayTxnStatus.FAILED.value())) {
			response.setResponseMessage("Failed to update the User Wallet");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
		} else {
			response.setResponseMessage("User Wallet Updated Successfully");
			response.setSuccess(true);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
		}

	}

}
