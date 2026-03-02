package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RfqInvitedOrganizationId implements Serializable {
    private UUID rfqId;
    private UUID organizationId;
}


