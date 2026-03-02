package com.hivecontrolsolutions.comestag.entrypoint.web.home;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.home.HomeUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.home.HomeDynamicResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Processor
@RequestMapping("/home")
@RequiredArgsConstructor
public class HomeDynamicProcessor {

    private final HomeUseCase useCase;
    @GetMapping("/dynamic")
    @Operation(summary = "Get repeated data",
            description = """
                    Use this endpoint to allow site to use general data will be used in different pages.
                    There is no need to authenticate this endpoint.
                    """
    )
    public ResponseEntity<HomeDynamicResponse> dynamic() {

        return ResponseEntity.ok(useCase.execute());
    }
}
