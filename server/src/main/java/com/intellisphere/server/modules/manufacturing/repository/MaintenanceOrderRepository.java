package com.intellisphere.server.modules.manufacturing.repository;

import com.intellisphere.server.modules.manufacturing.entity.MaintenanceOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MaintenanceOrderRepository extends JpaRepository<MaintenanceOrder, UUID> {
    List<MaintenanceOrder> findByStatus(String status);
}
