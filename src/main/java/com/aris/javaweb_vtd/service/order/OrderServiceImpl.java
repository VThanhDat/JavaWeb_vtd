package com.aris.javaweb_vtd.service.order;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aris.javaweb_vtd.converter.CustomerConverter;
import com.aris.javaweb_vtd.converter.OrderConverter;
import com.aris.javaweb_vtd.dto.request.CreateOrderRequestDTO;
import com.aris.javaweb_vtd.dto.request.CustomerRequestDTO;
import com.aris.javaweb_vtd.dto.request.OrderItemRequestDTO;
import com.aris.javaweb_vtd.dto.response.OrderItemResponseDTO;
import com.aris.javaweb_vtd.dto.response.OrderResponseDTO;
import com.aris.javaweb_vtd.dto.response.OrderSummaryDTO;
import com.aris.javaweb_vtd.entity.Customer;
import com.aris.javaweb_vtd.entity.Order;
import com.aris.javaweb_vtd.entity.OrderDetail;
import com.aris.javaweb_vtd.mapper.CustommerMapper;
import com.aris.javaweb_vtd.mapper.OrderDetailMapper;
import com.aris.javaweb_vtd.mapper.OrderMapper;
import com.aris.javaweb_vtd.util.OrderStatusUtil;

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

  @Transactional
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
  public List<OrderSummaryDTO> getOrders(List<String> statusList, String dateFilter) {
    LocalDateTime fromDate = null;
    LocalDateTime toDate = null;
    LocalDate today = LocalDate.now();

    switch (dateFilter) {
      case "today":
        fromDate = today.atStartOfDay();
        toDate = fromDate.plusDays(1).minusNanos(1);
        break;
      case "this_week":
        fromDate = today.with(DayOfWeek.MONDAY).atStartOfDay();
        toDate = fromDate.plusDays(7).minusNanos(1);
        break;
      case "this_month":
        fromDate = today.withDayOfMonth(1).atStartOfDay();
        toDate = fromDate.plusMonths(1).withDayOfMonth(1).minusNanos(1);
        break;
      default:
        break;
    }

    List<OrderSummaryDTO> orders = orderMapper.getOrdersByFilters(statusList, fromDate, toDate);
    return orders;
  }

  @Override
  public OrderResponseDTO getOrderById(Long id) {
    OrderResponseDTO order = orderMapper.getOrderById(id);
    if (order == null) {
      throw new IllegalArgumentException("No order found with ID is " + id);
    }

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

    return order;
  }

  @Override
  public void updateOrderStatus(Long orderId, String newStatus) {
    OrderResponseDTO order = orderMapper.getOrderById(orderId);
    if (order == null) {
      throw new IllegalArgumentException("Not found order ID with " + orderId);
    }
  
    String currentStatus = order.getStatus();

    if (!OrderStatusUtil.isValidTransition(currentStatus, newStatus)) {
      throw new IllegalStateException("Cannot change state from " + currentStatus + " to " + newStatus);
    }

    orderMapper.updateOrderStatus(orderId, newStatus.toLowerCase());
  }

  

}
