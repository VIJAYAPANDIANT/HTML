package com.intellisphere.server.modules.smartcity.repository;

import com.intellisphere.server.modules.smartcity.entity.SmartCityAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface SmartCityAlertRepository extends JpaRepository<SmartCityAlert, UUID> {
}
