package com.hivecontrolsolutions.comestag.core.application.usecase.rfq;

import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateRfqInput;
import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaStatus;
import com.hivecontrolsolutions.comestag.core.domain.port.MediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqMediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreateRfqUseCaseTest {

    @Mock
    private RfqPort rfqPort;

    @Mock
    private MediaPort mediaPort;

    @Mock
    private RfqMediaPort rfqMediaPort;

    @InjectMocks
    private CreateRfqUseCase createRfqUseCase;

    private UUID organizationId;
    private UUID rfqId;

    @BeforeEach
    void setUp() {
        organizationId = UUID.randomUUID();
        rfqId = UUID.randomUUID();

        when(rfqPort.create(any(), any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(RfqDm.builder().id(rfqId).organizationId(organizationId).build());
    }

    @Test
    void execute_withPublicRfq_noMediaOrInvites_createsRfqOnly() {
        CreateRfqInput input = CreateRfqInput.builder()
                .organizationId(organizationId)
                .title("Software Development Services")
                .description("We need a team to develop a mobile application")
                .category("Technology")
                .industryId(1L)
                .budget(new BigDecimal("50000.00"))
                .budgetCurrency("USD")
                .deadline(Instant.now().plus(30, ChronoUnit.DAYS))
                .requirements("React Native experience")
                .visibility(RfqDm.RfqVisibility.PUBLIC)
                .build();

        createRfqUseCase.execute(input);

        verify(rfqPort).create(eq(organizationId), eq(input.title()), eq(input.description()), eq(input.category()),
                eq(input.industryId()), eq(input.budget()), eq(input.budgetCurrency()), eq(input.deadline()),
                eq(input.requirements()), eq(input.visibility()));
        verify(rfqPort, never()).inviteOrganizations(any(), any());
        verify(mediaPort, never()).getExistingIdsByOrgIdAndIdIn(any(), any());
        verify(rfqMediaPort, never()).create(any(), any());
    }

    @Test
    void execute_withInvitedOrganizations_invitesThem() {
        List<UUID> invited = List.of(UUID.randomUUID(), UUID.randomUUID());
        CreateRfqInput input = CreateRfqInput.builder()
                .organizationId(organizationId)
                .title("Invite-only RFQ")
                .description("Private bid")
                .category("Technology")
                .industryId(2L)
                .budget(new BigDecimal("120000.00"))
                .budgetCurrency("USD")
                .deadline(Instant.now().plus(10, ChronoUnit.DAYS))
                .visibility(RfqDm.RfqVisibility.INVITE_ONLY)
                .invitedOrganizationIds(invited)
                .build();

        createRfqUseCase.execute(input);

        verify(rfqPort).inviteOrganizations(rfqId, invited);
    }

    @Test
    void execute_withMedia_linksOnlyUnlinkedMedia() {
        UUID m1 = UUID.randomUUID();
        UUID m2 = UUID.randomUUID();
        Set<UUID> mediaIds = Set.of(m1, m2);

        MediaDm unlinked = MediaDm.builder().id(m1).status(MediaStatus.UNLINKED).build();
        MediaDm linked = MediaDm.builder().id(m2).status(MediaStatus.LINKED).build();

        when(mediaPort.getExistingIdsByOrgIdAndIdIn(eq(organizationId), eq(mediaIds)))
                .thenReturn(Set.of(unlinked, linked));

        CreateRfqInput input = CreateRfqInput.builder()
                .organizationId(organizationId)
                .title("RFQ with media")
                .description("Needs attachments")
                .category("Technology")
                .industryId(3L)
                .budget(new BigDecimal("10000.00"))
                .budgetCurrency("USD")
                .deadline(Instant.now().plus(5, ChronoUnit.DAYS))
                .visibility(RfqDm.RfqVisibility.PUBLIC)
                .mediaIds(List.of(m1, m2))
                .build();

        createRfqUseCase.execute(input);

        verify(mediaPort).getExistingIdsByOrgIdAndIdIn(organizationId, mediaIds);
        verify(rfqMediaPort).create(rfqId, Set.of(m1));
    }
}
