package com.hivecontrolsolutions.comestag.entrypoint.web.rfq;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class RfqProcessorIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createRfq_unauthorized_returnsUnauthorized() throws Exception {
        String payload = """
                {
                  "title": "Software Development Project",
                  "description": "We need developers for a 6-month project",
                  "category": "Technology",
                  "industryId": 1,
                  "budget": 100000.00,
                  "budgetCurrency": "USD",
                  "deadline": "2030-01-01T00:00:00Z",
                  "requirements": "Senior team",
                  "visibility": "PUBLIC"
                }
                """;

        mockMvc.perform(post("/v1/rfq")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void listRfqs_unauthorized_returnsUnauthorized() throws Exception {
        mockMvc.perform(get("/v1/rfq")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isUnauthorized());
    }
}
