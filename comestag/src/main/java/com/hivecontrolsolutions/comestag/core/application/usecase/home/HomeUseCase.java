package com.hivecontrolsolutions.comestag.core.application.usecase.home;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutInput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.HashtagDm;
import com.hivecontrolsolutions.comestag.core.domain.model.IndustryDm;
import com.hivecontrolsolutions.comestag.core.domain.port.HashtagPort;
import com.hivecontrolsolutions.comestag.core.domain.port.IndustryPort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.home.HomeDynamicResponse;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@UseCase
@RequiredArgsConstructor
public class HomeUseCase implements UsecaseWithoutInput<HomeDynamicResponse> {
    private final HashtagPort hashtagPort;
    private final IndustryPort industryPort;

    @Override
    public HomeDynamicResponse execute() {
        var industries = industryPort.getAll();
        var hashtags = hashtagPort.getAll();
        return homeDynamicResponse(industries,hashtags);
    }

    private HomeDynamicResponse homeDynamicResponse(Set<IndustryDm> industries, Set<HashtagDm> hashtags) {

            return new HomeDynamicResponse(
                    industries,
                    hashtags,
                    Set.of("0-10", "10-50", "100-500", "500-1000", "1000+")
            );
    }

}
