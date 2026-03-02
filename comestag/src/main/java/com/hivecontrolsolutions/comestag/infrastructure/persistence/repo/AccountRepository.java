package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<AccountEntity, UUID> {
    @Modifying
    @Query("UPDATE AccountEntity a SET a.status = :status WHERE a.id = :id")
    int changeStatus(AccountStatus  status, UUID id);

    @Modifying
    @Query("UPDATE AccountEntity a SET a.emailVerified=TRUE  WHERE a.id = :id")
    int verifyEmail( UUID id);

    @Modifying
    @Query("UPDATE AccountEntity a SET a.passwordHash=:hashPassword WHERE a.id = :id")
    int updatePasswordHash(UUID id, String hashPassword);

    Optional<AccountEntity> findByEmail(String email);

    @Modifying
    @Query("UPDATE AccountEntity a SET a.displayName=:displayName WHERE a.id=:userId")
    void updateDisplayName(UUID userId, String displayName);

    @Modifying
    @Query("UPDATE AccountEntity a SET a.email=:email, a.emailVerified=FALSE WHERE a.id=:userId")
    void updateEmail(UUID userId, String email);

    @Modifying
    @Query("UPDATE AccountEntity a SET a.email=:email, a.emailVerified=TRUE WHERE a.id=:userId")
    void restoreEmail(UUID userId, String email);
    
    long countByType(com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType type);
}
