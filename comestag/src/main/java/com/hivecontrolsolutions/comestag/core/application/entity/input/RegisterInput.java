package com.hivecontrolsolutions.comestag.core.application.entity.input;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;

import java.time.LocalDate;
import java.util.Set;

public record RegisterInput(AccountType type, String email, String password,
                            String displayName, Long industryId, LocalDate established,
                            String size, String country, String state, String city,
                            String website, String whoWeAre, String whatWeDo,
                            Set<Long> interests) {
}
