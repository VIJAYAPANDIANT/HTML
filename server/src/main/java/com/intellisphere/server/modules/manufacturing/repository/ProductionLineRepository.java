package com.intellisphere.server.modules.manufacturing.repository;

import com.intellisphere.server.modules.manufacturing.entity.ProductionLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProductionLineRepository extends JpaRepository<ProductionLine, UUID> {
}
