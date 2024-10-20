package us.congressionalappchallenge.socialpulse.service.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.BusinessEntity;

import java.util.UUID;

@Repository
public interface BusinessRepository extends JpaRepository<BusinessEntity, UUID> {}
