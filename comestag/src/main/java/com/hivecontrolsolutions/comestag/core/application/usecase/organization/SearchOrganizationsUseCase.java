package com.hivecontrolsolutions.comestag.core.application.usecase.organization;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.OrganizationDm;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.UUID;

/**
 * Searches approved organizations for the in-app company directory / "new message" picker.
 * Excludes the current account and (when a query is given) matches on display name.
 */
@UseCase
@RequiredArgsConstructor
public class SearchOrganizationsUseCase implements Usecase<SearchOrganizationsUseCase.Input, Page<OrganizationDm>> {

    private static final int PAGE_SIZE = 20;

    private final OrganizationPort organizationPort;

    public record Input(UUID excludeAccountId, String query, int page) {}

    @Override
    public Page<OrganizationDm> execute(Input in) {
        String q = in.query() == null ? "" : in.query().trim();
        int page = Math.max(0, in.page());
        return organizationPort.search(in.excludeAccountId(), q, page, PAGE_SIZE);
    }
}
