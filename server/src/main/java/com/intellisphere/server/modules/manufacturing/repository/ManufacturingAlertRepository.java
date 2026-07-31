package com.intellisphere.server.modules.manufacturing.repository;

import com.intellisphere.server.modules.manufacturing.entity.ManufacturingAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ManufacturingAlertRepository extends JpaRepository<ManufacturingAlert, UUID> {
    List<ManufacturingAlert> findByStatus(String status);
    List<ManufacturingAlert> findBySeverity(String severity);
}
