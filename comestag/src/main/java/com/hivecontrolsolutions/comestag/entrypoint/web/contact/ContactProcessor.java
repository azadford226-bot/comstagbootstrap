package com.hivecontrolsolutions.comestag.entrypoint.web.contact;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.contact.SubmitContactFormUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.contact.ContactRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.CREATED;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/contact")
@RestController
@Slf4j
public class ContactProcessor {

    private final SubmitContactFormUseCase useCase;

    @PostMapping
    @Operation(summary = "Submit contact form",
            description = "Submit a contact form message. The message will be sent via email to info@comstag.com.")
    public ResponseEntity<Void> submitContactForm(@Valid @RequestBody ContactRequest request) {
        try {
            log.info("Received contact form submission from: {}", request.email());
            
            var input = new SubmitContactFormUseCase.Input(
                    request.name(),
                    request.email(),
                    request.subject(),
                    request.message()
            );
            
            useCase.execute(input);
            log.info("Contact form submission processed successfully for: {}", request.email());
            
            return ResponseEntity.status(CREATED).build();
        } catch (Exception e) {
            log.error("Error processing contact form submission from: {}", request.email(), e);
            throw e; // Let GlobalExceptionHandler handle it
        }
    }
}
