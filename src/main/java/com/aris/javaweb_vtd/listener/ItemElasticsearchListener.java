package com.aris.javaweb_vtd.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.aris.javaweb_vtd.elasticsearch.service.ItemElasticService;
import com.aris.javaweb_vtd.event.ItemCreatedEvent;

@Component
public class ItemElasticsearchListener {

    @Autowired
    private ItemElasticService itemElasticService;

    @EventListener
    @Async // Chạy bất đồng bộ để không block main thread
    public void handleItemCreated(ItemCreatedEvent event) {
        try {
            itemElasticService.indexItem(event.getItem());
            System.out.println("New item automatically indexed to Elasticsearch: " + event.getItem().getId());
        } catch (Exception e) {
            System.err.println("Failed to index new item to Elasticsearch: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
