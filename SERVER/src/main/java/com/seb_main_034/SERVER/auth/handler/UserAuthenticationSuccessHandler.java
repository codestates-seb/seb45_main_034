package com.seb_main_034.SERVER.auth.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seb_main_034.SERVER.users.entity.Users;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class UserAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    // 인증에 성공했을시.
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        ObjectMapper objectMapper = new ObjectMapper();
        Users principal = (Users) authentication.getPrincipal();
        String nickName = principal.getNickName();

        response.setStatus(HttpStatus.OK.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), nickName);

        log.info("{} 회원 로그인 성공", principal);

    }
}
