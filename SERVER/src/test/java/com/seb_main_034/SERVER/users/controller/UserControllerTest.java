package com.seb_main_034.SERVER.users.controller;

import com.google.gson.Gson;
import com.seb_main_034.SERVER.users.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Gson gson;

    @Autowired
    private UserService service;

    @Test
    void info() {
    }

    @Test
    void allUsers() {
    }

    @Test
    void signUp() {
    }

    @Test
    void update() {
    }

    @Test
    void updatePassword() {
    }

    @Test
    void delete() {
    }

    @Test
    void deleteAll() {
    }
}