package com.intellisphere.server;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.autoconfigure.exclude=org.springframework.ai.autoconfigure.openai.OpenAiAutoConfiguration"
})
@AutoConfigureMockMvc
@WithMockUser(username = "admin@intellisphere.com", roles = {"ADMIN"})
public class PlatformControllersTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testDashboardOverviewEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/overview"))
                .andExpect(status().isOk());
    }

    @Test
    public void testAiChatEndpoint() throws Exception {
        mockMvc.perform(post("/api/ai/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"prompt\":\"Hello AI\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testSmartCityReportEndpoint() throws Exception {
        mockMvc.perform(post("/api/smartcity/report")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"predictions\":\"Low risk simulated predictions\",\"userNotes\":\"Briefing text\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testSmartCityTrafficEndpoint() throws Exception {
        mockMvc.perform(get("/api/smartcity/traffic"))
                .andExpect(status().isOk());
    }
}
