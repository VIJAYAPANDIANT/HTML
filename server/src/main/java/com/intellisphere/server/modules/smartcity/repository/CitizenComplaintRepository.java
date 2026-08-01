package com.intellisphere.server.modules.smartcity.repository;

import com.intellisphere.server.modules.smartcity.entity.CitizenComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface CitizenComplaintRepository extends JpaRepository<CitizenComplaint, UUID> {
}
