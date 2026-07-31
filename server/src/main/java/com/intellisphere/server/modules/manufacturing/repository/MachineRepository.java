package com.intellisphere.server.modules.manufacturing.repository;

import com.intellisphere.server.modules.manufacturing.entity.Machine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MachineRepository extends JpaRepository<Machine, UUID> {
    List<Machine> findByStatus(String status);
    List<Machine> findByProductionLine(String productionLine);
}
