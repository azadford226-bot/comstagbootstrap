package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthProcessorIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void registerOrg_validPayload_returnsCreated() throws Exception {
        String payload = """
                {
                  "displayName": "New Organization Ltd",
                  "industryId": 1,
                  "whoWeAre": "We build products",
                  "whatWeDo": "Software services",
                  "size": "50-200",
                  "established": "2020-01-01",
                  "website": "https://neworg.example.com",
                  "country": "United States",
                  "state": "California",
                  "city": "San Francisco",
                  "email": "neworg@company-example.com",
                  "password": "SecurePass123!"
                }
                """;

        mockMvc.perform(post("/v1/auth/register/org")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated());
    }

    @Test
    void registerCons_validPayload_returnsCreated() throws Exception {
        String payload = """
                {
                  "displayName": "John Doe",
                  "industryId": 2,
                  "interests": [1,2],
                  "size": "Individual",
                  "established": "2021-01-01",
                  "website": "https://consumer.example.com",
                  "country": "Canada",
                  "state": "Ontario",
                  "city": "Toronto",
                  "email": "newconsumer@company-example.com",
                  "password": "SecurePass123!"
                }
                """;

        mockMvc.perform(post("/v1/auth/register/cons")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated());
    }

    @Test
    void registerOrg_invalidEmail_returnsBadRequest() throws Exception {
        String payload = """
                {
                  "displayName": "Bad Email Org",
                  "industryId": 1,
                  "whoWeAre": "We build products",
                  "whatWeDo": "Software services",
                  "size": "50-200",
                  "established": "2020-01-01",
                  "website": "https://bad.example.com",
                  "country": "United States",
                  "state": "California",
                  "city": "San Francisco",
                  "email": "invalidemail",
                  "password": "SecurePass123!"
                }
                """;

        mockMvc.perform(post("/v1/auth/register/org")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_missingPassword_returnsBadRequest() throws Exception {
        String invalidJson = "{\"email\":\"test@company.com\"}";

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}
