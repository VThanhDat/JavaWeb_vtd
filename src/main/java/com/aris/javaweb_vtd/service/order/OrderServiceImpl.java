package com.aris.javaweb_vtd.service.order;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aris.javaweb_vtd.converter.CustomerConverter;
import com.aris.javaweb_vtd.converter.OrderConverter;
import com.aris.javaweb_vtd.dto.request.CreateOrderRequestDTO;
import com.aris.javaweb_vtd.dto.request.CustomerRequestDTO;
import com.aris.javaweb_vtd.dto.request.OrderItemRequestDTO;
import com.aris.javaweb_vtd.dto.response.OrderItemResponseDTO;
import com.aris.javaweb_vtd.dto.response.OrderResponseDTO;
import com.aris.javaweb_vtd.entity.Customer;
import com.aris.javaweb_vtd.entity.Order;
import com.aris.javaweb_vtd.entity.OrderDetail;
import com.aris.javaweb_vtd.mapper.CustommerMapper;
import com.aris.javaweb_vtd.mapper.OrderDetailMapper;
import com.aris.javaweb_vtd.mapper.OrderMapper;

@Service
public class OrderServiceImpl implements OrderService {

  @Autowired
  private OrderMapper orderMapper;

  @Autowired
  private OrderDetailMapper orderDetailMapper;

  @Autowired
  private CustomerConverter customerConverter;

  @Autowired
  private OrderConverter orderConverter;

  @Autowired
  private CustommerMapper customerMapper;

  public void createOrder(CreateOrderRequestDTO request) {
    CustomerRequestDTO customerDTO = request.getCustomer();
    Customer customer = customerConverter.toEntity(customerDTO);

    customerMapper.insertCustomer(customer);
    Long customerId = customer.getId();

    double shippingFee = request.getShippingFee() != null ? request.getShippingFee() : 0.0;

    double total = 0;
    for (OrderItemRequestDTO item : request.getItems()) {
      total += item.getPrice() * item.getQuantity();
    }
    total += shippingFee;

    Order order = orderConverter.toEntity(request);
    order.setCustomerId(customerId);
    order.setTotalPrice(total);
    order.setStatus("new");

    orderMapper.insertOrder(order);
    Long orderId = order.getId();

    for (OrderItemRequestDTO item : request.getItems()) {
      OrderDetail detail = orderConverter.toDetailEntity(item);
      detail.setOrderId(orderId);
      orderDetailMapper.insertOrderDetail(detail);
    }
  }

  @Override
  public List<OrderResponseDTO> getOrders() {
    List<OrderResponseDTO> orders = orderMapper.getOrders();
    for (OrderResponseDTO order : orders) {
      int totalItems = 0;
      int subTotal = 0;

      List<OrderItemResponseDTO> items = order.getItems();
      if (items != null) {
        for (OrderItemResponseDTO item : items) {
          int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
          int price = item.getPrice() != null ? item.getPrice().intValue() : 0;

          totalItems += quantity;
          subTotal += quantity * price;
        }
      }
      order.setTotalItems(totalItems);
      order.setSubTotal(subTotal);
    }

    return orders;
  }
}
