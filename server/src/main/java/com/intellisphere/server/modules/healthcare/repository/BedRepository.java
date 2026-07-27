package com.intellisphere.server.modules.healthcare.repository;

import com.intellisphere.server.modules.healthcare.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface BedRepository extends JpaRepository<Bed, UUID> {
}
